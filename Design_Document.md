# Paddle Court Booking Platform - Design System

## Brand Identity

### Color Palette
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
/* Font Families */
--font-primary: 'Inter', sans-serif;      /* Main text */
--font-display: 'Montserrat', sans-serif; /* Headings */

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Component Design

### Search Hero Section
- Full-width background with subtle gradient overlay
- Large, centered search form
- Prominent call-to-action
- Subtle animations on hover/focus

```css
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),
              url('/hero-bg.jpg');
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: var(--space-6);
  width: 100%;
  max-width: 800px;
}
```

### Search Form Elements
- Clean, minimal input fields
- Clear visual hierarchy
- Smooth transitions
- Mobile-optimized touch targets

```css
.input-field {
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  padding: var(--space-4);
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px var(--primary-200);
}
```

### Cards & Containers
- Subtle shadows
- Rounded corners
- Smooth hover states
- Clear content hierarchy

```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
}
```

## Page Layouts

### Homepage
1. Hero Section
   - Full-width background image
   - Centered search form
   - "How it works" section below

2. Popular Locations
   - Grid of location cards
   - Image-heavy design
   - Quick-access booking links

3. Featured Clubs
   - Horizontal scrolling cards
   - Rating and review highlights
   - Price indicators

### Search Results
1. Split View
   - Left: Filters and list view
   - Right: Map view
   - Collapsible on mobile

2. Filter Panel
   - Clear grouping of options
   - Interactive price range slider
   - Quick-select time slots

3. Results List
   - Card-based layout
   - Key information at a glance
   - Clear CTAs

## Responsive Design

### Breakpoints
```css
/* Mobile: 320px - 639px */
/* Tablet: 640px - 1023px */
/* Desktop: 1024px+ */

@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Mobile Considerations
- Stack elements vertically
- Larger touch targets
- Bottom sheet filters
- Collapsible map view
- Simplified navigation

## Interactive Elements

### Buttons
```css
.button-primary {
  background: var(--primary-600);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: var(--primary-800);
}
```

### Form Fields
- Clear focus states
- Inline validation
- Helper text
- Error states

### Animations
- Subtle hover effects
- Smooth transitions
- Loading states
- Success/error feedback

## Accessibility
- High contrast ratios
- Clear focus indicators
- Adequate text sizing
- Screen reader support
- Keyboard navigation
