# Authentication Flow

## Overview

Token-based authentication using Laravel Sanctum for SPA (Single Page Application).

---

## Registration Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │     │   Laravel  │     │  Database  │     │   Email    │
│  (Next.js) │     │    API     │     │ PostgreSQL │     │  Service   │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │                  │
      │ POST /register   │                  │                  │
      │ {name, email,    │                  │                  │
      │  password}       │                  │                  │
      │─────────────────>│                  │                  │
      │                  │                  │                  │
      │                  │ Validate Input   │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Create User      │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Generate 6-digit │                  │
      │                  │ Verification PIN │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Queue Email Job  │                  │
      │                  │────────────────────────────────────>│
      │                  │                  │                  │
      │ {user, token}    │                  │                  │
      │<─────────────────│                  │                  │
      │                  │                  │                  │
      │                  │                  │      Send Email  │
      │                  │                  │<─────────────────│
      │                  │                  │                  │
```

---

## Email Verification Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │     │   Laravel  │     │  Database  │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │
      │ POST /email/verify                  │
      │ {token: "123456"}│                  │
      │─────────────────>│                  │
      │                  │                  │
      │                  │ Find token       │
      │                  │─────────────────>│
      │                  │                  │
      │                  │ Check expiry     │
      │                  │                  │
      │                  │ Mark verified    │
      │                  │─────────────────>│
      │                  │                  │
      │                  │ Delete token     │
      │                  │─────────────────>│
      │                  │                  │
      │ {success: true}  │                  │
      │<─────────────────│                  │
      │                  │                  │
```

---

## Login Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │     │   Laravel  │     │  Database  │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │
      │ POST /login      │                  │
      │ {email, password}│                  │
      │─────────────────>│                  │
      │                  │                  │
      │                  │ Find User        │
      │                  │─────────────────>│
      │                  │                  │
      │                  │ Verify Password  │
      │                  │                  │
      │                  │ Create Token     │
      │                  │─────────────────>│
      │                  │                  │
      │ {user, token,    │                  │
      │  expires_at}     │                  │
      │<─────────────────│                  │
      │                  │                  │
      │ Store token in   │                  │
      │ localStorage     │                  │
      │                  │                  │
```

---

## Token Storage & Usage

### Frontend (Next.js)

**Storing Token:**
```typescript
// After login/register
localStorage.setItem('auth_token', token);
```

**Using Token:**
```typescript
// API Client setup (axios)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Logout:**
```typescript
// Clear token
localStorage.removeItem('auth_token');
// Call logout endpoint
await api.post('/auth/logout');
```

---

## Protected Routes

### Frontend (Next.js Middleware)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  const protectedPaths = ['/dashboard', '/bookings', '/vehicles', '/profile'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### Backend (Laravel Middleware)

```php
// routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('bookings', BookingController::class);
});

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Routes that require email verification
    Route::post('/bookings', [BookingController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Admin only routes
});
```

---

## Password Reset Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │     │   Laravel  │     │  Database  │     │   Email    │
└─────┬──────┘     └─────┬──────┘     └─────┬──────┘     └─────┬──────┘
      │                  │                  │                  │
      │ POST /password/forgot              │                  │
      │ {email}          │                  │                  │
      │─────────────────>│                  │                  │
      │                  │                  │                  │
      │                  │ Find User        │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Generate Token   │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Send Reset Email │                  │
      │                  │────────────────────────────────────>│
      │                  │                  │                  │
      │ {message}        │                  │                  │
      │<─────────────────│                  │                  │
      │                  │                  │                  │
      │                  │                  │                  │
      │ User clicks link │                  │                  │
      │─────────────────────────────────────────────────────>│
      │                  │                  │                  │
      │ POST /password/reset               │                  │
      │ {token, password}│                  │                  │
      │─────────────────>│                  │                  │
      │                  │                  │                  │
      │                  │ Verify Token     │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │                  │ Update Password  │                  │
      │                  │─────────────────>│                  │
      │                  │                  │                  │
      │ {success}        │                  │                  │
      │<─────────────────│                  │                  │
```

---

## Security Measures

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 attempts/minute |
| `/auth/register` | 3 attempts/minute |
| `/auth/email/resend` | 6 attempts/hour |
| `/auth/password/forgot` | 3 attempts/hour |

### Token Expiration

| Token Type | Expiration |
|------------|------------|
| Access Token | 7 days |
| Email Verification | 24 hours |
| Password Reset | 1 hour |

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Session Security

- Tokens are hashed in database
- HTTPS required in production
- CORS configured for frontend domain only
- Signed URLs for email verification

---

## Auth Context (Frontend)

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
}
```

---

## User States

```
┌─────────────────────────────────────────────────────────────┐
│                        User States                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Unauthenticated ──────────────────────> Authenticated      │
│         │                    login              │           │
│         │                                       │           │
│    ┌────┴────┐                            ┌────┴────┐       │
│    │ Can     │                            │ Can     │       │
│    │ - View  │                            │ - View  │       │
│    │   home  │                            │ - Book  │       │
│    │ - View  │                            │ - Manage│       │
│    │   services                           │   vehicles      │
│    │ - Register                           │ - Profile│      │
│    │ - Login │                            └────┬────┘       │
│    └─────────┘                                 │            │
│                                                │            │
│                              ┌─────────────────┴──────┐     │
│                              │                        │     │
│                         Unverified              Verified    │
│                              │                        │     │
│                         Can't book              Full access │
│                         services                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Related Documents:**
- [[03-System-Architecture]]
- [[05-API-Design]]
