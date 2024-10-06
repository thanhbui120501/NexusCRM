<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
class CleanupUnusedImages extends Command
{
    protected $signature = 'images:cleanup';
    protected $description = 'Delete unused images from the uploads directory';

    public function handle()
    {
        // get file name use
        $usedImages = DB::table('accounts')->pluck('image_name')->toArray();

        // get file in /uploads
        $directory = public_path('\uploads');

        // get file path
        $allImages = File::allFiles($directory);

        // delete files unused
        foreach ($allImages as $image) {
            $imageName = $image->getFilename();
            if (!in_array($imageName, $usedImages)) {
                File::delete($image->getPathname());
            }
        }
        return $this->info('Cleanup completed successfully.');
    }
}
