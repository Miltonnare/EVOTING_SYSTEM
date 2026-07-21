<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Category;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
{
    public function store(Request $request, int $categoryId): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $category = Category::find($categoryId);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'party_affiliation' => 'nullable|string|max:255',
            'photo_url' => 'nullable|string|max:500',
            'biography' => 'nullable|string',
            'manifesto' => 'nullable|string',
            'display_order' => 'integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $candidate = Candidate::create([
            'category_id' => $category->id,
            'name' => $request->name,
            'party_affiliation' => $request->party_affiliation,
            'photo_url' => $request->photo_url,
            'biography' => $request->biography,
            'manifesto' => $request->manifesto,
            'display_order' => $request->display_order ?? 0,
        ]);

        AuditService::log($user->id, 'CANDIDATE_CREATED', 'Candidate', (string)$candidate->id, null, $candidate->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Candidate created successfully.',
            'candidate' => $candidate
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $candidate = Candidate::find($id);
        if (!$candidate) {
            return response()->json(['success' => false, 'message' => 'Candidate not found.'], 404);
        }

        $candidate->update($request->only(['name', 'party_affiliation', 'photo_url', 'biography', 'manifesto', 'display_order']));

        AuditService::log($user->id, 'CANDIDATE_UPDATED', 'Candidate', (string)$candidate->id, null, $candidate->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Candidate updated successfully.',
            'candidate' => $candidate
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $candidate = Candidate::find($id);
        if (!$candidate) {
            return response()->json(['success' => false, 'message' => 'Candidate not found.'], 404);
        }

        $candidate->delete();

        AuditService::log($user->id, 'CANDIDATE_DELETED', 'Candidate', (string)$id);

        return response()->json([
            'success' => true,
            'message' => 'Candidate deleted successfully.'
        ]);
    }
}
