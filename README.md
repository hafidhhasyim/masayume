## Overview

This is a Next.js app (App Router) ready for deployment on Vercel. It uses Turso (libsql) via Drizzle ORM for data and supports image uploads using Vercel Blob in production.

## Requirements

- Node.js 18+ (Vercel uses Node 18/20)
- A Turso database (or libsql-compatible)
- Optional: Vercel Blob storage for production file uploads

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```
TURSO_CONNECTION_URL="libsql://<your-db-name>.turso.io"
TURSO_AUTH_TOKEN="<your-turso-auth-token>"
BLOB_READ_WRITE_TOKEN="<your-vercel-blob-rw-token>" # optional locally, required in Vercel for uploads
```

- Local dev without `BLOB_READ_WRITE_TOKEN` stores files in `public/uploads`.
- In Vercel, filesystem is read-only; set `BLOB_READ_WRITE_TOKEN` so uploads use Vercel Blob.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and Start (local)

```bash
npm run build
npm start
```

## Database (Turso)

- Drizzle schema lives in `src/db/schema.ts`.
- Migrations are generated under `drizzle/`.
- Ensure your Turso database is provisioned and credentials are set in `.env`.

## Uploads

- API route `POST /api/upload` validates image types and size (≤ 5MB).
- In production (Vercel), uploads are stored via Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.
- In local dev, files are saved under `public/uploads`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel → Select framework: Next.js.
3. Add Environment Variables in Vercel Project Settings:
   - `TURSO_CONNECTION_URL`
   - `TURSO_AUTH_TOKEN`
   - `BLOB_READ_WRITE_TOKEN` (required for production uploads)
4. Build command uses the default: `npm run build`.
5. Deploy. The app will render pages and API routes, and uploads will work with Vercel Blob.

## Notes

- `.env` files are ignored by Git; do not commit secrets.
- The Next.js config avoids custom `outputFileTracingRoot` to prevent path issues on Vercel.
- If you need server-side data seed/migrations, run them before deploying or via a CI step targeting your Turso instance.
