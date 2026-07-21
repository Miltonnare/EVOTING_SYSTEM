<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voter_participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('election_id')->constrained('elections')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('receipt_code')->unique();
            $table->timestamp('voted_at')->useCurrent();

            $table->unique(['user_id', 'category_id', 'election_id'], 'unique_participation_per_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voter_participations');
    }
};
