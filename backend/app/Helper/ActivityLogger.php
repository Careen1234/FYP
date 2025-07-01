<?php

namespace App\Helpers;

use App\Models\ActivityLog;

class ActivityLogger
{
    public static function log($message)
    {
        ActivityLog::create([
            'message' => $message,
        ]);
    }
}
