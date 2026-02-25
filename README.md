# Practice Manager Candidate Assessment (The Foundery Group)

A deployable Next.js 14 micro-site for candidate intake, structured assessment, deterministic auto-scoring, and admin review.

## Features
- Landing page (`/`) with role overview and disclaimer
- Multi-step candidate flow (`/apply`) with local draft autosave
- Submission persistence to Prisma + SQLite
- Deterministic auto-scoring + configurable thresholds
- Admin authentication (`/admin/login`) via `ADMIN_PASSWORD` + secure httpOnly cookie
- Admin dashboard (`/admin`) with filtering and detail view (`/admin/[id]`)
- Status + notes updates
- CSV export (`/api/admin/export`)
- Basic IP-based rate limiting on submissions
- Resend email notification to admin recipients

## Quick Start
```bash
npm install
cp .env.example .env
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```
Open `http://localhost:3000`.

## Configuration
Edit:
- `config/site.ts` for organization/brand copy, recipient defaults, disclaimers
- `config/scoring.ts` for rubric categories, keyword rules, thresholds

## Environment Variables
- `DATABASE_URL` - Prisma DB URL (SQLite default)
- `ADMIN_PASSWORD` - required admin login password
- `SESSION_SECRET` - used for cookie signature
- `RESEND_API_KEY` - optional; if present, sends admin notifications
- `ADMIN_NOTIFY_EMAIL` - default admin recipient
- `NEXT_PUBLIC_BASE_URL` - base URL for redirects
- `OPENAI_API_KEY` - optional (reserved for future AI assist)

## Vercel Deployment Checklist
1. Push this repo to GitHub.
2. In Vercel, import project.
3. Set framework preset to **Next.js**.
4. Add environment variables from `.env.example`.
5. For SQLite on Vercel, prefer migrating to hosted Postgres for production durability (Supabase/Neon). If using Postgres, update `prisma/schema.prisma` datasource provider and `DATABASE_URL`.
6. Run build command: `npm run build`.
7. Deploy.
8. Validate smoke tests below.

## Smoke Test Checklist
- [ ] Submit test application at `/apply`
- [ ] Confirm DB row is created (`npx prisma studio` or query)
- [ ] Confirm admin email received (if `RESEND_API_KEY` configured)
- [ ] Confirm admin login works at `/admin/login`
- [ ] Confirm score + flags appear in admin dashboard/detail
- [ ] Confirm CSV export downloads from admin
- [ ] Confirm rate limit returns HTTP 429 after repeated submissions

## Notes
- HIPAA-minded disclaimer is shown; candidates must confirm no PHI before submit.
- Resume upload is URL-based in this MVP for speed and reliability.
- Designed to be easily theme/copy-tuned without deep code edits.
