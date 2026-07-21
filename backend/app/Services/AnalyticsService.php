<?php

namespace App\Services;

use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use App\Models\VoterParticipation;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get election results, turnout, percentages and winner indicators.
     */
    public function getElectionResults(Election $election): array
    {
        $totalRegisteredVoters = User::where('role', 'voter')->where('status', 'active')->count();

        // Get total unique voters who participated in this election
        $totalParticipatedVoters = VoterParticipation::where('election_id', $election->id)
            ->distinct('user_id')
            ->count('user_id');

        $turnoutPercentage = $totalRegisteredVoters > 0 
            ? round(($totalParticipatedVoters / $totalRegisteredVoters) * 100, 2) 
            : 0;

        $categoriesData = [];

        foreach ($election->categories as $category) {
            $candidates = $category->candidates;
            
            // Total votes cast for this category
            $categoryVotesCount = Vote::where('election_id', $election->id)
                ->where('category_id', $category->id)
                ->count();

            // Vote counts per candidate
            $votesPerCandidate = Vote::where('election_id', $election->id)
                ->where('category_id', $category->id)
                ->select('candidate_id', DB::raw('count(*) as count'))
                ->groupBy('candidate_id')
                ->pluck('count', 'candidate_id')
                ->toArray();

            $candidateResults = [];
            $highestVotes = -1;
            $winningCandidateId = null;

            foreach ($candidates as $candidate) {
                $count = $votesPerCandidate[$candidate->id] ?? 0;
                $percentage = $categoryVotesCount > 0 ? round(($count / $categoryVotesCount) * 100, 2) : 0;

                if ($count > $highestVotes) {
                    $highestVotes = $count;
                    $winningCandidateId = $candidate->id;
                }

                $candidateResults[] = [
                    'id' => $candidate->id,
                    'uuid' => $candidate->uuid,
                    'name' => $candidate->name,
                    'party_affiliation' => $candidate->party_affiliation,
                    'photo_url' => $candidate->photo_url,
                    'biography' => $candidate->biography,
                    'manifesto' => $candidate->manifesto,
                    'vote_count' => $count,
                    'percentage' => $percentage,
                    'is_winner' => false, // Set below
                ];
            }

            // Mark winner if there are votes
            if ($categoryVotesCount > 0 && $winningCandidateId) {
                foreach ($candidateResults as &$cand) {
                    if ($cand['id'] === $winningCandidateId) {
                        $cand['is_winner'] = true;
                    }
                }
            }

            $categoriesData[] = [
                'id' => $category->id,
                'uuid' => $category->uuid,
                'name' => $category->name,
                'description' => $category->description,
                'total_category_votes' => $categoryVotesCount,
                'candidates' => $candidateResults,
            ];
        }

        return [
            'election' => [
                'id' => $election->id,
                'uuid' => $election->uuid,
                'title' => $election->title,
                'status' => $election->status,
                'start_time' => $election->start_time->toIso8601String(),
                'end_time' => $election->end_time->toIso8601String(),
            ],
            'turnout' => [
                'registered_voters' => $totalRegisteredVoters,
                'participated_voters' => $totalParticipatedVoters,
                'turnout_percentage' => $turnoutPercentage,
            ],
            'categories' => $categoriesData,
        ];
    }
}
