# Relational Database Schema: CivicVote Engine

Database Engine: **MySQL 8.0 / PostgreSQL**

```
+----------------+       +-------------------+       +--------------------+
|     users      |       |     elections     |       |     categories     |
+----------------+       +-------------------+       +--------------------+
| id (PK)        | <---+ | id (PK)           | <---+ | id (PK)            |
| uuid           |     | | uuid              |     | | uuid               |
| name           |     | | title             |     | | election_id (FK) |
| email          |     | | start_time        |     | | name               |
| role           |     | | end_time          |     | | max_selections   |
| national_id    |     | | status            |     +--------------------+
+----------------+     +-------------------+                  |
        ^                         ^                           v
        |                         |                  +--------------------+
        |                         |                  |     candidates     |
        |                         |                  +--------------------+
        |                         |                  | id (PK)            |
        |                         |                  | category_id (FK)   |
        |                         |                  | name               |
        |                         |                  | party_affiliation  |
        |                         |                  | photo_url          |
        |                         |                  +--------------------+
        |                         |                           ^
        |                         +-------------------+       |
        |                                             |       |
        +---------------+                     +-------+-------+----+
                        |                     |       votes        |
                        v                     +--------------------+
             +---------------------+          | id (PK)            |
             |voter_participations |          | election_id (FK)   |
             +---------------------+          | category_id (FK)   |
             | id (PK)             |          | candidate_id (FK)  |
             | user_id (FK)        |          | voter_id_hash      |
             | election_id (FK)    |          | vote_receipt_hash  |
             | category_id (FK)    |          +--------------------+
             | receipt_code        |
             +---------------------+
```

## Schema Highlights

### `votes` Table
- `voter_id_hash`: SHA-256 string combining user ID + election ID + secret salt.
- `vote_receipt_hash`: SHA-256 string generated at vote submission time.
- **Index**: `UNIQUE (voter_id_hash, category_id, election_id)`

### `voter_participations` Table
- `receipt_code`: Unique alphanumeric string returned to the voter as proof of participation.
- **Index**: `UNIQUE (user_id, category_id, election_id)`
