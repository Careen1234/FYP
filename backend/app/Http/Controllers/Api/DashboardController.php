<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Provider;
use App\Models\Booking;
use App\Models\ActivityLog; 
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = DB::table('user')->count();
        $totalProviders = DB::table('providers')->count();
        $totalBookings = DB::table('bookings')->count();

        $latestActivities = DB::table('activity_logs')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get(['id', 'message']);

        return response()->json([
            'total_users' => $totalUsers,
            'total_providers' => $totalProviders,
            'total_bookings' => $totalBookings,
            'latest_activities' => $latestActivities,
        ]);
    }
}
