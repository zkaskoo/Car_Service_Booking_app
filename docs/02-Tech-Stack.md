# Tech Stack

## Overview
Modern, scalable technology stack optimized for developer experience and production performance.

---

## Frontend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **Lucide React** | Latest | Icon library |
| **class-variance-authority** | 0.7.x | Component variants |
| **clsx** | 2.x | Class name utility |

### State Management & Data Fetching
| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query** | 5.x | Server state management |
| **Zustand** | 5.x | Client state management |
| **Axios** | 1.x | HTTP client |

### Forms & Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |
| **@hookform/resolvers** | 3.x | Form resolver integration |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | 4.x | Date manipulation |
| **next-themes** | 0.4.x | Theme management |

---

## Backend Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 11.x | PHP framework |
| **PHP** | 8.3+ | Runtime |

### Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel Sanctum** | 4.x | SPA token authentication |
| **Spatie Permission** | 6.x | Role-based access control |

### Development & Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel Pint** | 1.x | Code style |
| **PHPUnit** | 11.x | Testing framework |
| **Pest** | 3.x | Testing framework (alternative) |

### Queue & Jobs
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel Horizon** | 5.x | Queue monitoring |
| **Redis** | 7.x | Queue driver |

---

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 16.x | Primary database |
| **Redis** | 7.x | Cache & sessions |

---

## Email Services

### Development
| Service | Purpose |
|---------|---------|
| **Mailtrap** | Email testing/sandbox |

### Production Options
| Service | Purpose |
|---------|---------|
| **Amazon SES** | Production email delivery |
| **Mailgun** | Production email delivery |
| **Postmark** | Transactional emails |

---

## Infrastructure

### Development
| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local development |
| **Laravel Sail** | Docker wrapper for Laravel |

### Production
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Laravel Forge/Vapor** | Backend hosting |
| **DigitalOcean/AWS** | Infrastructure |
| **Cloudflare** | CDN & DDoS protection |

---

## DevOps & CI/CD

| Tool | Purpose |
|------|---------|
| **GitHub Actions** | CI/CD pipeline |
| **GitHub** | Version control |
| **Sentry** | Error tracking |

---

## Project Structure

```
car_service_booking_app/
├── docs/                    # Obsidian documentation
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
├── backend/                # Laravel application
│   ├── app/
│   │   ├── Actions/       # Action classes
│   │   ├── Http/          # Controllers, Middleware
│   │   ├── Models/        # Eloquent models
│   │   ├── Services/      # Business logic
│   │   └── Notifications/ # Email notifications
│   ├── database/          # Migrations, seeders
│   ├── routes/            # API routes
│   └── composer.json
└── README.md
```

---

## Version Requirements

### Minimum Requirements
- Node.js 20.x+
- PHP 8.3+
- PostgreSQL 15+
- Redis 7+

### Recommended Versions
- Node.js 22.x (LTS)
- PHP 8.3.x
- PostgreSQL 16.x
- Redis 7.x

---

**Related Documents:**
- [[03-System-Architecture]]
- [[04-Database-Schema]]
