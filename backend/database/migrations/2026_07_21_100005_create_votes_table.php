<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('election_id')->constrained('elections')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->string('voter_id_hash'); // SHA-256 hash of voter ID + election secret
            $table->string('vote_receipt_hash'); // SHA-256 receipt for voter validation
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Strict DB Unique constraint enforcing exactly 1 vote per category per election per voter
            $table->unique(['voter_id_hash', 'category_id', 'election_id'], 'unique_vote_per_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
