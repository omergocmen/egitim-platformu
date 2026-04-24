# LearnLite

A simple full-stack online education platform built with Next.js and SQLite. It is intentionally small, readable, and suitable for demo videos or beginner-friendly testing.

## Features
  
- Student registration and login
- Admin login with a default seeded account
- Password hashing with bcrypt
- HTTP-only cookie sessions
- Protected student and admin pages
- Course, section, resource, comment, and admin reply workflows
- Embedded YouTube lessons with URL validation
- SQLite database stored locally in `data/education.db`
- Vercel demo fallback stores SQLite in `/tmp/education.db`

## Default Admin

- Email: `admin@example.com`
- Password: `admin123`

## Run Locally

Install dependencies:

```bash
npm install
```

Create and seed the SQLite database:

```bash
npm run db:setup
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run lint
npm run build
npm run start
```

## Database

The app creates the SQLite database automatically when it first imports `lib/db.ts`. The setup script does the same work explicitly for demos:

```bash
npm run db:setup
```

Seed data includes:

- one default admin user
- one sample course
- two sample sections with YouTube videos
- one sample resource

## Deploying to Vercel

This project can boot on Vercel for demo purposes. On Vercel, the app uses `/tmp/education.db` because the normal project filesystem is not writable at runtime.

Important: `/tmp` is temporary in serverless deployments. Data can disappear between cold starts or deployments. For a real hosted app, use a persistent SQLite-compatible service such as Turso/libSQL and replace `lib/db.ts` with that client.

Recommended Vercel environment variables:

```text
AUTH_SECRET=use-a-long-random-secret
```

Optional local override:

```text
SQLITE_PATH=/absolute/path/to/education.db
```

## Main Pages

- `/register`
- `/login`
- `/dashboard`
- `/courses`
- `/courses/[id]`
- `/admin`
- `/admin/courses`
- `/admin/courses/new`
- `/admin/courses/[id]/edit`
- `/admin/comments`

## Project Structure

- `app/` - Next.js pages and API routes
- `components/` - shared UI and form components
- `lib/` - database, auth, validation, and YouTube helpers
- `scripts/setup-db.ts` - database setup entry point
- `data/` - local SQLite database after setup
