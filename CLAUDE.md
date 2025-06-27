# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 live polling application using TypeScript and Tailwind CSS. The application allows users to create polls and vote in real-time with visual progress bars.

### Key Structure
- **App Router**: Uses Next.js 13+ app directory structure
- **Client Components**: Interactive pages marked with "use client" directive
- **Supabase Integration**: Real database with PostgreSQL backend
- **Type Safety**: Comprehensive TypeScript interfaces in `types/database.ts` and Supabase schema in `types/supabase.ts`

### Data Flow
- All data is managed through Supabase PostgreSQL database
- Database operations handled by `DatabaseService` class in `lib/database.ts`
- Polls are created via `DatabaseService.createPoll()` which inserts poll + options
- Voting is handled by `DatabaseService.addVote()` which records votes in database
- Real-time updates via polling intervals (3-second refresh cycles)

### Page Structure
- `/` - Home page displaying recent polls from database with loading states
- `/create` - Poll creation form with dynamic option management and error handling
- `/poll/[id]` - Individual poll display with voting interface and progress bars

### UI Components
- Extensive Radix UI component library in `components/ui/`
- Tailwind CSS for styling with custom component configurations
- Theme provider setup for dark/light mode support

### Important Patterns
- TypeScript path aliases configured with `@/*` pointing to root
- Client-side state management using React hooks
- Async/await patterns with simulated API delays
- Error handling with try/catch blocks and user feedback
- Form validation and disabled state management

### Dependencies
- React 19 with Next.js 15
- Supabase client for database operations
- Comprehensive Radix UI component ecosystem
- React Hook Form with Zod validation
- Tailwind CSS with animations
- Lucide React icons

### Database Schema (Supabase)
- `polls` table: id, question, created_by, created_at
- `options` table: id, poll_id, text
- `votes` table: id, poll_id, option_id, user_id

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key