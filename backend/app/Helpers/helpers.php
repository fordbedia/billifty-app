<?php

if (!function_exists('format_currency')) {
    function format_currency(
        int|float|null $amount,
        string         $currency = 'USD'
    ): string
    {
        if ($amount === null) {
            return '$0.00';
        }

        return match (strtoupper($currency)) {
            'USD' => '$' . number_format($amount / 100, 2),
            default => number_format($amount / 100, 2) . ' ' . strtoupper($currency),
        };
    }
}

if (!function_exists('formatMoney')) {
    function formatMoney(
        int|float|null $amount,
        object|string  $currency = 'USD'
    ): string
    {
        $val = $amount ?? 0;

        $currency = is_string($currency)
            ? $currency
            : $currency->code;

        try {
            $fmt = new \NumberFormatter(
                \Locale::getDefault() ?: 'en_US',
                \NumberFormatter::CURRENCY
            );

            return $fmt->formatCurrency(
                $val,
                strtoupper($currency)
            );
        } catch (\Throwable $e) {
            return number_format($val, 2)
                . ' '
                . strtoupper($currency);
        }
    }
}

if (!function_exists('invoice_payment_reference')) {
    function invoice_payment_reference(?string $paymentIntentId): string
    {
        return $paymentIntentId ?: 'N/A';
    }
}
