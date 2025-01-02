# Paddle Court Booking Platform - Project Documentation

[Previous sections remain the same until UI/UX Design section]

## UI/UX Design Specifications

### Color System
```css
/* Primary Colors */
--primary-900: #1a5f7a;    /* Deep blue - Primary actions */
--primary-800: #2d7d9a;    /* Main brand color */
--primary-600: #3997b7;    /* Buttons, links */
--primary-400: #67b3cd;    /* Highlights */
--primary-200: #a5d3e3;    /* Subtle backgrounds */
--primary-100: #e1f2f7;    /* Very light backgrounds */

/* Neutral Colors */
--neutral-900: #1f2937;    /* Primary text */
--neutral-700: #374151;    /* Secondary text */
--neutral-500: #6b7280;    /* Disabled text */
--neutral-300: #d1d5db;    /* Borders */
--neutral-200: #e5e7eb;    /* Dividers */
--neutral-100: #f3f4f6;    /* Backgrounds */

/* Accent Colors */
--success-600: #059669;    /* Success states */
--warning-600: #d97706;    /* Warning states */
--error-600: #dc2626;      /* Error states */
```

### Typography
```css
--font-primary: 'Inter', sans-serif;      /* Main text */
--font-display: 'Montserrat', sans-serif; /* Headings */
```

### Page Structure and Flow

#### 1. Landing Page (Homepage)
Components:
- Hero section with search form
  - Location input (with Google Maps autocomplete)
  - Date picker
  - Time slot selector
  - Search button
- Featured clubs section
- Popular locations grid

```typescript
// Example Search Form Component Structure
interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

interface SearchParams {
  location: string;
  date: Date;
  timeSlot: string;
}
```

#### 2. Search Results Page
Components:
- Filter sidebar
  - Price range slider
  - Facility checkboxes
  - Rating filter
  - Distance filter
- Club cards grid
  - Club image
  - Available courts count
  - Price range
  - Rating
  - Key facilities
- Map view (desktop)

```typescript
interface ClubCardProps {
  club: {
    id: string;
    name: string;
    image: string;
    rating: number;
    availableCourts: number;
    priceRange: {
      min: number;
      max: number;
    };
    facilities: string[];
    distance?: number;
  };
}
```

#### 3. Club Detail Page
Components:
- Club header
  - Image gallery
  - Basic info
  - Rating
- Available courts section
  - Court type tabs
  - Time slot grid
  - Price display
- Facility icons
- Map location
- Reviews section

```typescript
interface CourtSlotProps {
  court: {
    id: string;
    name: string;
    type: 'indoor' | 'outdoor';
    surface: string;
    pricePerHour: number;
    availableSlots: {
      startTime: string;
      endTime: string;
      status: 'available' | 'booked';
    }[];
  };
}
```

### Component Library Usage

#### Base Components
Using shadcn/ui components for:
- Buttons
- Input fields
- Select dropdowns
- Date pickers
- Cards
- Modals
- Navigation menus

#### Custom Components
1. SearchHero
```typescript
interface SearchHeroProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
}
```

2. ClubCard
```typescript
interface ClubCardProps {
  club: ClubType;
  onSelect: (clubId: string) => void;
  showDistance?: boolean;
}
```

3. CourtSlotGrid
```typescript
interface CourtSlotGridProps {
  slots: TimeSlot[];
  selectedDate: Date;
  onSlotSelect: (slot: TimeSlot) => void;
}
```

### Responsive Design Breakpoints
```css
/* Mobile First Approach */
/* Base styles for mobile */

/* Tablet (640px) */
@screen sm {
  /* Tablet styles */
}

/* Desktop (1024px) */
@screen lg {
  /* Desktop styles */
}
```

### Animation Guidelines
- Use subtle transitions (0.2s ease)
- Hover effects on interactive elements
- Loading states for async operations
- Page transitions

```css
.transition-base {
  transition: all 0.2s ease;
}

.hover-effect {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}
```

[Previous sections continue unchanged...]

