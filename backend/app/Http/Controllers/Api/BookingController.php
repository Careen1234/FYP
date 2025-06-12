<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Booking;
use App\Models\Provider;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{

public function index()
{
    $bookings = Booking::with(['user', 'provider', 'service'])->get();

    $formatted = $bookings->map(function ($booking) {
        return [
            'id' => $booking->id,
            'user_name' => $booking->user ? $booking->user->name : 'N/A',
            'provider_name' => $booking->provider ? $booking->provider->name : 'N/A',
            'service_name' => $booking->service ? $booking->service->name : 'N/A',
            'booking_date' => $booking->booking_date,
            'status' => $booking->status,
        ];
    });

    return response()->json(['data' => $formatted], 200);
}

    // Store a new booking
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'provider_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $booking = Booking::create(array_merge(
            $validated,
            ['status' => 'pending']
        ));

        return response()->json(['message' => 'Booking created successfully', 'data' => $booking], 201);
    }


 public function getAvailableProviders(Request $request)
{
    $request->validate([
        'service_id' => 'required|exists:services,id',
        'latitude'   => 'required|numeric',
        'longitude'  => 'required|numeric',
    ]);

    $serviceId = $request->service_id;
    $userLat = $request->latitude;
    $userLng = $request->longitude;

    $providers = Provider::whereHas('services', function ($q) use ($serviceId) {
            $q->where('service_id', $serviceId);
        })
        ->select('providers.*')
        // Subquery to get average rating per provider
        ->selectSub(function ($query) {
            $query->from('ratings')
                ->selectRaw('AVG(rating)')
                ->whereColumn('ratings.provider_id', 'providers.id');
        }, 'avg_rating')
        // Calculate distance using raw expression
        ->selectRaw("
            (6371 * acos(
                cos(radians(?)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(?)) +
                sin(radians(?)) * sin(radians(latitude))
            )) AS distance
        ", [$userLat, $userLng, $userLat])
        ->having('distance', '<', 30)
        ->orderByDesc('avg_rating')
        ->orderBy('distance')
        ->get();

    return response()->json($providers);
}




    // Update booking status (admin or provider action)
    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $booking->status = $request->status;
        $booking->save();

        return response()->json(['message' => 'Booking status updated successfully', 'data' => $booking]);
    }

    // Delete a booking (optional)
    public function destroy($id)
    {
        Booking::destroy($id);
        return response()->json(['message' => 'Booking deleted']);
    }
}