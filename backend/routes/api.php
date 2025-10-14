<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return ['ok' => true];
    });

    // Later:
    // Route::apiResource('clients', \App\Http\Controllers\ClientController::class);
    // Route::apiResource('invoices', \App\Http\Controllers\InvoiceController::class);
    // Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'pdf']);
});
