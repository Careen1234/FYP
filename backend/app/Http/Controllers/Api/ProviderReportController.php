<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Provider;
use App\Models\Booking;
use Carbon\Carbon;
use App\Models\ProviderService;
use App\Models\User;
use App\Models\UserBasic;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class ProviderReportController extends Controller
{
public function getMyReport(Request $request)
{
    $providerId = Auth::id();

    $providerServiceIds = ProviderService::where('provider_id', $providerId)->pluck('id');

    $bookings = Booking::with('user')
        ->whereIn('provider_service_id', $providerServiceIds)
        ->when($request->from, fn($q) => $q->whereDate('created_at', '>=', $request->from))
        ->when($request->to, fn($q) => $q->whereDate('created_at', '<=', $request->to))
        ->get();

    $formattedBookings = $bookings->map(function ($booking) {
        return [
            'client_name' => optional($booking->user)->name ?? 'N/A',
            'location' => optional($booking->user)->location ?? 'N/A',
            'date' => $booking->created_at->format('Y-m-d'),
            'payment' => $booking->payment_amount ?? 0,
        ];
    });

    return response()->json([
        'bookings' => $formattedBookings,
        'total_customers' => $bookings->count(),
        'total_income' => $bookings->sum('payment_amount'),
    ]);
}

}
    