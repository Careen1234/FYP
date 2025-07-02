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


class UserReportController extends Controller
{
   public function Report(Request $request)
{
    try {
        $userId = Auth::id();

        $bookings = \App\Models\Booking::with([
            'providerService.provider',
            'providerService.service',
            'service'
        ])
        ->where('user_id', $userId)
        ->when($request->from, fn($q) => $q->whereDate('created_at', '>=', $request->from))
        ->when($request->to, fn($q) => $q->whereDate('created_at', '<=', $request->to))
        ->get();

        $ratings = \App\Models\Ratings::where('user_id', $userId)->get()->keyBy(function ($r) {
            return $r->provider_id . '-' . $r->service_id;
        });

        

        $formattedBookings = $bookings->map(function ($booking) use ($ratings) {
            $providerName = optional($booking->providerService?->provider)->name ?? 'Unknown';
            $serviceName = optional($booking->providerService?->service)->name ?? 'Unknown';
           // $payment = $payments[$booking->id]->amount ?? 0;
            $ratingKey = $booking->providerService?->provider_id . '-' . $booking->providerService?->service_id;
            $review = $ratings[$ratingKey]->reviews ?? null;
            $rating = $ratings[$ratingKey]->rating ?? null;

            return [
                'provider_name' => $providerName,
                'service' => $serviceName,
                //'payment' => $payment,
                'review' => $review,
                'rating' => $rating,
                'date' => $booking->created_at?->format('Y-m-d'),
            ];
        });

        return response()->json([
            'bookings' => $formattedBookings,
            'total_bookings' => $bookings->count(),
           // 'total_paid' => $formattedBookings->sum('payment'),
        ]);
    } catch (\Throwable $e) {
        \Log::error('UserReportController@Report failed: ' . $e->getMessage());
        return response()->json(['error' => 'Server error occurred.'], 500);
    }
}
}
