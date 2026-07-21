# CivicVote Enterprise - Electronic Voting Platform 🗳️

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Docker](https://img.shields.io/badge/Docker-29.4-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)

**CivicVote Enterprise** is a production-ready, enterprise-grade, secure, scalable, and containerized digital voting platform. It is engineered to meet modern software standards, providing zero-knowledge voter privacy, immutable cryptographic vote receipts, strict double-voting prevention, live turnout analytics, and full role-based administration.

---

## 📌 Architecture Overview

CivicVote uses a clean microservices-based full-stack architecture:

- **Backend (`/backend`)**: Laravel 11 (PHP 8.3) RESTful API with Sanctum authentication, Repository/Service architecture, Form Request validation, DB Transaction isolation, and automated tests.
- **Frontend (`/frontend`)**: Single Page Application (SPA) built with React + Vite, Tailwind CSS, Lucide icons, Chart.js visualizations, Toast notifications, Dark mode, and WCAG AA accessibility.
- **Containerization (`/docker`, `docker-compose.yml`)**: Multi-stage Docker setup featuring PHP-FPM 8.3, Nginx web host, MySQL 8.0, Redis, persistent volumes, and health checks.
- **Documentation (`/docs`)**: Technical specs for System Architecture, REST API Reference, Database Schema ERD, and Deployment Guides.
- **Legacy Archives (`/legacy`)**: Original procedural PHP scripts archived for reference.

```
                           +------------------------+
                           |  Nginx Reverse Proxy   |
                           |   (Port 80 / 443)      |
                           +-----------+------------+
                                       |
                +----------------------+----------------------+
                |                                             |
                v                                             v
    +-----------------------+                     +-----------------------+
    |   Frontend (React)    |                     |   Backend (Laravel)   |
    | Single Page App (Vite)|                     |  REST API & Sanctum   |
    +-----------------------+                     +-----------+-----------+
                                                              |
                                           +------------------+------------------+
                                           |                  |                  |
                                           v                  v                  v
                                    +--------------+   +--------------+   +--------------+
                                    | MySQL 8.0 /  |   |    Redis     |   | Cryptographic|
                                    | PostgreSQL   |   | Cache & Rate |   | Audit Stream |
                                    +--------------+   +--------------+   +--------------+
```

---

## 🔒 Security & Cryptographic Model

1. **Zero Double-Voting Guarantee**:
   - Enforced at the database engine level via a composite unique index on `(voter_id_hash, category_id, election_id)`.
   - Wrapped in ACID database transactions (`DB::transaction`) to guarantee zero duplicate submissions under high concurrency.
2. **Voter Privacy vs. Public Auditability**:
   - Decouples voter identity from candidate choices using anonymized SHA-256 hashes (`voter_id_hash`).
   - Generates unique cryptographic receipt codes (e.g. `VOTE-A1B2-C3D4-E5F6`) for every cast vote.
   - Public Audit Ledger allows voters to verify receipt inclusion at `/votes/verify/{receiptCode}` without exposing candidate choices.
3. **Role-Based Access Control (RBAC)**:
   - `super_admin`: Full system control & global election management.
   - `election_admin`: Election wizard, position categories, and candidate setup.
   - `election_officer`: Returning officer duties, live turnout monitoring.
   - `voter`: Registered citizen account eligible to view ballots and cast votes.
   - `auditor`: Read-only oversight of audit logs and results.

---

## 🚀 Quick Start via Docker Compose

Spin up the complete container stack with a single command:

```bash
docker compose up -d --build
```

### Run Migrations & Seed Data
Initialize database schema and realistic sample elections/candidates:

```bash
docker compose exec backend php artisan migrate:fresh --seed --force
```

### Pre-Configured Seed Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@evoting.org` | `Admin@123456` | Full Control & Deletion |
| **Election Admin** | `election.admin@evoting.org` | `Admin@123456` | Election Wizard & Candidates |
| **Election Officer** | `officer@evoting.org` | `Officer@123456` | Turnout Analytics |
| **Auditor** | `auditor@evoting.org` | `Auditor@123456` | Audit Log Oversight |
| **Voter** | `alice@gmail.com` | `VoterPass123!` | Voting Ballot & Receipts |

---

## 💻 Local Manual Development Setup

### 1. Backend (Laravel API)
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

### 2. Frontend (React SPA)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

### Run Backend Feature & Unit Tests:
```bash
cd backend
php artisan test
```

### Run Frontend Build Check:
```bash
cd frontend
npm run build
```

---

## 📚 Technical Documentation

- 📄 [Architecture Specification](docs/ARCHITECTURE.md)
- 📄 [REST API Reference](docs/API_REFERENCE.md)
- 📄 [Database Schema & ERD](docs/DATABASE_SCHEMA.md)
- 📄 [Deployment & Operations Guide](docs/DEPLOYMENT_GUIDE.md)

---

## 🙌 Contributors
- **MILTON** - Lead System Architect & Developer
