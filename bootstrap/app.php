<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;
use App\Http\Middleware\AdminOnlyAllowed;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(        
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();       
        $middleware->use([
        //     // \Illuminate\Http\Middleware\TrustHosts::class,
        //     \Illuminate\Http\Middleware\TrustProxies::class,
        //     \Illuminate\Http\Middleware\HandleCors::class,
        //     \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        //     \Illuminate\Http\Middleware\ValidatePostSize::class,
        //     \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        //     \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
             \Illuminate\Session\Middleware\StartSession::class,           
             \Illuminate\View\Middleware\ShareErrorsFromSession::class,     

        //     Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        //     Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        //     Illuminate\Cookie\Middleware\EncryptCookies::class,
            //App\Http\Middleware\AdminOnlyAllowed::class,
        ]);
        $middleware->alias([
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'admin_only_allowed' => AdminOnlyAllowed::class, 
        ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
