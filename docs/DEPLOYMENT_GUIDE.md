# Deployment & Operations Manual

## Quick Start via Docker Compose

Run the entire platform with a single command:

```bash
docker compose up -d --build
```

### Initializing Database & Seed Data
Once the containers launch, execute migrations and realistic seed data inside the `backend` container:

```bash
docker compose exec backend php artisan migrate:fresh --seed --force
```

---

## Service Endpoints & Access

- **Web Application Frontend**: [http://localhost](http://localhost) (Port 80)
- **REST API Backend**: [http://localhost/api/v1](http://localhost/api/v1) or [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
- **Database (MySQL)**: `localhost:3306` (User: `evoting_user`, Pass: `evoting_secure_password_2026`)
- **Redis Cache**: `localhost:6379`

---

## Pre-Configured Seed Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@evoting.org` | `Admin@123456` | Full System Control & Deletion |
| **Election Admin** | `election.admin@evoting.org` | `Admin@123456` | Election Wizard & Candidates |
| **Election Officer** | `officer@evoting.org` | `Officer@123456` | Turnout Analytics & Monitoring |
| **Auditor** | `auditor@evoting.org` | `Auditor@123456` | Audit Stream Oversight |
| **Voter** | `alice@gmail.com` | `VoterPass123!` | Voting Ballot & Receipts |

---

## Local Development (Without Docker)

### Backend
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Automated Test Execution

Run backend PHPUnit / Pest tests:

```bash
cd backend
php artisan test
```

Run frontend build check:

```bash
cd frontend
npm run build
```
