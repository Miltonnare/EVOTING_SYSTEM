<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Candidate;
use App\Models\Category;
use App\Models\Election;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function dashboardStats(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionOfficer()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => User::count(),
                'total_voters' => User::where('role', 'voter')->count(),
                'total_elections' => Election::count(),
                'active_elections' => Election::where('status', 'active')->count(),
                'total_votes_cast' => Vote::count(),
                'total_audit_events' => AuditLog::count(),
            ],
            'recent_elections' => Election::orderBy('created_at', 'desc')->take(5)->get(),
            'recent_audit_logs' => AuditLog::with('user')->orderBy('created_at', 'desc')->take(10)->get(),
        ]);
    }

    public function usersIndex(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !$user->isElectionOfficer()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    public function updateUserRoleStatus(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        if (!$admin || !$admin->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Only Super Admin can update roles and user status.'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'role' => 'sometimes|required|in:super_admin,election_admin,election_officer,voter,auditor',
            'status' => 'sometimes|required|in:active,pending,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['role', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'user' => $user
        ]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, ['super_admin', 'election_admin', 'election_officer', 'auditor'])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        return response()->json([
            'success' => true,
            'audit_logs' => $logs
        ]);
    }

    public function healthCheck(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'database' => 'connected',
            'environment' => config('app.env'),
            'version' => '2.0.0-enterprise',
        ]);
    }
}
