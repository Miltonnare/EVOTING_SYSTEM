# System Architecture: CivicVote Enterprise Platform

## Overview
CivicVote is a production-grade electronic voting application built using a decoupled modern micro-services architecture. It pairs a high-performance **Laravel 11 / PHP 8.3 REST API** backend with a modern **React SPA (Vite)** frontend, orchestrated with **Docker Compose**, **Nginx**, **MySQL 8.0**, and **Redis**.

```
+-----------------------------------------------------------------------+
|                         Nginx Reverse Proxy                           |
|                      (HTTP Port 80 / HTTPS 443)                       |
+-----------------------------------+-----------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-------------------+                               +-------------------+
|  React Vite SPA   |                               |  Laravel REST API |
|   Static Web App  |                               |   (PHP 8.3 FPM)   |
+-------------------+                               +---------+---------+
                                                              |
                                            +-----------------+-----------------+
                                            |                 |                 |
                                            v                 v                 v
                                     +--------------+  +--------------+  +--------------+
                                     |  MySQL 8.0   |  |    Redis     |  | Audit Stream |
                                     | Data Storage |  | Cache & Rate |  |  Ledger Logs |
                                     +--------------+  +--------------+  +--------------+
```

## Core Security & Cryptography Model

### 1. Zero Double-Voting Guarantee
Double-voting prevention is enforced at three distinct layers:
1. **Frontend Validation**: Category state tracking blocks voters from clicking candidates in already-voted positions.
2. **ACID Transaction Isolation**: The backend executes vote casting inside a database transaction (`DB::transaction`). It queries `voter_participations` to check prior participation before inserting.
3. **Database Engine Unique Constraint**: A composite unique index `unique_vote_per_category` on `(voter_id_hash, category_id, election_id)` guarantees at the database storage engine level that duplicate records cannot exist.

### 2. Voter Privacy vs. Audit Receipts
To guarantee secret ballots while enabling verifiable auditability:
- **`votes` Table**: Contains an anonymized SHA-256 hash of the voter ID (`voter_id_hash`), candidate selection, and a cryptographic receipt hash (`vote_receipt_hash`). The user's direct ID is never stored on the vote record.
- **`voter_participations` Table**: Records that a specific user ID participated in an election category and stores their unique `receipt_code` (e.g. `VOTE-A1B2-C3D4-E5F6`).
- **Public Audit Verification**: Voters or independent auditors can query `/api/v1/votes/verify/{receiptCode}` to confirm that their receipt exists in the active ledger without exposing candidate choices to third parties.

---

## Role-Based Access Control (RBAC)

The system enforces 5 distinct granular roles:
1. **Super Administrator (`super_admin`)**: Full platform control, role management, system settings, global election deletion.
2. **Election Administrator (`election_admin`)**: Election wizard, category/candidate configuration, status opening/closing.
3. **Election Officer (`election_officer`)**: Returning officer duties, live turnout monitoring, dashboard metrics.
4. **Voter (`voter`)**: Registered citizen account eligible to view ballots and cast votes.
5. **Auditor (`auditor`)**: Read-only oversight access to real-time turnout metrics and audit streams.
