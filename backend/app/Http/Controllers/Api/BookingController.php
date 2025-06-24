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
    $serviceId = $request->input('service_id');
        $lat = $request->input('lat');
        $lng = $request->input('lng');

        if (!$serviceId || !$lat || !$lng) {
            return response()->json(['error' => 'Missing required parameters'], 400);
        }

        $radius = 50; // km radius to find nearby providers

        // Haversine formula to calculate distance
        $providers = Provider::selectRaw("*, ( 6371 * acos( cos( radians(?) ) * cos( radians(latitude) ) 
            * cos( radians(longitude) - radians(?) ) + sin( radians(?) ) * sin( radians(latitude) ) ) ) AS distance", 
            [$lat, $lng, $lat])
            ->where('service_id', $serviceId)
            ->having('distance', '<=', $radius)
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

    // Get bookings for the logged-in user
    public function userBookings(Request $request)
    {
        //$user = $request->user();
        
        $bookings = Booking::where('user_id', $user->id)->get();
        return response()->json($bookings);
    }

    public function bookProvider(Request $request)
{
    $validated = $request->validate([
        'provider_id' => 'required|exists:providers,id',
        'service_id' => 'required|exists:services,id',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'booking_date' => 'required|date',
        'address' => 'nullable|string',
    ]);

    
    $booking = Booking::create([
        'user_id' => auth()->id(),
        'provider_id' => $validated['provider_id'],
        'service_id' => $validated['service_id'],
        'latitude' => $validated['latitude'],
        'longitude' => $validated['longitude'],
        'booking_date' => $validated['booking_date'],
        'address' => $validated['address'] ?? '',
        'status' => 'pending',
        'is_paid' => false,
    ]);

    return response()->json(['message' => 'Booking successful', 'booking' => $booking]);
}


public function getProviderBookings(Request $request)
{
    $user = auth()->user();

    if (!$user || $user->role !== 'provider') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $provider = \App\Models\Provider::where('user_id', $user->id)->first();

    if (!$provider) {
        return response()->json(['message' => 'Provider not found'], 404);
    }

    $bookings = \App\Models\Booking::with(['user', 'service'])
        ->where('provider_id', $provider->id)
        ->get();

    $formatted = $bookings->map(function ($booking) {
        return [
            'id' => $booking->id,
            'customer' => $booking->user->name ?? 'N/A',
            'date' => $booking->booking_date,
            'status' => $booking->status,
        ];
    });

   



    \Log::info('Provider reached this method.');
    \Log::info('User role:', ['role' => $user->role]);

    \Log::info('Provider bookings retrieved successfully.', ['provider_id' => $provider->provider_id, 'bookings_count' => $formatted->count()]);
    \Log::info('Formatted bookings data:', ['bookings' => $formatted->toArray()]);
    \Log::info('Provider bookings response sent.');
    \Log::info('Provider bookings response sent successfully.', ['provider_id' => $provider->provider_id, 'bookings_count' => $formatted->count()]);

    return response()->json($formatted);
}







    public function updateBookingStatus(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,canceled',
        ]);

        $booking = Booking::where('id', $bookingId)
            ->where('provider_id', auth()->id())  
            ->firstOrFail();

        $booking->status = $validated['status'];
        $booking->save();

        return response()->json(['message' => 'Booking status updated', 'booking' => $booking]);
    }

}