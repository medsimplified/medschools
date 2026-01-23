This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Razorpay Setup (Test Mode)

- Required environment variables (use `.env.local`):
	- `NEXTAUTH_URL` → your site/base URL (e.g., http://localhost:3000)
	- `DATABASE_URL` → Postgres connection string
	- `ENCRYPTION_KEY` → 32-character key for encrypting Razorpay secrets in the DB
	- `RAZORPAY_KEY_ID` → Razorpay key ID (rzp_test_...)
	- `RAZORPAY_KEY_SECRET` → Razorpay key secret
	- `RAZORPAY_WEBHOOK_SECRET` → webhook signing secret (whsec_...) if webhooks are enabled

- Subscription pricing is defined in [src/lib/paymentPlans.ts](src/lib/paymentPlans.ts). Update the plan metadata (amount, duration) as needed.
- Checkout UI invokes Razorpay via:
	- [src/components/inner-pages/pricing/PricingArea.tsx](src/components/inner-pages/pricing/PricingArea.tsx)
	- [src/dashboard/student-dashboard/student-dashboard/PricingPlans.tsx](src/dashboard/student-dashboard/student-dashboard/PricingPlans.tsx)

- Webhook endpoint (recommended for payment lifecycle sync):
	- Local: `http://localhost:3000/api/razorpay/webhook`
	- Deploy: `https://<your-domain>/api/razorpay/webhook`
	- Subscribe to: `payment.captured`, `payment.failed`, `order.paid`

- Notes:
	- Secrets are stored encrypted via the RazorpayConfig model. The underlying table name is kept legacy for backward compatibility.
	- Server handlers prefer env keys when supplied; otherwise they fall back to the encrypted DB record maintained via `/api/admin/razorpay-config`.

## Prisma migrations on Render

- Render databases often block `SUPERUSER`, so `prisma migrate dev` can fail remotely.
- Recommended flow:
	1) Run migrations locally against a disposable Postgres (or Render’s DB via a privileged tunnel) with `npx prisma migrate dev`.
	2) Commit the generated SQL under `prisma/migrations/` and deploy.
	3) Run `npm run db:migrate` on the server to apply SQL (`prisma migrate deploy`).
- If remote perms are insufficient, ask Render for a role with `CREATEDB`/`CREATE EXTENSION` or execute the generated SQL manually.

## Monitoring (optional)

- No monitoring provider is configured by default. Add your preferred provider (e.g., Sentry or Logtail) when you’re ready.

## File handling guardrails

- XLSX uploads: limited to 5MB before parsing to reduce resource and payload risk.
- PDF.js worker: pinned to HTTPS CDN to avoid protocol-relative loading.
- For higher safety, move heavy parsing server-side or sandbox untrusted files.
