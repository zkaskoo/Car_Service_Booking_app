# Database Schema

## Entity Relationship Diagram

```
┌──────────────────────┐          ┌──────────────────────┐
│        users         │          │       vehicles       │
├──────────────────────┤          ├──────────────────────┤
│ id (PK)              │──────────│ id (PK)              │
│ first_name           │     1:N  │ user_id (FK)         │
│ last_name            │          │ make                 │
│ email (UNIQUE)       │          │ model                │
│ phone                │          │ year                 │
│ password             │          │ license_plate        │
│ email_verified_at    │          │ vin                  │
│ role                 │          │ color                │
│ avatar_url           │          │ is_primary           │
│ created_at           │          │ created_at           │
│ updated_at           │          │ updated_at           │
└──────────────────────┘          └──────────────────────┘
         │                                   │
         │ 1:N                               │ 1:N
         ▼                                   ▼
┌──────────────────────┐          ┌──────────────────────┐
│       bookings       │◄─────────│    booking_services  │
├──────────────────────┤    1:N   ├──────────────────────┤
│ id (PK)              │          │ id (PK)              │
│ booking_reference    │          │ booking_id (FK)      │
│ user_id (FK)         │          │ service_id (FK)      │
│ vehicle_id (FK)      │          │ price_at_booking     │
│ service_bay_id (FK)  │          │ duration_at_booking  │
│ assigned_mechanic_id │          │ quantity             │
│ status               │          │ notes                │
│ booking_date         │          │ created_at           │
│ start_time           │          └──────────────────────┘
│ end_time             │                    │
│ total_price          │                    │ N:1
│ customer_notes       │                    ▼
│ created_at           │          ┌──────────────────────┐
│ updated_at           │          │       services       │
└──────────────────────┘          ├──────────────────────┤
                                  │ id (PK)              │
┌──────────────────────┐          │ category_id (FK)     │
│   service_categories │◄─────────│ name                 │
├──────────────────────┤    N:1   │ slug                 │
│ id (PK)              │          │ description          │
│ name                 │          │ base_price           │
│ slug                 │          │ duration_minutes     │
│ description          │          │ is_active            │
│ icon                 │          │ created_at           │
│ sort_order           │          │ updated_at           │
│ is_active            │          └──────────────────────┘
│ created_at           │
│ updated_at           │
└──────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐
│     service_bays     │          │    working_hours     │
├──────────────────────┤          ├──────────────────────┤
│ id (PK)              │          │ id (PK)              │
│ name                 │          │ day_of_week (0-6)    │
│ description          │          │ open_time            │
│ bay_type             │          │ close_time           │
│ is_active            │          │ break_start          │
│ created_at           │          │ break_end            │
│ updated_at           │          │ is_closed            │
└──────────────────────┘          │ created_at           │
                                  │ updated_at           │
┌──────────────────────┐          └──────────────────────┘
│    blocked_dates     │
├──────────────────────┤          ┌──────────────────────┐
│ id (PK)              │          │    notifications     │
│ date                 │          ├──────────────────────┤
│ reason               │          │ id (UUID, PK)        │
│ service_bay_id (FK)  │          │ user_id (FK)         │
│ is_full_day          │          │ type                 │
│ start_time           │          │ title                │
│ end_time             │          │ message              │
│ created_at           │          │ data (JSONB)         │
└──────────────────────┘          │ read_at              │
                                  │ created_at           │
                                  └──────────────────────┘
```

---

## Table Definitions

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    role VARCHAR(20) DEFAULT 'customer'
        CHECK (role IN ('customer', 'mechanic', 'admin')),
    avatar_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Vehicles Table

```sql
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year >= 1900 AND year <= 2100),
    license_plate VARCHAR(20),
    vin VARCHAR(17),
    color VARCHAR(30),
    engine_type VARCHAR(50),
    transmission VARCHAR(20)
        CHECK (transmission IN ('manual', 'automatic', 'cvt', 'dct')),
    mileage INT,
    notes TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_user ON vehicles(user_id);
CREATE INDEX idx_vehicles_license ON vehicles(license_plate);
```

### Service Categories Table

```sql
CREATE TABLE service_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Services Table

```sql
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL
        REFERENCES service_categories(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    requires_diagnosis BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE UNIQUE INDEX idx_services_slug ON services(slug);
```

### Bookings Table

```sql
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    service_bay_id BIGINT REFERENCES service_bays(id) ON DELETE SET NULL,
    assigned_mechanic_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'in_progress', 'completed',
        'cancelled', 'no_show', 'rescheduled'
    )),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    estimated_duration_minutes INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    customer_notes TEXT,
    internal_notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
```

### Booking Services (Pivot Table)

```sql
CREATE TABLE booking_services (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL
        REFERENCES bookings(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL
        REFERENCES services(id) ON DELETE RESTRICT,
    price_at_booking DECIMAL(10, 2) NOT NULL,
    duration_at_booking INT NOT NULL,
    quantity INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_services_booking ON booking_services(booking_id);
CREATE INDEX idx_booking_services_service ON booking_services(service_id);
```

### Service Bays Table

```sql
CREATE TABLE service_bays (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    bay_type VARCHAR(30) DEFAULT 'general'
        CHECK (bay_type IN ('general', 'diagnostic', 'body_work', 'quick_service')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Working Hours Table

```sql
CREATE TABLE working_hours (
    id BIGSERIAL PRIMARY KEY,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day_of_week)
);
```

### Blocked Dates Table

```sql
CREATE TABLE blocked_dates (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    reason VARCHAR(255),
    service_bay_id BIGINT REFERENCES service_bays(id) ON DELETE CASCADE,
    is_full_day BOOLEAN DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read_at);
```

### Email Verification Tokens Table

```sql
CREATE TABLE email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verify_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verify_user ON email_verification_tokens(user_id);
```

### Reviews Table

```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL
        REFERENCES bookings(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## Seed Data

### Service Categories

| ID | Name | Slug | Icon |
|----|------|------|------|
| 1 | Oil & Fluid Services | oil-fluid-services | droplet |
| 2 | Brake Services | brake-services | disc |
| 3 | Engine Services | engine-services | engine |
| 4 | Tire Services | tire-services | circle |
| 5 | Electrical Services | electrical-services | zap |
| 6 | AC & Heating | ac-heating | thermometer |
| 7 | Transmission | transmission | settings |
| 8 | Diagnostic Services | diagnostic-services | search |
| 9 | Scheduled Maintenance | scheduled-maintenance | calendar |
| 10 | Body & Paint | body-paint | paintbrush |

### Working Hours (Default)

| Day | Open | Close | Break Start | Break End |
|-----|------|-------|-------------|-----------|
| Monday (1) | 08:00 | 17:00 | 12:00 | 13:00 |
| Tuesday (2) | 08:00 | 17:00 | 12:00 | 13:00 |
| Wednesday (3) | 08:00 | 17:00 | 12:00 | 13:00 |
| Thursday (4) | 08:00 | 17:00 | 12:00 | 13:00 |
| Friday (5) | 08:00 | 17:00 | 12:00 | 13:00 |
| Saturday (6) | 09:00 | 14:00 | - | - |
| Sunday (0) | CLOSED | - | - | - |

### Service Bays (Default)

| ID | Name | Type |
|----|------|------|
| 1 | Bay 1 - General | general |
| 2 | Bay 2 - General | general |
| 3 | Bay 3 - Diagnostic | diagnostic |
| 4 | Bay 4 - Quick Service | quick_service |

---

**Related Documents:**
- [[03-System-Architecture]]
- [[05-API-Design]]
