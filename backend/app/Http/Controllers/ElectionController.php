<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ElectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Election::with(['categories.candidates']);

        if (!$user || !in_array($user->role, ['super_admin', 'election_admin', 'election_officer', 'auditor'])) {
            $query->where('is_published', true);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $elections = $query->orderBy('start_time', 'desc')->get();

        return response()->json([
            'success' => true,
            'elections' => $elections
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $election = Election::with(['categories.candidates', 'creator'])->find($id);

        if (!$election) {
            return response()->json([
                'success' => false,
                'message' => 'Election not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'election' => $election
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'required|in:draft,scheduled,active,completed,archived',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $election = Election::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(4),
            'description' => $request->description,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => $request->status,
            'is_published' => $request->is_published ?? false,
            'created_by' => $user->id,
        ]);

        AuditService::log($user->id, 'ELECTION_CREATED', 'Election', (string)$election->id, null, $election->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Election created successfully.',
            'election' => $election
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $election = Election::find($id);
        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'status' => 'sometimes|required|in:draft,scheduled,active,completed,archived',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldValues = $election->toArray();
        $election->update($request->only(['title', 'description', 'start_time', 'end_time', 'status', 'is_published']));

        AuditService::log($user->id, 'ELECTION_UPDATED', 'Election', (string)$election->id, $oldValues, $election->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Election updated successfully.',
            'election' => $election
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Only Super Admin can delete elections.'], 403);
        }

        $election = Election::find($id);
        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $election->delete();

        AuditService::log($user->id, 'ELECTION_DELETED', 'Election', (string)$id);

        return response()->json([
            'success' => true,
            'message' => 'Election deleted successfully.'
        ]);
    }
}
