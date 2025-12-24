# Task Board (JIRA-Style)

## Sprint Overview

**Sprint Goal:** Build MVP of Car Service Booking System
**Sprint Duration:** 2025-12-24 to 2025-01-24

---

## Board

### TODO

| ID | Task | Priority | Assignee | Labels |
|----|------|----------|----------|--------|
| CSB-011 | Implement admin dashboard statistics | High | - | `admin`, `api` |
| CSB-012 | Create calendar view for bookings | Medium | - | `admin`, `frontend` |
| CSB-013 | Add booking reminders (email) | Medium | - | `email`, `backend` |
| CSB-014 | Implement reviews system | Low | - | `feature`, `full-stack` |
| CSB-015 | Add service search/filter | Low | - | `frontend`, `ux` |

### IN PROGRESS

| ID | Task | Priority | Assignee | Labels |
|----|------|----------|----------|--------|
| CSB-001 | Setup project structure and documentation | High | Claude | `setup`, `docs` |
| CSB-002 | Initialize Next.js frontend with theme | High | Claude | `frontend`, `setup` |
| CSB-003 | Initialize Laravel backend with Sanctum | High | Claude | `backend`, `setup` |
| CSB-004 | Create database migrations | High | Claude | `backend`, `database` |

### TESTING

| ID | Task | Priority | Assignee | Labels |
|----|------|----------|----------|--------|
| - | - | - | - | - |

### DEPLOYED

| ID | Task | Priority | Assignee | Labels |
|----|------|----------|----------|--------|
| - | - | - | - | - |

### DONE

| ID | Task | Priority | Assignee | Labels |
|----|------|----------|----------|--------|
| CSB-000 | Create Obsidian documentation | High | Claude | `docs` |

---

## Backlog

| ID | Task | Priority | Estimate | Labels |
|----|------|----------|----------|--------|
| CSB-005 | Implement user registration API | High | 2h | `backend`, `auth` |
| CSB-006 | Implement email verification | High | 3h | `backend`, `email` |
| CSB-007 | Create registration form (frontend) | High | 2h | `frontend`, `auth` |
| CSB-008 | Implement login/logout | High | 2h | `full-stack`, `auth` |
| CSB-009 | Vehicle management CRUD | Medium | 3h | `full-stack`, `feature` |
| CSB-010 | Booking wizard component | High | 4h | `frontend`, `feature` |
| CSB-016 | Booking creation API | High | 3h | `backend`, `feature` |
| CSB-017 | Availability algorithm | High | 4h | `backend`, `logic` |
| CSB-018 | Service catalog pages | Medium | 2h | `frontend`, `feature` |
| CSB-019 | User profile management | Medium | 2h | `full-stack`, `feature` |
| CSB-020 | Admin user management | Medium | 3h | `admin`, `full-stack` |
| CSB-021 | Admin service management | Medium | 2h | `admin`, `full-stack` |
| CSB-022 | Working hours configuration | Medium | 2h | `admin`, `backend` |
| CSB-023 | Blocked dates management | Low | 2h | `admin`, `backend` |
| CSB-024 | E2E testing setup | Medium | 3h | `testing`, `devops` |
| CSB-025 | Production deployment | High | 4h | `devops`, `deploy` |

---

## Task Details

### CSB-001: Setup project structure and documentation
**Status:** In Progress
**Priority:** High
**Labels:** `setup`, `docs`

**Description:**
Create the initial project structure including:
- [x] Create project directories (docs, frontend, backend)
- [x] Setup Obsidian documentation
- [ ] Create README.md
- [ ] Setup .gitignore
- [ ] Initialize git repository

**Acceptance Criteria:**
- Project structure follows documented architecture
- Documentation is accessible in Obsidian format
- Git repository initialized with proper .gitignore

---

### CSB-002: Initialize Next.js frontend with theme
**Status:** In Progress
**Priority:** High
**Labels:** `frontend`, `setup`

**Description:**
Setup Next.js 15 project with:
- [ ] Create Next.js app with App Router
- [ ] Configure TypeScript
- [ ] Setup Tailwind CSS with purple/black theme
- [ ] Create base components (Button, Card, Input)
- [ ] Setup auth context
- [ ] Configure axios for API calls

**Acceptance Criteria:**
- Next.js app runs on localhost:3000
- Dark theme with purple accents applied
- Base components are reusable
- TypeScript configured with strict mode

---

### CSB-003: Initialize Laravel backend with Sanctum
**Status:** In Progress
**Priority:** High
**Labels:** `backend`, `setup`

**Description:**
Setup Laravel 11 project with:
- [ ] Create Laravel project
- [ ] Install and configure Sanctum
- [ ] Setup CORS for frontend
- [ ] Configure database connection
- [ ] Setup mail configuration (Mailtrap)
- [ ] Create base API structure

**Acceptance Criteria:**
- Laravel app runs on localhost:8000
- Sanctum authentication working
- API responds to test requests
- Mail configuration verified with Mailtrap

---

### CSB-004: Create database migrations
**Status:** In Progress
**Priority:** High
**Labels:** `backend`, `database`

**Description:**
Create all database migrations:
- [ ] users table
- [ ] email_verification_tokens table
- [ ] vehicles table
- [ ] service_categories table
- [ ] services table
- [ ] service_bays table
- [ ] working_hours table
- [ ] blocked_dates table
- [ ] bookings table
- [ ] booking_services table
- [ ] notifications table
- [ ] reviews table

**Acceptance Criteria:**
- All migrations run without errors
- Database schema matches documentation
- Seed data for services and categories

---

## Labels

| Label | Color | Description |
|-------|-------|-------------|
| `setup` | Blue | Initial setup tasks |
| `frontend` | Green | Frontend (Next.js) tasks |
| `backend` | Orange | Backend (Laravel) tasks |
| `full-stack` | Purple | Both frontend and backend |
| `auth` | Red | Authentication related |
| `email` | Yellow | Email functionality |
| `feature` | Cyan | New feature implementation |
| `admin` | Pink | Admin panel tasks |
| `testing` | Gray | Testing tasks |
| `devops` | Brown | DevOps and deployment |
| `docs` | White | Documentation |
| `bug` | Red | Bug fixes |
| `ux` | Teal | User experience improvements |

---

## Velocity Tracking

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 | - | - | - |

---

**Related Documents:**
- [[01-Project-Overview]]
- [[10-Timeline]]
