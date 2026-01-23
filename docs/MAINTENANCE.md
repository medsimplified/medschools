# Maintenance Guide (Low Effort)

## Quarterly (or when security notices arrive)
- `npm install`
- `npm run lint && npm run typecheck && npm run build`
- `npm audit` (review/patch non-breaking fixes)

## When changing the database schema
- Run `npx prisma migrate dev` locally against a test/temporary DB.
- Commit the generated SQL in `prisma/migrations/`.
- Deploy, then run `npm run db:migrate` on the server.
- If Render blocks migrate, run the SQL manually or request needed DB permissions.

## Backups
- Ensure your Postgres has automatic backups; test a restore at least once a year.

## File uploads (XLSX/PDF)
- Keep uploads ≤ 5MB. For untrusted files or larger sizes, process server-side or in a sandbox.

## Monitoring (optional)
- No monitoring is configured by default; add one if/when you need it.
