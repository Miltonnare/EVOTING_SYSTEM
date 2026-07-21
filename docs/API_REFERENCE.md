# REST API Reference: CivicVote API v1

Base URL: `/api/v1`

## Authentication

### POST `/auth/register`
Register a new voter account.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "phone_number": "+254700000000",
  "national_id": "NAT88776655"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": 5,
    "uuid": "8f3b2a1c-...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "voter"
  },
  "token": "1|sanctum_plain_text_token..."
}
```

### POST `/auth/login`
Authenticate user and receive Bearer API token.

**Request Body:**
```json
{
  "email": "alice@gmail.com",
  "password": "VoterPass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "2|sanctum_token..."
}
```

---

## Elections & Voting

### GET `/elections`
List available active and published elections.

### GET `/elections/{id}/ballot` (Protected)
Fetch ballot categories, max selections, and candidate profiles for a specific voter.

### POST `/elections/{id}/vote` (Protected)
Cast ballot selections for categories in an election.

**Request Body:**
```json
{
  "votes": {
    "1": 2,
    "2": 4
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Your ballot was securely recorded and verified.",
  "receipts": {
    "Presidential Election": "VOTE-A1B2-C3D4-E5F6"
  }
}
```

### GET `/votes/verify/{receiptCode}`
Verify receipt code inclusion on the public audit ledger.

---

## Results & Analytics

### GET `/elections/{id}/results`
Fetch live turnout percentages, aggregate category votes, and candidate standings.

### GET `/elections/{id}/export/csv`
Download election results in CSV format.
