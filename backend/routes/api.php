<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\VotingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public System Health
    Route::get('/health', [AdminController::class, 'healthCheck']);

    // Authentication Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public Receipt Audit Verification
    Route::get('/votes/verify/{receiptCode}', [VotingController::class, 'verifyReceipt']);

    // Public / Voter Published Results
    Route::get('/elections/{id}/results', [ResultController::class, 'getResults']);
    Route::get('/elections/{id}/export/{format}', [ResultController::class, 'exportResults']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth Info
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Elections
        Route::get('/elections', [ElectionController::class, 'index']);
        Route::get('/elections/{id}', [ElectionController::class, 'show']);
        Route::post('/elections', [ElectionController::class, 'store']);
        Route::put('/elections/{id}', [ElectionController::class, 'update']);
        Route::delete('/elections/{id}', [ElectionController::class, 'destroy']);

        // Categories & Candidates Management
        Route::post('/elections/{electionId}/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/categories/{categoryId}/candidates', [CandidateController::class, 'store']);
        Route::put('/candidates/{id}', [CandidateController::class, 'update']);
        Route::delete('/candidates/{id}', [CandidateController::class, 'destroy']);

        // Voting Workflow
        Route::get('/elections/{id}/ballot', [VotingController::class, 'getBallot']);
        Route::post('/elections/{id}/vote', [VotingController::class, 'submitVote']);
        Route::get('/voter/history', [VotingController::class, 'voterHistory']);

        // Admin & Management Routes
        Route::get('/admin/stats', [AdminController::class, 'dashboardStats']);
        Route::get('/admin/users', [AdminController::class, 'usersIndex']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUserRoleStatus']);
        Route::get('/admin/audit-logs', [AdminController::class, 'auditLogs']);
    });
});
