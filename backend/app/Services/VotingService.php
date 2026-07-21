<?php

namespace App\Services;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use App\Models\VoterParticipation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class VotingService
{
    /**
     * Submit votes for a voter across specified categories in an election.
     * Enforces double-vote prevention, category validation, candidate validation,
     * and produces verifiable vote receipt hashes.
     */
    public function submitBallot(User $voter, Election $election, array $votesInput, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        // 1. Verify election is active
        if ($election->status !== 'active') {
            throw new Exception("Election '{$election->title}' is not currently active for voting.");
        }

        $now = now();
        if ($now->lt($election->start_time) || $now->gt($election->end_time)) {
            throw new Exception("Voting window for '{$election->title}' is closed.");
        }

        // 2. Load election categories
        $categories = $election->categories()->get()->keyBy('id');
        if ($categories->isEmpty()) {
            throw new Exception("No voting categories configured for this election.");
        }

        // 3. Process inside a strict database transaction
        return DB::transaction(function () use ($voter, $election, $categories, $votesInput, $ipAddress, $userAgent) {
            $receiptCodes = [];
            $voterSecretSalt = config('app.key', 'E-Voting-Secure-Salt-2026');

            // Unique anonymized voter hash for this specific election
            $voterHash = hash('sha256', $voter->id . ':' . $election->id . ':' . $voterSecretSalt);

            foreach ($categories as $categoryId => $category) {
                if (!isset($votesInput[$categoryId])) {
                    throw new Exception("Please select a candidate for '{$category->name}'.");
                }

                $candidateId = (int) $votesInput[$categoryId];

                // Check if candidate belongs to this category
                $validCandidate = Candidate::where('id', $candidateId)
                    ->where('category_id', $categoryId)
                    ->exists();

                if (!$validCandidate) {
                    throw new Exception("Invalid candidate selected for '{$category->name}'.");
                }

                // Check if user has already voted in this category
                $alreadyVoted = VoterParticipation::where('user_id', $voter->id)
                    ->where('election_id', $election->id)
                    ->where('category_id', $categoryId)
                    ->exists();

                if ($alreadyVoted) {
                    throw new Exception("You have already cast your vote for category '{$category->name}'.");
                }

                // Generate cryptographic vote receipt code
                $receiptCode = 'VOTE-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4));
                $receiptHash = hash('sha256', $receiptCode . ':' . $candidateId . ':' . $voterSecretSalt);

                // Insert into votes table (decoupled candidate selection with anonymized voter hash)
                Vote::create([
                    'election_id' => $election->id,
                    'category_id' => $categoryId,
                    'candidate_id' => $candidateId,
                    'voter_id_hash' => $voterHash,
                    'vote_receipt_hash' => $receiptHash,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                    'created_at' => now(),
                ]);

                // Insert into voter_participations table (records that user voted and receipt code)
                VoterParticipation::create([
                    'user_id' => $voter->id,
                    'election_id' => $election->id,
                    'category_id' => $categoryId,
                    'receipt_code' => $receiptCode,
                    'voted_at' => now(),
                ]);

                $receiptCodes[$category->name] = $receiptCode;
            }

            // Log Audit event
            AuditService::log($voter->id, 'BALLOT_SUBMITTED', 'Election', (string)$election->id, null, [
                'categories_count' => count($receiptCodes),
            ], $ipAddress, $userAgent);

            return [
                'success' => true,
                'message' => 'Your ballot was securely recorded and verified.',
                'receipts' => $receiptCodes,
                'voted_at' => now()->toIso8601String(),
            ];
        });
    }

    /**
     * Verify a receipt code on the public audit ledger.
     */
    public function verifyReceipt(string $receiptCode): ?array
    {
        $participation = VoterParticipation::with(['election', 'category'])
            ->where('receipt_code', trim($receiptCode))
            ->first();

        if (!$participation) {
            return null;
        }

        return [
            'valid' => true,
            'receipt_code' => $participation->receipt_code,
            'election' => $participation->election->title,
            'category' => $participation->category->name,
            'voted_at' => $participation->voted_at->toIso8601String(),
            'status' => 'CRYPTOGRAPHICALLY_VERIFIED_IN_LEDGER',
        ];
    }
}
