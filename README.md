# Car Service Booking App

A modern, full-stack booking system for auto mechanic workshops built with Next.js 15 and Laravel 11.

## Features

- **User Authentication** - Registration with email verification, secure login/logout
- **Vehicle Management** - Add and manage multiple vehicles per user
- **Service Catalog** - Browse available services by category
- **Smart Booking** - Multi-step booking wizard with real-time availability
- **Admin Dashboard** - Manage bookings, services, and users
- **Email Notifications** - Booking confirmations and reminders

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- TanStack Query
- React Hook Form + Zod

### Backend
- Laravel 11
- PHP 8.3+
- Laravel Sanctum
- PostgreSQL 16
- Redis

## Quick Start

### Prerequisites

- Node.js 20+
- PHP 8.3+
- Composer
- PostgreSQL
- Redis

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Backend (.env):**
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=car_service
DB_USERNAME=postgres
DB_PASSWORD=secret
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
```

## Project Structure

```
car_service_booking_app/
├── docs/               # Obsidian documentation
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom hooks
│   │   └── lib/       # Utilities
│   └── package.json
├── backend/            # Laravel application
│   ├── app/
│   │   ├── Actions/   # Business logic
│   │   ├── Http/      # Controllers
│   │   ├── Models/    # Eloquent models
│   │   └── Services/  # Domain services
│   ├── database/      # Migrations & seeders
│   └── composer.json
└── README.md
```

## API Documentation

See [docs/05-API-Design.md](docs/05-API-Design.md) for full API documentation.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/services` | List services |
| GET | `/api/v1/bookings/availability` | Check slots |
| POST | `/api/v1/bookings` | Create booking |

## Development

### Running Tests

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && php artisan test
```

### Code Style

```bash
# Frontend (ESLint + Prettier)
cd frontend && npm run lint

# Backend (Laravel Pint)
cd backend && ./vendor/bin/pint
```

## Deployment

See [docs/11-Deployment-Guide.md](docs/11-Deployment-Guide.md) for deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with Claude Code
