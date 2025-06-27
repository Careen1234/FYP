<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\User;
use App\Models\ProviderService;
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
            'provider_id' => 'required|exists:provider,id',
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);


        $providerService = DB::table('service_provider')
            ->where('provider_id', $validated['provider_id'])
            ->where('service_id', $validated['service_id'])
            ->first();

        if (!$providerService) {
            return response()->json([
                'message' => 'The selected provider does not offer this service.'
            ], 422);
        }

        $booking = Booking::create(array_merge(
            $validated,
            ['status' => 'pending']
        ));

        return response()->json(['message' => 'Booking created successfully', 'data' => $booking], 201);
    }


    // Get available providers for a service within a radius;


public function getAvailableProviders(Request $request)
{
     $user = auth()->user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    $serviceId = $request->input('service_id');
    $lat = $request->input('lat');
    $lng = $request->input('lng');

    if (!$serviceId || !$lat || !$lng) {
        return response()->json(['error' => 'Missing required parameters'], 400);
    }

    $radius = 50; // Radius in KM

    $providers = DB::table('providers')
    ->selectRaw('
        providers.id,
        providers.name,
        providers.latitude,
        providers.longitude,
        AVG(ratings.rating) as avg_rating,
        (6371 * acos(
            cos(radians(?)) * cos(radians(providers.latitude)) *
            cos(radians(providers.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(providers.latitude))
        )) AS distance
    ', [$lat, $lng, $lat])
    ->join('provider_services', 'providers.id', '=', 'provider_services.provider_id')
    ->leftJoin('ratings', 'ratings.provider_id', '=', 'providers.id')
    ->where('provider_services.service_id', $serviceId)
    ->groupBy(
        'providers.id',
        'providers.name',
        'providers.latitude',
        'providers.longitude'
    )
    ->having('distance', '<=', 50)
    ->orderByDesc('avg_rating')
    ->orderBy('distance')
    ->get();

    return response()->json($providers);
}

 public function book(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'service_id' => 'required|exists:services,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'booking_date' => 'required|date',
            'address' => 'nullable|string|max:255',
        ]);

        $user = auth()->user();

        // Check if provider offers the selected service
        $providerService = ProviderService::where('provider_id', $request->provider_id)
            ->where('service_id', $request->service_id)
            ->first();

        if (!$providerService) {
            return response()->json(['error' => 'Provider does not offer the selected service.'], 400);
        }

        $booking = new Booking();
        $booking->user_id = $user->id;
        //$booking->provider_id = $request->provider_id;
        $booking->service_id = $request->service_id;
        $booking->provider_service_id = $providerService->id;
        $booking->user_latitude = $request->latitude;
        $booking->user_longitude = $request->longitude;

       // $booking->address = $request->address;
        $booking->booking_date = $request->booking_date;
        $booking->status = 'pending';
        $booking->is_paid = false;
        $booking->save();

        return response()->json([
            'message' => 'Booking successful.',
            'booking' => $booking
        ], 201);
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
        'provider_service_id' => 'required|exists:provider_service,id', 
    ]);
    $user = auth()->user();

    $providerService = DB::table('provider_services')
            ->where('provider_id', $request['provider_id'])
            ->where('service_id', $request['service_id'])
            ->first();

        if (!$providerService) {
            return response()->json([
                'message' => 'The selected provider does not offer this service.'
            ], 422);
        }

    
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
    'provider_service_id' => $providerService->id // Assuming you have a provider_service_id in the bookings table
]);

    return response()->json(['message' => 'Booking successful', 'booking' => $booking]);
}







public function getProviderBookings(Request $request)
{
   
   
    $providerId = $request->query('provider_id'); 

    if (!$providerId) {
        return response()->json(['error' => 'Missing provider_id'], 400);
    }

   
    $providerServiceIds = ProviderService::where('provider_id', $providerId)->pluck('id');

    
    $bookings = Booking::with(['user', 'service'])
        ->whereIn('provider_service_id', $providerServiceIds) 
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($bookings);
}





    

   


   











    

}