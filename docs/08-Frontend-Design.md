# Frontend Design System

## Color Palette

### Primary Colors (Purple)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary 50 | `#faf5ff` | 250, 245, 255 | Light backgrounds |
| Primary 100 | `#f3e8ff` | 243, 232, 255 | Hover backgrounds |
| Primary 200 | `#e9d5ff` | 233, 213, 255 | Active states |
| Primary 300 | `#d8b4fe` | 216, 180, 254 | Borders |
| Primary 400 | `#c084fc` | 192, 132, 252 | Secondary text |
| **Primary 500** | `#a855f7` | 168, 85, 247 | **Primary brand color** |
| Primary 600 | `#9333ea` | 147, 51, 234 | Primary buttons |
| Primary 700 | `#7c3aed` | 124, 58, 237 | Hover states |
| Primary 800 | `#6b21a8` | 107, 33, 168 | Active buttons |
| Primary 900 | `#581c87` | 88, 28, 135 | Dark accents |
| Primary 950 | `#3b0764` | 59, 7, 100 | Deepest purple |

### Surface Colors (Dark)

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#0a0a0b` | Main background |
| Surface 50 | `#18181b` | Elevated surfaces |
| Surface 100 | `#1f1f23` | Cards, panels |
| Surface 200 | `#27272a` | Borders |
| Surface 300 | `#3f3f46` | Dividers |
| Surface 400 | `#52525b` | Disabled states |
| Surface 500 | `#71717a` | Muted text |
| Surface 600 | `#a1a1aa` | Secondary text |
| Surface 700 | `#d4d4d8` | Primary text |
| Surface 800 | `#e4e4e7` | Headings |
| Surface 900 | `#f4f4f5` | White text |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` | Success states, confirmations |
| Warning | `#f59e0b` | Warnings, pending states |
| Error | `#ef4444` | Errors, destructive actions |
| Info | `#3b82f6` | Information, links |

---

## Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| xs | 12px | 16px | 400 | Captions |
| sm | 14px | 20px | 400 | Small text |
| base | 16px | 24px | 400 | Body text |
| lg | 18px | 28px | 500 | Large body |
| xl | 20px | 28px | 600 | Subheadings |
| 2xl | 24px | 32px | 700 | Headings |
| 3xl | 30px | 36px | 700 | Page titles |
| 4xl | 36px | 40px | 800 | Hero titles |

---

## Components

### Buttons

```
┌─────────────────────────────────────────────────────────────┐
│ Primary Button                                               │
│ ┌─────────────────┐                                         │
│ │  Book Service   │  bg-primary-600, hover:bg-primary-700   │
│ └─────────────────┘  text-white, glow effect                │
│                                                             │
│ Secondary Button                                            │
│ ┌─────────────────┐                                         │
│ │   Learn More    │  bg-surface-200, border-surface-300     │
│ └─────────────────┘  text-foreground                        │
│                                                             │
│ Outline Button                                              │
│ ┌─────────────────┐                                         │
│ │     Cancel      │  border-primary-600, text-primary-400   │
│ └─────────────────┘  hover:bg-primary-600/10                │
│                                                             │
│ Ghost Button                                                │
│ ┌─────────────────┐                                         │
│ │      Back       │  text-foreground, hover:bg-surface-200  │
│ └─────────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

### Cards

```
┌─────────────────────────────────────────────────────────────┐
│ Default Card                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │  Card Title                                             │ │
│ │  Card description text goes here.                       │ │
│ │                                                         │ │
│ │  ┌───────────────┐                                      │ │
│ │  │    Action     │                                      │ │
│ │  └───────────────┘                                      │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ bg-surface-100, border-surface-200, rounded-xl              │
│                                                             │
│ Glass Card                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Glassmorphism effect with blur                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ backdrop-blur-12, bg-surface-100/80, border-white/10        │
└─────────────────────────────────────────────────────────────┘
```

### Input Fields

```
┌─────────────────────────────────────────────────────────────┐
│ Text Input                                                   │
│                                                             │
│ Email Address                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ john@example.com                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│ bg-surface-100, border-surface-300, focus:ring-primary-500  │
│                                                             │
│ Error State                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ invalid-email                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ⚠ Please enter a valid email address                       │
│ border-error, text-error                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Page Layouts

### Marketing Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Glass)                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Logo      Services  About  Contact     Login  Register  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        Page Content                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ © 2025 AutoService Pro. All rights reserved.            │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────────┐ │
│ │          │ │ Header                                     │ │
│ │          │ │ ┌──────────────────┐  ┌──────────────────┐ │ │
│ │ Sidebar  │ │ │ Search...        │  │ User Profile ▼   │ │ │
│ │          │ │ └──────────────────┘  └──────────────────┘ │ │
│ │ Dashboard│ ├────────────────────────────────────────────┤ │
│ │ Bookings │ │                                            │ │
│ │ Vehicles │ │                                            │ │
│ │ Profile  │ │           Main Content Area                │ │
│ │          │ │                                            │ │
│ │ ──────── │ │                                            │ │
│ │ Settings │ │                                            │ │
│ │ Logout   │ │                                            │ │
│ │          │ │                                            │ │
│ └──────────┘ └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Booking Wizard Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Book a Service                            │
│                                                             │
│  Step Indicator:                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ (●)──────(○)──────(○)──────(○)                         │ │
│  │  1        2        3        4                          │ │
│  │Vehicle  Services  DateTime  Confirm                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │                  Step Content                          │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Select Your Vehicle                              │  │ │
│  │  │                                                  │  │ │
│  │  │ ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │ │
│  │  │ │ Toyota     │  │ Honda      │  │ + Add New  │  │  │ │
│  │  │ │ Camry 2020 │  │ Civic 2019 │  │  Vehicle   │  │  │ │
│  │  │ │  ★ Primary │  │            │  │            │  │  │ │
│  │  │ └────────────┘  └────────────┘  └────────────┘  │  │ │
│  │  │                                                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                         │ Next Step ─────────────────► │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Effects

### Glow Effect

```css
.glow {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

.glow-sm {
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
}
```

### Glass Effect

```css
.glass {
    background: rgba(31, 31, 35, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradient Text

```css
.gradient-text {
    background: linear-gradient(135deg, #c084fc, #9333ea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

---

## Animations

### Transitions

```css
/* Default transition */
transition: all 200ms ease;

/* Hover states */
transition: transform 150ms ease, box-shadow 200ms ease;

/* Page transitions */
transition: opacity 300ms ease, transform 300ms ease;
```

### Loading States

```
Spinner:     ◐ ◓ ◑ ◒ (rotating)
Skeleton:    ░░░░░░░░░░ (pulsing)
Progress:    ████████░░ (filling)
```

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

---

## Accessibility

- Color contrast ratio: 4.5:1 minimum
- Focus indicators: 2px ring with offset
- Keyboard navigation: Full support
- Screen reader: ARIA labels on all interactive elements

---

**Related Documents:**
- [[02-Tech-Stack]]
- [[03-System-Architecture]]
