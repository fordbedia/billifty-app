# Billifty (Invoice App) — Project Context

Billifty is an invoicing SaaS. Backend is Laravel 12 (PHP 8.2+), frontend is Next.js 15 (React 19). The whole stack runs in Docker Compose. Business logic lives in a separate modular package (`shared-resources`) consumed by the Laravel app as a Composer dependency, not in `backend/app`.

## Repo layout

```
/Users/edbedia/Sites/invoice/
├── backend/                # Laravel 12 app shell (routes bootstrapping, config, public/, app/Helpers)
├── frontend/                # Next.js 15 app (React 19, Redux Toolkit, TanStack Query, HeroUI, Tailwind 4, Tiptap editor, Stripe.js)
├── shared-resources/         # Composer package "billifty/shared-resources" — ALL real business logic
│   └── src/
│       ├── Modules/          # Domain modules, see below
│       └── SharedResourceServiceProvider.php  # registers module providers with Laravel
├── docker/                   # nginx, php-fpm, node, playwright, mysql init, certs Dockerfiles/configs
├── configs/                  # .env.prod, .env.local (env files injected via env_file: in compose)
├── docker-compose.yml        # base/prod service definitions
├── docker-compose.dev.yml    # dev overrides (ports, bind mounts, hot-reload, dev TLS certs)
└── docs/                     # misc docs (e.g. stripe_paypal.md)
```

Backend is installed as `billifty/shared-resources: "*"` via Composer, with `shared-resources/` bind-mounted into the backend/queue-worker/scheduler containers at `/var/www/shared-resources`. Editing shared-resources locally is picked up immediately in dev without reinstalling.

## Modules (shared-resources/src/Modules)

Each module is a self-contained Laravel-style module with its own `routes/`, `Models/`, `Http/Controllers`, `Providers/`, `Database/` (migrations/seeders), `Tests/`, and usually a mix of layered folders (`Domain/`, `Application/`, `Infrastructure/` for newer modules following light DDD/hexagonal style; older modules use flatter `Repository/`, `Services/`, `Action/` instead). Routes are prefixed under `v1` and mostly guarded by `auth:api` (Laravel Passport).

- **User** — auth, users, plans/plan capabilities, onboarding, contact messages. Has `Auth/`, `AuthTypes/`, `Policies/`, `Observers/`, `Scopes/`, `Notifications/`, `Mail/`.
- **Invoicing** — the core domain: Invoices, InvoiceItems, Clients, BusinessProfiles, Templates (InvoiceTemplates/Versions/Category), ColorScheme, Currency, PaymentInformation, Workspace, payment reminders (InvoiceReminderSchedule + Rule, InvoicePaymentReminder). Includes `Action/` (e.g. `GenerateInvoicePdf`), `Jobs/`, `Adapters/`, `Ports/`, `Domain/`, `Console/` (custom artisan commands, e.g. `billifty:make observer`).
- **Billing** — subscriptions & payments: UserSubscription, PlanUsagePeriod, PaymentRecord, PaymentLink, Stripe/PayPal webhook event logs (`StripeWebhookEvents`, `PayPalWebhookEvent`). Has `DTO/`, `Contracts/`, `Exceptions/`, `Domain/`, `Application/`, `Infrastructure/`.
- **Dashboard** — dashboard/reporting views on top of the other modules (`Application/`, `Infrastructure/`, no own Models — reads from Invoicing/Billing).
- **AdvancedFilter** — generic filtering system (AdvancedFilterField/Operator/FieldOperator) used across list views; seeded via `AdvancedFilterSeeder`.

PDF generation is done via a dedicated **Playwright** microservice (`docker/playwright`, Node service on port 3000), called from the backend via `PLAYWRIGHT_PDF_SERVICE_URL`.

## Docker services (docker-compose.yml + docker-compose.dev.yml)

| Service | Role | Notes |
|---|---|---|
| `nginx` | reverse proxy | serves backend (PHP-FPM) + proxies frontend; certbot for Let's Encrypt in prod, self-signed dev certs in `docker/certs` for dev |
| `backend` | Laravel app (php-fpm) | PHP 8.3-fpm image built from `docker/php/app.dockerfile`; mounts `backend/` and `shared-resources/` |
| `queue-worker` | `php artisan queue:work` | same image as backend, processes Redis-backed queue |
| `scheduler` | `php artisan schedule:run` loop | same image as backend, runs every 60s |
| `frontend` | Next.js app | prod: `npm run start`; dev: `npm run dev` with polling for file watch over bind mounts |
| `composer` | one-off | runs `composer install --no-dev` for prod builds |
| `mysql` | database | MySQL latest, exposed on 3306 (prod) / 3307 (dev, remapped) |
| `redis` | cache/queue broker | `redis-server --appendonly yes`, persisted volume |
| `playwright` | PDF rendering microservice | internal only, port 3000 |
| `certbot` | Let's Encrypt renewal loop | prod only |

Dev overrides (`docker-compose.dev.yml`) add: HTTPS port 443 + a preview port 8086→8081, dev TLS certs, `.env.local` instead of `.env.prod`, bind-mounted `frontend/` with polling-based hot reload, and a remapped MySQL host port (3307) / Redis host port (6380) so they don't collide with local installs.

Run stack: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` (see `start-invoice.sh`).

⚠️ DB credentials are currently hardcoded in both compose files (`DB_PASSWORD: b1ll1iftykamikalara0213`, `MYSQL_ROOT_PASSWORD: root`) instead of sourced from `.env`/`configs/*.env`. Worth moving to env vars before this repo is shared or made public.

## Conventions worth knowing

- Custom artisan generator: `php artisan billifty:make observer <Name> --module=<ModuleName>` (see `Invoicing/Console`) — likely other `billifty:make *` generators exist for scaffolding module pieces.
- Auth is Laravel Passport (`laravel/passport`), token-based (`auth:api` middleware). Personal access tokens generated via `php artisan passport:client --personal`.
- Payments: Stripe (`stripe/stripe-php`) + PayPal (`srmklive/paypal`), webhooks land in `Billing` module, stored idempotently keyed by `event_id`, raw payload kept as string.
- PDF: `intervention/image`, `simplesoftwareio/simple-qrcode` for image/QR work in PHP; actual invoice-to-PDF conversion is offloaded to the Playwright service.
- Frontend state: Redux Toolkit + TanStack Query; UI kit is HeroUI on Tailwind 4; rich text via Tiptap.

## Planned: AI microservice (in progress, not yet built)

Plan is a separate microservice (e.g. `https://ai.billifty.com/invoice/create`) that accepts a natural-language prompt, runs an AI agent, and returns structured data for the Laravel backend to create invoices/records from. See project discussion for architecture recommendation: keep it as a sibling directory (`ai-service/`) within this repo, added as its own Docker Compose service on the same `webnet` network, calling back into the Laravel API rather than touching MySQL directly.
