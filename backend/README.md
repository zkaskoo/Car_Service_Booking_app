# Car Service Booking API

A complete Laravel 11 backend API for a car service booking system with authentication, vehicle management, service booking, and availability checking.

## Features

- User authentication with email verification (Laravel Sanctum)
- Role-based permissions (customer, admin, mechanic)
- Vehicle management (CRUD operations)
- Service categories and services
- Booking system with availability checking
- Service bay management
- Working hours configuration
- Blocked dates management
- RESTful API with versioning (v1)

## Requirements

- PHP 8.2+
- Composer
- PostgreSQL (or SQLite for development)
- Laravel 11

## Installation

1. Clone the repository

2. Install dependencies
```bash
composer install
```

3. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Update database credentials in .env file

5. Run migrations and seeders
```bash
php artisan migrate:fresh --seed
```

6. Start the development server
```bash
php artisan serve
```

The API will be available at http://localhost:8000

## API Documentation

See full API documentation above for all endpoints including:
- Authentication (register, login, verify email)
- User profile management
- Vehicle CRUD operations
- Service browsing
- Booking management
- Availability checking

## License

Open-sourced software.
