<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URI'),
    ],

    'stripe' => [
        'secret' => env('STRIPE_SECRET'),

        // Match StripePaymentGateway::resolvePriceId("planCode","billingCycle")
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'connect_webhook_secret' => env('STRIPE_CONNECT_WEBHOOK_SECRET'),
        'billing_portal_configuration' => env('STRIPE_BILLING_PORTAL_CONFIGURATION_ID'),
        'prices' => [
            'pro' => [
                'monthly' => env('STRIPE_PRICE_PRO_MONTHLY'),
                'yearly'  => env('STRIPE_PRICE_PRO_YEARLY'),
            ],
            'premium' => [
                'monthly' => env('STRIPE_PRICE_PREMIUM_MONTHLY'),
                'yearly'  => env('STRIPE_PRICE_PREMIUM_YEARLY'),
            ],
        ],
        'return_url' => env('STRIPE_RETURN_URL'),
        'manage_subscriptions_url' => env('STRIPE_MANAGE_SUBSCRIPTIONS_URL'),
    ],

    'playwright_pdf' => [
        'url' => env('PLAYWRIGHT_PDF_SERVICE_URL', 'http://playwright:3000'),
        'timeout' => env('PLAYWRIGHT_PDF_TIMEOUT', 60),
        'asset_base_url' => env('PLAYWRIGHT_PDF_ASSET_BASE_URL', 'http://nginx:8081'),
    ],

];
