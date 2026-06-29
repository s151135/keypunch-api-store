# Production Launch Checklist

The website is ready as a starter, but demo checkout does not collect real money. To let public customers pay you, deploy the app with real Stripe live credentials and turn demo mode off.

## 1. Create Or Configure Stripe

In Stripe Dashboard:

1. Complete your business profile and activate live payments.
2. Copy your live secret key.
3. After deployment, add a webhook endpoint:

```text
https://your-domain.com/api/stripe/webhook
```

Subscribe the endpoint to:

```text
checkout.session.completed
```

Stripe references:

- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/keys

## 2. Deploy The App

Use any Node-capable host such as Render, Railway, Fly.io, Heroku, a VPS, or Docker on your own server.

Production command:

```bash
npm start
```

The app also includes a `Dockerfile` for container hosts.

## 3. Set Production Environment Variables

On your hosting provider, set:

```env
DEMO_CHECKOUT=false
HOST=0.0.0.0
PORT=4173
BASE_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
ALLOWED_ORIGINS=https://your-domain.com
```

Do not commit real Stripe keys into files.

## 4. Verify Before Sharing

1. Open `https://your-domain.com/health`.
2. Confirm it returns `"demoCheckout": false`.
3. Buy one plan with a real card or Stripe-approved live test flow.
4. Confirm the success page shows an API key.
5. Confirm the order appears in your storage.
6. Confirm Stripe Dashboard shows the payment.

## 5. Before Serious Traffic

- Replace `data/orders.json` with a real database.
- Add transactional email delivery for API keys.
- Add customer key rotation and revocation.
- Add a real API-key validation service to the API product.
- Add privacy policy, terms, refund policy, and tax handling.
- Make sure your Stripe account, business location, and taxes are set up correctly.
