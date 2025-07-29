<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use PDF;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\Provider;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class AdminReportsController extends Controller
{
   public function adminReport(Request $request)
{
    $start = Carbon::parse($request->input('start_date', now()->subMonth()));
    $end = Carbon::parse($request->input('end_date', now()));

    // Total bookings
    $total = Booking::whereBetween('booking_date', [$start, $end])->count();

    // Bookings by status
    $completed = Booking::where('status', 'completed')
        ->whereBetween('booking_date', [$start, $end])->count();
    $cancelled = Booking::where('status', 'cancelled')
        ->whereBetween('booking_date', [$start, $end])->count();
    $pending = Booking::where('status', 'pending')
        ->whereBetween('booking_date', [$start, $end])->count();

    // Top services
    $topServices = Booking::with('service')
        ->whereBetween('booking_date', [$start, $end])
        ->get()
        ->groupBy('service.name')
        ->map(function ($group) {
            return [
                'count' => $group->count(),
                'price_avg' => $group->avg('service.price'),
            ];
        })->sortByDesc('count')->take(5);

    // Top providers
    $topProviders = Booking::with('providerService.provider')
    ->whereBetween('booking_date', [$start, $end])
    ->get()
    ->groupBy(function ($booking) {
        return optional($booking->providerService->provider)->name ?? 'Unknown Provider';
    })
    ->map(fn($group) => $group->count())
    ->sortDesc()
    ->take(5);


    return response()->json([
        'start_date' => $start->toDateString(),
        'end_date' => $end->toDateString(),
        'generated_at' => now()->toDateTimeString(),
        'total_bookings' => $total,
        'completed' => $completed,
        'cancelled' => $cancelled,
        'pending' => $pending,
        'top_services' => $topServices,
        'top_providers' => $topProviders,
    ]);
}

}