# API Design

## Overview

RESTful API built with Laravel 11, versioned under `/api/v1/`.

**Base URL:** `http://localhost:8000/api/v1`

---

## Authentication

All protected endpoints require Bearer token authentication:

```
Authorization: Bearer {token}
```

---

## Response Format

### Success Response

```json
{
    "success": true,
    "data": { ... },
    "message": "Operation successful",
    "meta": {
        "current_page": 1,
        "total_pages": 5,
        "total_items": 50,
        "per_page": 10
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    },
    "error_code": "VALIDATION_ERROR"
}
```

---

## Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh` | Refresh token | Yes |
| POST | `/auth/email/verify` | Verify email | Yes |
| POST | `/auth/email/resend` | Resend verification | Yes |
| POST | `/auth/password/forgot` | Request reset | No |
| POST | `/auth/password/reset` | Reset password | No |
| GET | `/auth/me` | Get current user | Yes |

#### POST /auth/register

**Request:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+36301234567",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!"
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "email_verified": false
        },
        "token": "1|abc123xyz...",
        "token_type": "Bearer"
    },
    "message": "Registration successful. Please verify your email."
}
```

#### POST /auth/login

**Request:**
```json
{
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "user": { ... },
        "token": "2|xyz789abc...",
        "token_type": "Bearer",
        "expires_at": "2025-01-01T00:00:00Z"
    }
}
```

---

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/user/profile` | Get profile | Yes |
| PUT | `/user/profile` | Update profile | Yes |
| PUT | `/user/password` | Change password | Yes |
| DELETE | `/user/account` | Delete account | Yes |

---

### Vehicles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/vehicles` | List user vehicles | Yes |
| POST | `/vehicles` | Add vehicle | Yes |
| GET | `/vehicles/{id}` | Get vehicle | Yes |
| PUT | `/vehicles/{id}` | Update vehicle | Yes |
| DELETE | `/vehicles/{id}` | Delete vehicle | Yes |
| PUT | `/vehicles/{id}/primary` | Set as primary | Yes |

#### POST /vehicles

**Request:**
```json
{
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "license_plate": "ABC-123",
    "vin": "1HGBH41JXMN109186",
    "color": "Silver",
    "transmission": "automatic"
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "license_plate": "ABC-123",
        "is_primary": false
    }
}
```

---

### Services (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services` | List all services | No |
| GET | `/services/{slug}` | Get service details | No |
| GET | `/service-categories` | List categories | No |
| GET | `/service-categories/{slug}` | Category with services | No |

#### GET /services

**Query Parameters:**
- `category` - Filter by category slug
- `search` - Search by name
- `page` - Page number
- `per_page` - Items per page (max 50)

**Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Synthetic Oil Change",
            "slug": "synthetic-oil-change",
            "description": "Premium oil change...",
            "base_price": 79.99,
            "duration_minutes": 30,
            "category": {
                "id": 1,
                "name": "Oil & Fluid Services",
                "icon": "droplet"
            }
        }
    ],
    "meta": {
        "current_page": 1,
        "total_pages": 3,
        "total_items": 25
    }
}
```

---

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/bookings` | List user bookings | Yes |
| POST | `/bookings` | Create booking | Yes |
| GET | `/bookings/{reference}` | Get booking details | Yes |
| PUT | `/bookings/{reference}` | Update booking | Yes |
| POST | `/bookings/{reference}/cancel` | Cancel booking | Yes |
| POST | `/bookings/{reference}/reschedule` | Reschedule | Yes |
| GET | `/bookings/availability` | Check available slots | Yes |

#### GET /bookings/availability

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format
- `services[]` (required) - Array of service IDs

**Response (200):**
```json
{
    "success": true,
    "data": {
        "date": "2025-01-20",
        "estimated_duration_minutes": 60,
        "available_slots": [
            { "start_time": "08:00", "end_time": "09:00" },
            { "start_time": "09:00", "end_time": "10:00" },
            { "start_time": "10:00", "end_time": "11:00" },
            { "start_time": "13:00", "end_time": "14:00" }
        ],
        "working_hours": {
            "open": "08:00",
            "close": "17:00"
        }
    }
}
```

#### POST /bookings

**Request:**
```json
{
    "vehicle_id": 1,
    "booking_date": "2025-01-20",
    "start_time": "09:00",
    "service_ids": [1, 6, 15],
    "customer_notes": "Car making squeaking noise"
}
```

**Response (201):**
```json
{
    "success": true,
    "data": {
        "booking_reference": "BK-2025-00001",
        "status": "pending",
        "booking_date": "2025-01-20",
        "start_time": "09:00",
        "end_time": "11:00",
        "vehicle": {
            "id": 1,
            "make": "Toyota",
            "model": "Camry"
        },
        "services": [
            {
                "id": 1,
                "name": "Synthetic Oil Change",
                "price": 79.99
            }
        ],
        "total_price": 126.96
    }
}
```

---

### Admin Endpoints

All admin endpoints require `role: admin`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard/stats` | Dashboard statistics |
| GET | `/admin/bookings` | List all bookings |
| PUT | `/admin/bookings/{id}/status` | Update status |
| PUT | `/admin/bookings/{id}/assign` | Assign mechanic |
| GET | `/admin/users` | List users |
| PUT | `/admin/users/{id}` | Update user |
| POST | `/admin/services` | Create service |
| PUT | `/admin/services/{id}` | Update service |
| DELETE | `/admin/services/{id}` | Delete service |
| GET | `/admin/working-hours` | Get working hours |
| PUT | `/admin/working-hours` | Update working hours |
| POST | `/admin/blocked-dates` | Add blocked date |
| DELETE | `/admin/blocked-dates/{id}` | Remove blocked date |

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Not authenticated |
| `FORBIDDEN` | Not authorized |
| `NOT_FOUND` | Resource not found |
| `INVALID_CREDENTIALS` | Login credentials invalid |
| `INVALID_VERIFICATION_TOKEN` | Email token invalid/expired |
| `RATE_LIMITED` | Too many requests |
| `SLOT_UNAVAILABLE` | Booking slot no longer available |
| `BOOKING_CANCELLED` | Booking already cancelled |

---

## Rate Limiting

| Endpoint Group | Limit |
|----------------|-------|
| Auth endpoints | 6 requests/minute |
| General API | 60 requests/minute |
| Admin API | 120 requests/minute |

---

**Related Documents:**
- [[03-System-Architecture]]
- [[06-Authentication-Flow]]
