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

#### Seeding the advanced filters
```shell
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend php artisan db:seed --class=\\BilliftySDK\\SharedResources\\Modules\\AdvancedFilter\\Database\\Seeders\\AdvancedFilterSeeder
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

- [Stripe and Paypal](docs/stripe_paypal.md): Stripe and Paypal integration