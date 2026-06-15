<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('billing:downgrade-expired-cancellations --grace=1')
    ->hourly(); // or daily()

Schedule::command('invoice-reminders:send-due')
	->everyFifteenMinutes()
	->withoutOverlapping();
