<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResultController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getResults(Request $request, int $electionId): JsonResponse
    {
        $election = Election::with(['categories.candidates'])->find($electionId);

        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $user = $request->user();
        if (!$election->is_published && (!$user || !in_array($user->role, ['super_admin', 'election_admin', 'election_officer', 'auditor']))) {
            return response()->json([
                'success' => false,
                'message' => 'Election results have not been published yet.'
            ], 403);
        }

        $data = $this->analyticsService->getElectionResults($election);

        return response()->json([
            'success' => true,
            'results' => $data
        ]);
    }

    public function exportResults(Request $request, int $electionId, string $format)
    {
        $election = Election::with(['categories.candidates'])->find($electionId);

        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $data = $this->analyticsService->getElectionResults($election);

        if (strtolower($format) === 'csv') {
            $response = new StreamedResponse(function () use ($data) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['Election Title', 'Category', 'Candidate Name', 'Party', 'Vote Count', 'Percentage (%)', 'Winner Status']);

                foreach ($data['categories'] as $category) {
                    foreach ($category['candidates'] as $candidate) {
                        fputcsv($handle, [
                            $data['election']['title'],
                            $category['name'],
                            $candidate['name'],
                            $candidate['party_affiliation'] ?? 'N/A',
                            $candidate['vote_count'],
                            $candidate['percentage'],
                            $candidate['is_winner'] ? 'WINNER' : 'Runner Up',
                        ]);
                    }
                }
                fclose($handle);
            });

            $response->headers->set('Content-Type', 'text/csv');
            $response->headers->set('Content-Disposition', 'attachment; filename="election-results-' . $election->id . '.csv"');

            return $response;
        }

        return response()->json(['success' => false, 'message' => 'Format unsupported.'], 400);
    }
}
