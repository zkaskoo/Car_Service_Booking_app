# Car Service Booking - Frontend

A modern, responsive Next.js 15 application for booking car service appointments with a dark purple/black theme.

## Features

- **Authentication**: Login, register, email verification
- **Dashboard**: Overview of bookings and vehicles
- **Bookings**: Create, view, and manage service appointments
- **Vehicles**: Add and manage multiple vehicles
- **Profile**: Update personal information and change password
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Purple/black color scheme with glow effects

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Custom components with class-variance-authority

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update the `.env.local` file with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-email/
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   ├── vehicles/
│   │   └── profile/
│   ├── (marketing)/         # Landing page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   └── ui/                  # UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx
│       └── DashboardLayout.tsx
├── contexts/                # React contexts
│   └── AuthContext.tsx
└── lib/                     # Utilities
    ├── api.ts              # API client
    └── utils.ts            # Helper functions
```

## Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Sign in
- `/register` - Create account
- `/verify-email` - Email verification

### Protected Routes (Require Authentication)
- `/dashboard` - Dashboard overview
- `/bookings` - View all bookings
- `/bookings/new` - Create new booking
- `/vehicles` - Manage vehicles
- `/profile` - User profile settings

## Theme Customization

The application uses a dark purple/black theme with the following color palette:

- **Primary**: Purple (#a855f7)
- **Background**: #0a0a0b
- **Surface**: #1f1f23
- **Surface Light**: #2a2a2f

Glow effects are applied to buttons and cards using custom shadow utilities.

## API Integration

The frontend communicates with the backend API using Axios. The API client includes:

- Automatic token management
- Request/response interceptors
- Token refresh logic
- Error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is part of the Car Service Booking application.
