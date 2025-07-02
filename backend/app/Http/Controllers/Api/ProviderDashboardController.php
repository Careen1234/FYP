<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;



class ProviderDashboardController extends Controller
{
   public function index(Request $request)
   {
       $providerId = auth()->user()->provider_id;

    if (!$providerId) {
        return response()->json(['error' => 'Provider info not found for current user'], 404);
    }

   

    $rating = DB::table('ratings')
        ->where('provider_id', $providerId)
        ->avg('rating') ?? 0;

     $pendingRequests = DB::table('bookings')
        ->join('provider_services', 'bookings.provider_service_id', '=', 'provider_services.id')
        ->where('provider_services.provider_id', $providerId)
        ->where('bookings.status', 'pending')
        ->count();

    // Upcoming Jobs
    $upcomingJobs = DB::table('bookings')
        ->join('provider_services', 'bookings.provider_service_id', '=', 'provider_services.id')
        ->where('provider_services.provider_id', $providerId)
        ->whereBetween('bookings.booking_date', [now()->startOfWeek(), now()->endOfWeek()])
        ->whereIn('bookings.status', ['confirmed', 'accepted'])
        ->count();

    // Completion Stats
    $totalRequests = DB::table('bookings')
        ->join('provider_services', 'bookings.provider_service_id', '=', 'provider_services.id')
        ->where('provider_services.provider_id', $providerId)
        ->count();

    $completedRequests = DB::table('bookings')
        ->join('provider_services', 'bookings.provider_service_id', '=', 'provider_services.id')
        ->where('provider_services.provider_id', $providerId)
        ->where('bookings.status', 'completed')
        ->count();

    // Completion Rate
    $completionRate = $totalRequests > 0 ? round(($completedRequests / $totalRequests) * 100) : 0;

    // Return all stats
    return response()->json([
       // 'monthly_earnings' => $monthlyEarnings,
        'rating' => round($rating, 1),
        'pending_requests' => $pendingRequests,
        'upcoming_jobs' => $upcomingJobs,
        'completion_rate' => $completionRate,
    ]);
   }

}