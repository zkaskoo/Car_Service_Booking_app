# Project Overview

## Car Service Workshop Booking System

### Vision
Build a modern, user-friendly booking system for an auto mechanic workshop that allows customers to easily schedule service appointments online.

### Goals
1. **Streamline Booking Process** - Allow customers to book appointments 24/7
2. **Reduce No-Shows** - Email confirmations and reminders
3. **Improve Efficiency** - Optimize workshop capacity utilization
4. **Enhance Customer Experience** - Modern, intuitive interface

---

## Key Features

### Customer Features
- [x] User Registration with Email Verification
- [x] Vehicle Management (add/edit/remove vehicles)
- [x] Service Catalog Browsing
- [x] Real-time Availability Checking
- [x] Multi-step Booking Wizard
- [x] Booking History & Status Tracking
- [x] Profile Management
- [x] Email Notifications (confirmation, reminders)

### Admin Features
- [x] Dashboard with Statistics
- [x] Booking Management (view, confirm, cancel)
- [x] Service & Category Management
- [x] Working Hours Configuration
- [x] Blocked Dates (holidays, closures)
- [x] User Management
- [x] Service Bay Management

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Customer** | Regular users who book services | Create bookings, manage vehicles, view history |
| **Mechanic** | Workshop staff | View assigned bookings, update status |
| **Admin** | Workshop manager | Full access to all features |

---

## Core Workflows

### 1. Registration Flow
```
Register → Email Verification → Login → Complete Profile
```

### 2. Booking Flow
```
Select Vehicle → Choose Services → Pick Date/Time → Confirm → Email Notification
```

### 3. Booking Lifecycle
```
Pending → Confirmed → In Progress → Completed
                  ↘ Cancelled
                  ↘ No Show
```

---

## Success Metrics
- Booking completion rate > 80%
- Email verification rate > 90%
- Customer satisfaction score > 4.5/5
- Admin response time < 24 hours

---

**Related Documents:**
- [[02-Tech-Stack]]
- [[03-System-Architecture]]
- [[09-Task-Board]]
