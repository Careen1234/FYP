<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Rating;
use App\Models\Category;
use App\Models\ProviderService;

class ProviderController extends Controller
{

    public function index()
    {
        return response()->json(Provider::all());
    }



   



// ADMIN ADD NEW PROVIDER
 public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:providers,email',
            'service' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'status'=>'required|string|max:10',
            'availability' =>'required|string|max:255'
        ]);

        $provider = Provider::create($validated);

        return response()->json($provider, 201);
    }

    
    public function show($id)
    {
        $provider = Provider::find($id);

        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

     

        return response()->json($provider);
    }

    // Update provider
    public function update(Request $request, $id)
    {
        $provider = Provider::find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('providers')->ignore($provider->id),
            ],
            'service' => 'sometimes|required|string|max:255',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,rejected,approved,blocked',
            'availability' => 'required|string|max:255',
        ]);

        $provider->update($validated);
       
        return response()->json($provider);
    }

   
    public function destroy($id)
    {
        $provider = Provider::find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        $provider->delete();

        return response()->json(['message' => 'Provider deleted']);
    }

    
    public function approve($id)
    {
        $provider = Provider::find($id);
        if (!$provider) {
            return response()->json(['message' => 'Provider not found'], 404);
        }

        $provider->status = 'approved';
        $provider->save();

        return response()->json(['message' => 'Provider approved', 'provider' => $provider]);
    }

    public function reject($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->status = 'rejected';
        $provider->save();

        return response()->json(['message' => 'Provider rejected']);
    }

    public function toggleBlock(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        $status = $request->input('status');

        if (!in_array($status, ['approved', 'blocked'])) {
            return response()->json(['message' => 'Invalid status'], 422);
        }

        $provider->status = $status;
        $provider->save();

        return response()->json(['message' => 'Provider status updated']);
    }

    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Eager load the service category relationship
            $provider = Provider::with('serviceCategory')->where('user_id', $user->id)->first();

            if (!$provider) {
                return response()->json(['error' => 'Provider profile not found for this user.'], 404);
            }

            return response()->json($provider);

        } catch (\Exception $e) {
            Log::error('Failed to fetch provider profile: ' . $e->getMessage());
            return response()->json(['error' => 'Server error while fetching profile.'], 500);
        }
    }

public function getProviderBookings(Request $request)
{
    $user = auth()->user();

    // Get provider_id from user
    $providerId = $user->provider_id;

    // Find provider by id
    $provider = \App\Models\Provider::find($providerId);

    if (!$provider) {
        return response()->json(['error' => 'Provider not found for this user.'], 404);
    }

    $providerServiceIds = ProviderService::where('provider_id', $provider->id)->pluck('id');

    $bookings = Booking::with('user')  
        ->whereIn('provider_service_id', $providerServiceIds)
        ->get()
        ->map(function ($booking) {
            return [
                'id' => $booking->id,
                'customer' => $booking->user ? $booking->user->name : null,
                'date' => $booking->booking_date,
                'status' => $booking->status,
                'address' => $booking->address,
                'is_paid' => $booking->is_paid,
            ];
        });

    return response()->json($bookings);
}

 

}

    


