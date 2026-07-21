<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\VoterParticipation;
use App\Services\VotingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VotingController extends Controller
{
    protected VotingService $votingService;

    public function __construct(VotingService $votingService)
    {
        $this->votingService = $votingService;
    }

    public function getBallot(Request $request, int $electionId): JsonResponse
    {
        $user = $request->user();
        $election = Election::with(['categories.candidates'])->find($electionId);

        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        // Get categories voter has already participated in for this election
        $participatedCategoryIds = VoterParticipation::where('user_id', $user->id)
            ->where('election_id', $election->id)
            ->pluck('category_id')
            ->toArray();

        return response()->json([
            'success' => true,
            'election' => [
                'id' => $election->id,
                'uuid' => $election->uuid,
                'title' => $election->title,
                'description' => $election->description,
                'status' => $election->status,
                'is_active' => $election->isActive(),
                'start_time' => $election->start_time->toIso8601String(),
                'end_time' => $election->end_time->toIso8601String(),
            ],
            'categories' => $election->categories->map(function ($category) use ($participatedCategoryIds) {
                return [
                    'id' => $category->id,
                    'uuid' => $category->uuid,
                    'name' => $category->name,
                    'description' => $category->description,
                    'max_selections' => $category->max_selections,
                    'has_voted' => in_array($category->id, $participatedCategoryIds),
                    'candidates' => $category->candidates->map(function ($candidate) {
                        return [
                            'id' => $candidate->id,
                            'uuid' => $candidate->uuid,
                            'name' => $candidate->name,
                            'party_affiliation' => $candidate->party_affiliation,
                            'photo_url' => $candidate->photo_url,
                            'biography' => $candidate->biography,
                            'manifesto' => $candidate->manifesto,
                        ];
                    }),
                ];
            }),
            'voter_has_completed' => count($participatedCategoryIds) >= $election->categories->count() && $election->categories->count() > 0,
        ]);
    }

    public function submitVote(Request $request, int $electionId): JsonResponse
    {
        $user = $request->user();
        $election = Election::find($electionId);

        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'votes' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->votingService->submitBallot(
                $user,
                $election,
                $request->votes,
                $request->ip(),
                $request->userAgent()
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function verifyReceipt(string $receiptCode): JsonResponse
    {
        $result = $this->votingService->verifyReceipt($receiptCode);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or unverified receipt code.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'receipt' => $result
        ]);
    }

    public function voterHistory(Request $request): JsonResponse
    {
        $user = $request->user();
        $participations = VoterParticipation::with(['election', 'category'])
            ->where('user_id', $user->id)
            ->orderBy('voted_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'participations' => $participations
        ]);
    }
}
