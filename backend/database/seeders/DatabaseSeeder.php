<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Election;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create System Users with distinct roles
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@evoting.org'],
            [
                'name' => 'System Super Admin',
                'password' => Hash::make('Admin@123456'),
                'phone_number' => '+254700000001',
                'national_id' => 'ADMIN001',
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        $electionAdmin = User::firstOrCreate(
            ['email' => 'election.admin@evoting.org'],
            [
                'name' => 'Electoral Commissioner',
                'password' => Hash::make('Admin@123456'),
                'phone_number' => '+254700000002',
                'national_id' => 'ADMIN002',
                'role' => 'election_admin',
                'status' => 'active',
            ]
        );

        $officer = User::firstOrCreate(
            ['email' => 'officer@evoting.org'],
            [
                'name' => 'Returning Officer Jane',
                'password' => Hash::make('Officer@123456'),
                'phone_number' => '+254700000003',
                'national_id' => 'OFFICER001',
                'role' => 'election_officer',
                'status' => 'active',
            ]
        );

        $auditor = User::firstOrCreate(
            ['email' => 'auditor@evoting.org'],
            [
                'name' => 'Independent Auditor Mark',
                'password' => Hash::make('Auditor@123456'),
                'phone_number' => '+254700000004',
                'national_id' => 'AUDITOR001',
                'role' => 'auditor',
                'status' => 'active',
            ]
        );

        // Seed 5 Realistic Voters
        $voters = [
            ['name' => 'Alice Wambui', 'email' => 'alice@gmail.com', 'national_id' => 'NAT38291011'],
            ['name' => 'Brian Ochieng', 'email' => 'brian@gmail.com', 'national_id' => 'NAT38291012'],
            ['name' => 'Catherine Mutua', 'email' => 'catherine@gmail.com', 'national_id' => 'NAT38291013'],
            ['name' => 'David Hassan', 'email' => 'david@gmail.com', 'national_id' => 'NAT38291014'],
            ['name' => 'Emmanuel Kiprop', 'email' => 'emmanuel@gmail.com', 'national_id' => 'NAT38291015'],
        ];

        foreach ($voters as $vData) {
            User::firstOrCreate(
                ['email' => $vData['email']],
                [
                    'name' => $vData['name'],
                    'password' => Hash::make('VoterPass123!'),
                    'phone_number' => '+2547' . rand(10000000, 99999999),
                    'national_id' => $vData['national_id'],
                    'role' => 'voter',
                    'status' => 'active',
                ]
            );
        }

        // 2. Create Active General Election
        $election = Election::firstOrCreate(
            ['slug' => '2026-national-general-election'],
            [
                'title' => '2026 National General Election',
                'description' => 'Official electronic voting platform for the 2026 General Elections across Presidential, Gubernatorial, and Senatorial categories.',
                'start_time' => now()->subHours(2),
                'end_time' => now()->addDays(7),
                'status' => 'active',
                'is_published' => true,
                'created_by' => $superAdmin->id,
            ]
        );

        // 3. Create Categories (Positions)
        $presidentCat = Category::firstOrCreate(
            ['election_id' => $election->id, 'slug' => 'president'],
            [
                'name' => 'Presidential Election',
                'description' => 'Vote for the Executive President of the Republic.',
                'display_order' => 1,
                'max_selections' => 1,
            ]
        );

        $governorCat = Category::firstOrCreate(
            ['election_id' => $election->id, 'slug' => 'governor'],
            [
                'name' => 'Gubernatorial Election (Nairobi)',
                'description' => 'Vote for the Governor of Nairobi Metropolitan County.',
                'display_order' => 2,
                'max_selections' => 1,
            ]
        );

        $senatorCat = Category::firstOrCreate(
            ['election_id' => $election->id, 'slug' => 'senator'],
            [
                'name' => 'Senatorial Election',
                'description' => 'Vote for your representative in the Senate.',
                'display_order' => 3,
                'max_selections' => 1,
            ]
        );

        // 4. Create Candidates for President
        Candidate::firstOrCreate(
            ['category_id' => $presidentCat->id, 'name' => 'Dr. William Ruto'],
            [
                'party_affiliation' => 'United Democratic Alliance (UDA)',
                'photo_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Experienced public servant advocating economic empowerment and digital governance.',
                'manifesto' => 'Bottom-Up Economic Transformation, modernizing digital infrastructure, and expanding universal healthcare.',
                'display_order' => 1,
            ]
        );

        Candidate::firstOrCreate(
            ['category_id' => $presidentCat->id, 'name' => 'Hon. Raila Odinga'],
            [
                'party_affiliation' => 'Azimio la Umoja Alliance',
                'photo_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Veteran reformist and democracy champion dedicated to institutional integrity and social welfare.',
                'manifesto' => 'Social welfare protection, manufacturing reboot, free secondary education, and zero tolerance for corruption.',
                'display_order' => 2,
            ]
        );

        // Candidates for Governor
        Candidate::firstOrCreate(
            ['category_id' => $governorCat->id, 'name' => 'Johnson Sakaja'],
            [
                'party_affiliation' => 'Metropolitan Progressive Party',
                'photo_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Current city governor championing transit reform and youth enterprise funds.',
                'manifesto' => 'Making the capital city work for everyone through smart traffic systems and green spaces.',
                'display_order' => 1,
            ]
        );

        Candidate::firstOrCreate(
            ['category_id' => $governorCat->id, 'name' => 'Polycarp Igathe'],
            [
                'party_affiliation' => 'Capital Alliance',
                'photo_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Corporate executive committed to fiscal discipline and urban renewal.',
                'manifesto' => 'Corporate governance in city hall, clean water infrastructure, and automated business permitting.',
                'display_order' => 2,
            ]
        );

        // Candidates for Senator
        Candidate::firstOrCreate(
            ['category_id' => $senatorCat->id, 'name' => 'Edwin Sifuna'],
            [
                'party_affiliation' => 'Senate Reform Party',
                'photo_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Constitutional attorney and active legislator focused on county revenue protection.',
                'manifesto' => 'Increased resource allocation for county healthcare and youth innovation centers.',
                'display_order' => 1,
            ]
        );

        Candidate::firstOrCreate(
            ['category_id' => $senatorCat->id, 'name' => 'Bishop Margaret Wanjiru'],
            [
                'party_affiliation' => 'Civic Unity Movement',
                'photo_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                'biography' => 'Community leader advocating for social safety nets and educational scholarships.',
                'manifesto' => 'Strengthening moral leadership, legislative accountability, and community empowerment.',
                'display_order' => 2,
            ]
        );

        // 5. System Settings
        SystemSetting::firstOrCreate(['key' => 'system_name'], ['value' => 'Enterprise E-Voting Platform', 'group' => 'general']);
        SystemSetting::firstOrCreate(['key' => 'allow_voter_registration'], ['value' => 'true', 'group' => 'security']);
        SystemSetting::firstOrCreate(['key' => 'require_audit_logging'], ['value' => 'true', 'group' => 'security']);
    }
}
