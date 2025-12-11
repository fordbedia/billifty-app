<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @return string|null
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API routes, never redirect — just return 401 JSON.
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // If you later add a web login page, you could return route('login') here.
        return null;
    }
}
