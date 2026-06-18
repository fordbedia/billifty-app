## STRIPE_BILLING_PORTAL_CONFIGURATION_ID is the ID of a Stripe Customer Portal Configuration. It usually starts with:

`bpc_`

Example:
`STRIPE_BILLING_PORTAL_CONFIGURATION_ID=bpc_1MrnZsLkdIwHu7ixNiQL1xPM`

Stripe’s API docs show portal configuration IDs using the bpc_... format, and the Customer Portal Configuration object has an id field.

### Get it from Stripe API
Use your Stripe secret key:

```shell
curl https://api.stripe.com/v1/billing_portal/configurations \
  -u sk_test_YOUR_SECRET_KEY:
```
Eg:
```shell
curlttps://api.stripe.com/v1/billing_portal/configurations \
  -u sk_test_51Sd1WjEgxqQWB3tM7oALSNQagKSFVapPtlfLXTkM0snt92OEmBl7feGLQaWCUKF221JZT5ac2v9sf1hSWjWSkcmx00r7yj80PL
```

## Start Stripe CLI Listener (Forward to Your INT URL)
Run:
```shell
stripe listen --forward-to https://int.billifty.com/api/v1/stripe/webhook

stripe listen --forward-to https://localhost/api/v1/stripe/webhook --skip-verify

stripe listen \
  --api-key sk_test_51Sd1WjEgxqQWB3tM7oALSNQagKSFVapPtlfLXTkM0snt92OEmBl7feGLQaWCUKF221JZT5ac2v9sf1hSWjWSkcmx00r7yj80PL
  --forward-to https://int.billifty.com/api/v1/stripe/webhook \
  --skip-verify
  
stripe listen \
  --api-key sk_test_51Sd1WjEgxqQWB3tM7oALSNQagKSFVapPtlfLXTkM0snt92OEmBl7feGLQaWCUKF221JZT5ac2v9sf1hSWjWSkcmx00r7yj80PL \
  --forward-to https://int.billifty.com/api/v1/stripe/webhook \
  --forward-connect-to https://int.billifty.com/api/v1/stripe/webhook \
  --skip-verify
```
Stripe CLI will print:
`Your webhook signing secret is whsec_...`
Copy that secret into .env (STRIPE_WEBHOOK_SECRET=...).

## Trigger Test Events
In another terminal:
```shell
stripe trigger payment_intent.succeeded
```
You should see events like:
- `payment_intent.created`
- `payment_intent.succeeded`
- `charge.succeeded`
- `charge.updated`
And Stripe CLI should show 200 responses once the webhook is correct.

### PayPal Webhooks
```shell
PAYMENT.CAPTURE.COMPLETED
PAYMENT.CAPTURE.DENIED
PAYMENT.CAPTURE.REFUNDED
PAYMENT.CAPTURE.REVERSED
```
#### Stripe and PayPal Webhook URLs:
```shell
https://int.billifty.com/api/v1/stripe/webhook
```

```shell
https://int.billifty.com/api/v1/paypal/webhook
```

