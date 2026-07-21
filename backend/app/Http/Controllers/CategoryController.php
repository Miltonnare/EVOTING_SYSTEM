<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Election;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(Request $request, int $electionId): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $election = Election::find($electionId);
        if (!$election) {
            return response()->json(['success' => false, 'message' => 'Election not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'integer|min:0',
            'max_selections' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $category = Category::create([
            'election_id' => $election->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'display_order' => $request->display_order ?? 0,
            'max_selections' => $request->max_selections ?? 1,
        ]);

        AuditService::log($user->id, 'CATEGORY_CREATED', 'Category', (string)$category->id, null, $category->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'category' => $category
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found.'], 404);
        }

        $category->update($request->only(['name', 'description', 'display_order', 'max_selections']));

        AuditService::log($user->id, 'CATEGORY_UPDATED', 'Category', (string)$category->id, null, $category->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'category' => $category
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found.'], 404);
        }

        $category->delete();

        AuditService::log($user->id, 'CATEGORY_DELETED', 'Category', (string)$id);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.'
        ]);
    }
}
