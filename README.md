# SSG Digi - Student Governance Digital Platform

A comprehensive digital platform for student governance, designed to streamline student records, event attendance, communication, and clearance processing.

## Features

- User authentication with role-based access control
- QR code generation and scanning for attendance tracking
- Event management and attendance tracking
- Digital clearance processing
- Organization management
- Student points system
- Real-time notifications
- Messaging system
- Comprehensive dashboards

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase (Authentication, Database, Storage)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/ssg-digi.git
cd ssg-digi
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new Supabase project.
2. Run the SQL script in `schema.sql` to set up the database schema.
3. After setting up the project, navigate to `/admin/seed` to seed the database with initial data.

## Demo Accounts

- Admin: admin@ssgdigi.edu / password
- Student: student@example.com / password

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `lib/` - Utility functions and types
- `public/` - Static assets
- `app/actions/` - Server actions for data fetching and mutations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's create a schema.sql file for reference:
