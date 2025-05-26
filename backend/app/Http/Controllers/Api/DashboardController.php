<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Provider;
use App\Models\Booking;
use App\Models\ActivityLog; // Assuming you have an ActivityLog model
class DashboardController extends Controller
{
     public function usersCount()
    {
        $count = User::count();
        return response()->json(['count' => $count]);
    }

   
    public function providersCount()
    {
        $count = Provider::count();
        return response()->json(['count' => $count]);
    }

    public function bookingsCount()
    {
        $count = Booking::count();
        return response()->json(['count' => $count]);
    }

    
    public function latestActivity()
    {
        $activities = ActivityLog::orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'message']); 

        return response()->json($activities);
    }
}
