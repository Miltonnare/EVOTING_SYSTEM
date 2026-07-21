<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'John Voter',
            'email' => 'john.voter@example.com',
            'password' => 'Password123!',
            'phone_number' => '+254711223344',
            'national_id' => 'NAT99887766',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'user' => ['id', 'uuid', 'name', 'email', 'role'],
                'token',
            ]);

        $this->assertDatabaseHas('users', ['email' => 'john.voter@example.com']);
    }

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test.login@example.com',
            'password' => bcrypt('SecretPass123!'),
            'role' => 'voter',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test.login@example.com',
            'password' => 'SecretPass123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user' => [
                    'email' => 'test.login@example.com',
                ]
            ])
            ->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_invalid_password()
    {
        $user = User::factory()->create([
            'email' => 'wrong.pass@example.com',
            'password' => bcrypt('CorrectPassword123!'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'wrong.pass@example.com',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['success' => false]);
    }
}
