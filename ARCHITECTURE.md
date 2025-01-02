# Paddle Court Booking Platform - Project Documentation

## Project Overview
A web platform that aggregates paddle court availability across different clubs, allowing users to search, compare, and book courts through a unified interface.

## Technical Stack
- **Frontend**: Next.js 14+ (React)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui

## Project Structure
```
paddle-booking/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── (auth)/             # Authentication related pages
│   ├── courts/             # Court listing and details pages
│   └── page.tsx            # Homepage
├── components/              # Reusable React components
│   ├── common/             # Shared components
│   ├── courts/             # Court-related components
│   └── search/             # Search-related components
├── lib/                     # Shared utilities
│   ├── db/                 # Database utilities
│   ├── api/                # API utilities
│   └── types/              # TypeScript types
├── prisma/                  # Database schema and migrations
└── public/                  # Static assets
```

## Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  location  Json?    // Stored as PostGIS point
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Club {
  id        String   @id @default(uuid())
  name      String
  location  Json     // Stored as PostGIS point
  facilities Json[]
  bookingUrl String?
  courts    Court[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Court {
  id          String   @id @default(uuid())
  clubId      String
  club        Club     @relation(fields: [clubId], references: [id])
  name        String
  type        String
  pricePerHour Decimal
  availability Availability[]
}

model Availability {
  id        String   @id @default(uuid())
  courtId   String
  court     Court    @relation(fields: [courtId], references: [id])
  startTime DateTime
  endTime   DateTime
  status    String
}
```

## Key Features & Implementation Details

### Search Functionality
- Location-based search using Google Maps API
- Date/time selection for court availability
- Filters for:
  - Price range
  - Available time slots
  - Club facilities
  - Distance from location

### Club Integration (MVP)
- Direct linking to club booking systems
- Future: API integration with booking platforms
- Webhook system for availability updates

### User Authentication
- Email/password authentication
- JWT tokens for session management
- Protected routes for user-specific features

## API Endpoints

### Courts
```typescript
GET /api/courts
- Query params: location, date, facilities
- Returns: Available courts matching criteria

GET /api/courts/:id
- Returns: Detailed court information

GET /api/courts/:id/availability
- Query params: date
- Returns: Available time slots
```

### Clubs
```typescript
GET /api/clubs
- Query params: location, facilities
- Returns: List of clubs

GET /api/clubs/:id
- Returns: Detailed club information
```

## Environment Variables
```
DATABASE_URL=postgresql://...
GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_API_URL=...
JWT_SECRET=...
```

## Development Guidelines

### Component Structure
```typescript
// Example component structure
import { useState } from 'react'
import type { CourtType } from '@/lib/types'

interface CourtCardProps {
  court: CourtType
  onSelect: (id: string) => void
}

export function CourtCard({ court, onSelect }: CourtCardProps) {
  // Component logic
}
```

### Styling Conventions
- Use Tailwind CSS utilities
- Follow Mobile-first approach
- Use shadcn/ui components when possible
- Custom colors defined in tailwind.config.js

### State Management
- React Query for server state
- Context API for global UI state
- Local state for component-specific logic

### Error Handling
- Custom error boundary components
- Consistent error response format
- Proper error logging setup

## Deployment Strategy
- Vercel for frontend deployment
- Railway or Heroku for backend services
- Supabase or managed PostgreSQL for database

## Testing Strategy
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E testing
```

This document should be placed in a `docs/` directory at the root of your project, named something like `ARCHITECTURE.md`. You can reference it when working with Windsurf AI by saying something like "Please follow the structure and conventions defined in ARCHITECTURE.md in the project root."

Would you like me to add or modify any sections of this documentation to better suit your needs? Or shall we proceed with setting up the initial project structure?