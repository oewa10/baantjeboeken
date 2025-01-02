# BaantjeBoeken

A modern application for booking sports courts and facilities.

## Description
BaantjeBoeken is a platform that allows users to easily book and manage sports court reservations. The application provides a seamless interface for users to view available courts, check schedules, and make bookings.

## Features
- 🔐 User Authentication with Supabase
- 🏸 Court Listing and Details
- 📅 Availability Management
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design

## Technologies
- Next.js 14 (App Router)
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- shadcn/ui Components
- Prisma ORM

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/BaantjeBoeken.git
cd BaantjeBoeken
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3001/auth/callback
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
