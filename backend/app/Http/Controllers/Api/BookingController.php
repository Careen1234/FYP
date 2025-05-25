<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Booking;

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

    // Show a single booking
    public function show($id)
    {
        $booking = Booking::with(['user', 'provider', 'service'])->findOrFail($id);
        return response()->json(['data' => $booking]);
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