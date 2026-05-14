### Testing Route for Invoices:
```http://localhost:8081/dev/invoices/1/preview```

### Clear Redis on Docker Volume:
```shell
docker volume rm <your_volume_name>
```
To see all volumes:
```shell
docker volume ls
```
Your Redis volume will look like:
```shell
yourproject_redis-data
```
Delete it:
```shell
docker volume rm yourproject_redis-data
```
### Clear Redis manually (inside Docker):
If you want to wipe Redis without deleting the volume:
```shell
docker compose exec redis redis-cli FLUSHALL
```
Or clear only the default DB (#0):
```shell
redis-cli FLUSHDB
```
### Generate Passport API Tokens --personal option
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend php artisan passport:client --personal
```

### What command do I run in Laravel to start the queue worker?
Inside your backend container:
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend \
  php artisan queue:work redis
```
Or shorter:
```shell
php artisan queue:work redis
```
Include helpful flags:
```shell
php artisan queue:work redis --tries=3 --timeout=90 --verbose
```
Full command inside Docker:
```shell
docker compose exec backend php artisan queue:work redis --tries=3 --timeout=90
```

## Creating an Observer
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend \ 
php artisan billifty:make observer InvoiceObserver --module=Invoicing
```

# Stripe Webhooks (Local/INT) Setup Guide
## Configure the Webhook Secret in .env

When using Stripe CLI listen, Stripe prints a signing secret like:

whsec_...

Add that to your backend .env:
```shell
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```
And ensure config/services.php uses it:
```shell
'stripe' => [
  // ...
  'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```
## Stripe Webhook Controller Basics

Key points:
- Read the raw request body using $request->getContent() (important for signature verification)
- Validate Stripe-Signature with Webhook::constructEvent(...)
- Always store payload as a string (encode if you want JSON)
- Return 200 OK after processing
Example patterns we used:
- Log when the endpoint is hit (path/ip/signature exists)
- Validate payload + signature
- Extract customer/subscription IDs if present
- Store events idempotently with updateOrInsert(event_id)
- Store payload as a string (no arrays)
## Test Connectivity to the Endpoint

Ping / DNS sanity check
```shell
ping -c 1 int.billifty.com
```
Make sure POST works (GET will return 405)
```shell
curl -i -X POST https://int.billifty.com/api/v1/stripe/webhook -d '{}'
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
