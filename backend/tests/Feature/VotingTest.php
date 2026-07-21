<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Election;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VotingTest extends TestCase
{
    use RefreshDatabase;

    protected User $voter;
    protected Election $election;
    protected Category $category;
    protected Candidate $candidate1;
    protected Candidate $candidate2;

    protected function setUp(): void
    {
        parent::setUp();

        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->voter = User::factory()->create(['role' => 'voter', 'status' => 'active']);

        $this->election = Election::create([
            'title' => 'Test General Election',
            'slug' => 'test-general-election',
            'description' => 'Test election description',
            'start_time' => now()->subHour(),
            'end_time' => now()->addHours(5),
            'status' => 'active',
            'is_published' => true,
            'created_by' => $admin->id,
        ]);

        $this->category = Category::create([
            'election_id' => $this->election->id,
            'name' => 'President',
            'slug' => 'president',
            'description' => 'Presidential category',
            'display_order' => 1,
            'max_selections' => 1,
        ]);

        $this->candidate1 = Candidate::create([
            'category_id' => $this->category->id,
            'name' => 'Candidate Alpha',
            'party_affiliation' => 'Party A',
        ]);

        $this->candidate2 = Candidate::create([
            'category_id' => $this->category->id,
            'name' => 'Candidate Beta',
            'party_affiliation' => 'Party B',
        ]);
    }

    public function test_voter_can_get_ballot()
    {
        $response = $this->actingAs($this->voter, 'sanctum')
            ->getJson("/api/v1/elections/{$this->election->id}/ballot");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'election' => ['title' => 'Test General Election'],
            ]);
    }

    public function test_voter_can_cast_vote_successfully()
    {
        $response = $this->actingAs($this->voter, 'sanctum')
            ->postJson("/api/v1/elections/{$this->election->id}/vote", [
                'votes' => [
                    $this->category->id => $this->candidate1->id,
                ]
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Your ballot was securely recorded and verified.',
            ])
            ->assertJsonStructure(['receipts']);
    }

    public function test_duplicate_vote_submission_is_strictly_rejected()
    {
        // First vote
        $this->actingAs($this->voter, 'sanctum')
            ->postJson("/api/v1/elections/{$this->election->id}/vote", [
                'votes' => [
                    $this->category->id => $this->candidate1->id,
                ]
            ]);

        // Attempting second vote for the same category
        $response = $this->actingAs($this->voter, 'sanctum')
            ->postJson("/api/v1/elections/{$this->election->id}/vote", [
                'votes' => [
                    $this->category->id => $this->candidate2->id,
                ]
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }
}
