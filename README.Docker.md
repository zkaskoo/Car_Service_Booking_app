# Docker Setup for Car Service Booking App

## Quick Start

### 1. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your `APP_KEY` (generate with `make key-generate` after first startup).

### 2. Build and Start

```bash
make setup
```

This will:
- Build all Docker containers
- Start all services
- Run database migrations
- Seed the database with sample data

### 3. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| Mailpit (Email UI) | http://localhost:8025 |

## Services

The Docker setup includes the following services:

| Service | Description | Port |
|---------|-------------|------|
| `frontend` | Next.js 15 application | 3000 |
| `nginx` | Reverse proxy for Laravel API | 8000 |
| `backend` | Laravel 11 PHP-FPM | 9000 (internal) |
| `postgres` | PostgreSQL 16 database | 5432 |
| `redis` | Redis 7 cache/queue | 6379 |
| `queue` | Laravel queue worker | - |
| `scheduler` | Laravel task scheduler | - |
| `mailpit` | Email testing UI | 8025 (UI), 1025 (SMTP) |

## Common Commands

### Docker Management

```bash
make up              # Start all services
make down            # Stop all services
make restart         # Restart all services
make logs            # View all logs
make logs-backend    # View backend logs
make logs-frontend   # View frontend logs
make ps              # Show running containers
```

### Laravel Commands

```bash
make migrate         # Run migrations
make seed            # Run seeders
make fresh           # Fresh migration with seeders
make tinker          # Start Laravel Tinker
make cache-clear     # Clear all caches
make test            # Run tests
```

### Shell Access

```bash
make shell           # Access backend shell
make shell-frontend  # Access frontend shell
make shell-postgres  # Access PostgreSQL CLI
make shell-redis     # Access Redis CLI
```

### Development Mode

For hot-reload during development:

```bash
make dev             # Start with hot-reload
make dev-build       # Build and start dev mode
```

## Environment Variables

Key environment variables in `.env`:

```bash
# Application
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:...  # Generate with: make key-generate

# Database
DB_DATABASE=car_service
DB_USERNAME=postgres
DB_PASSWORD=secret

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Mail (uses Mailpit in Docker)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## Troubleshooting

### Container won't start

Check logs:
```bash
make logs-backend
make logs-frontend
```

### Database connection issues

Ensure PostgreSQL is healthy:
```bash
docker compose ps postgres
```

Wait for health check to pass, then retry.

### Permission issues

If you get permission errors on Linux:
```bash
sudo chown -R $USER:$USER backend/storage backend/bootstrap/cache
```

### Fresh start

To reset everything:
```bash
make reset
```

This removes all volumes and rebuilds from scratch.

## Production Deployment

For production, update `.env`:

```bash
APP_ENV=production
APP_DEBUG=false
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

Build production images:
```bash
docker compose build --no-cache
docker compose up -d
```

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │           Docker Network            │
                    └─────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│   Frontend    │          │     Nginx     │          │    Mailpit    │
│   (Next.js)   │          │  (API Proxy)  │          │ (Email Test)  │
│   :3000       │          │   :8000       │          │   :8025       │
└───────────────┘          └───────┬───────┘          └───────────────┘
                                   │
                                   ▼
                          ┌───────────────┐
                          │   Backend     │
                          │  (Laravel)    │
                          │   PHP-FPM     │
                          └───────┬───────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌─────────────┐ ┌─────────┐ ┌─────────────┐
            │  PostgreSQL │ │  Redis  │ │Queue/Sched  │
            │    :5432    │ │  :6379  │ │  Workers    │
            └─────────────┘ └─────────┘ └─────────────┘
```
