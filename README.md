# KeyLaunch API Key Store

A runnable starter website for selling API keys. Customers create an account, choose a plan, pay through hosted checkout, and receive a generated API key after payment is confirmed.

## Plan Structure

1. Storefront: public website with plan cards, purchase flow, and success/cancel pages.
2. Payment gateway: backend creates Stripe Checkout Sessions so card details are handled by Stripe.
3. Accounts: customers register/sign in, then purchases are saved to their account.
4. Fulfillment: backend verifies payment, generates an API key, and stores the order.
5. Reliability: Stripe webhook endpoint fulfills paid sessions even if the customer closes the browser.
6. Production hardening: replace local JSON storage with a database, add email delivery, key revocation, rate limits, and an admin dashboard.

## Current Plans

- Starter: `HK$299` one-time, 50,000 requests per month.
- Growth: `HK$799` one-time, 250,000 requests per month.
- Business: `HK$2,299` one-time, 1,000,000 requests per month.

These prices are intentionally higher than demo pricing so there is room for payment fees, infrastructure cost, support time, and profit. The checkout currency is HKD to better support Hong Kong Stripe accounts and regional payment methods such as Alipay and WeChat Pay. Recheck the quotas after you know your real cost per API request.

## Languages

The storefront supports English, Simplified Chinese, and Traditional Chinese. Customers can switch language from the header; the choice is saved in the browser and also passed to Stripe Checkout as a locale hint.

## Run Locally

```bash
npm start
```

Then open:

```text
http://localhost:4173
```

The app runs in demo checkout mode by default when no real Stripe key is configured. Demo mode does not charge a card.

For public launch steps, see [PRODUCTION_LAUNCH.md](./PRODUCTION_LAUNCH.md).

## Configure Stripe

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set these values:

```env
DEMO_CHECKOUT=false
HOST=127.0.0.1
BASE_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe
ALLOWED_ORIGINS=https://your-domain.com
```

The checkout endpoint creates Stripe Checkout Sessions with one-time payment mode. The webhook endpoint is:

```text
POST /api/stripe/webhook
```

Useful Stripe references:

- [Stripe Checkout](https://docs.stripe.com/payments/checkout)
- [Stripe webhooks](https://docs.stripe.com/webhooks)

## Files

- `public/index.html`: storefront and plan layout.
- `public/app.js`: loads plans, manages accounts, and starts checkout.
- `public/success.html`: shows the issued API key after payment verification.
- `src/server.mjs`: HTTP server, account sessions, Stripe integration, webhook verification, and key generation.
- `data/*.json`: local development account/session/order stores, created at runtime and ignored by Git.

## Before Launch

- Use a real database instead of local `data/*.json` account/session/order files.
- Encrypt API keys at rest or store only hashed keys plus a one-time reveal secret.
- Email keys from the webhook through a transactional email provider.
- Add an authenticated customer portal for key rotation and billing history.
- Add API-key validation and rate limiting in the API product that these keys unlock.
- Turn off `DEMO_CHECKOUT`.
