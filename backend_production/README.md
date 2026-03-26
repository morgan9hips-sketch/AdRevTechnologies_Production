# Backend — Cash for Ads

## Running locally (without Docker)

- Install dependencies: `npm install`
- Create `.env` (see .env.example)
- Run `npx prisma migrate deploy` (or `prisma migrate dev` during development)
- Seed: `npm run db:seed`
- Start: `npm run dev`

## PayPal integration

The file `src/services/payments/paypalAdapter.ts` is a placeholder. Replace with real PayPal SDK code. Set env vars:

- PAYPAL_CLIENT_ID
- PAYPAL_SECRET
- PAYPAL_ENVIRONMENT (sandbox|production)

Do not store secrets in repo. See docs/payout_flow.md for recommended steps.
