<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('images:cleanup')->dailyAt('01:00');
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        $this->commands([
            \App\Console\Commands\CleanupUnusedImages::class,
        ]);
    }
        
}