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
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ProviderController extends Controller
{

    public function index()
    {
        return response()->json(Provider::all());
    }



   



// ADMIN ADD NEW PROVIDER
 public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:user,email',

        'password' => 'required|string|min:8',
        'phone' => 'nullable|string|max:20',
        //'location' => 'nullable|string|max:255',
    ]);

    // 1. Create in users table (auth data)
    $user = User::create([
        'role' => 'user',
        'password' => Hash::make($request->password),
    ]);

    
    Provider::create([
        'user_id' => $user->id,
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        //'location' => $request->location,
    ]);

    return response()->json(['message' => 'Provider created successfully']);
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
    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:user,email,' . $id,
        'password' => 'nullable|string|min:8',
        'phone' => 'nullable|string|max:20',
       
    ]);

    $provider = Provider::findOrFail($id);

    // Only update password if provided
    if ($request->filled('password')) {
        $user = User::find($provider->user_id);
        $user->password = bcrypt($request->password);
        $user->save();
    }

    // Update basic info
    $provider->update($request->only(['name', 'email', 'phone']));

    return response()->json(['message' => 'Provider updated successfully']);
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
    $user = $request->user();

    if (!$user || !$user->provider_id) {
        return response()->json(['error' => 'Unauthorized or no provider linked.'], 401);
    }

    $provider = Provider::with('services')->find($user->provider_id);

    if (!$provider) {
        return response()->json(['error' => 'Provider not found.'], 404);
    }

    return response()->json([
        'business_name' => $provider->name,
        'business_email' => $provider->email,
        'business_phone' => $provider->phone,
        'services' => $provider->services,
        'price' => $provider->price,
        'bio' => $provider->bio,
        'profile_photo' => $provider->profile_photo,
        'instagram' => $provider->instagram,
        'facebook' => $provider->facebook,
        'website' => $provider->website,
        
    ]);
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

    $bookings = Booking::with('generalUser.basicUser')
        ->whereIn('provider_service_id', $providerServiceIds)
        ->get()
        ->map(function ($booking) {
            return [
                'id' => $booking->id,
                'customer' => optional(optional($booking->generalUser)->basicUser)->name ?? 'Unknown',

                'date' => $booking->booking_date,
                'status' => $booking->status,
                'address' => $booking->address,
                'is_paid' => $booking->is_paid,
            ];
        });

    return response()->json($bookings);
}


public function updateProfile(Request $request)
{
    $provider = auth()->user()->provider;


    $request->validate([
       'name' => 'required|string|max:255',
        'email' => 'nullable|email',
        'phone' => 'nullable|string|max:20',
        'price' => 'nullable|numeric',
        'bio' => 'nullable|string',
        'instagram' => 'nullable|string|max:255',
        'facebook' => 'nullable|string|max:255',
        'website' => 'nullable|string|max:255',
        'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    if ($request->hasFile('profile_photo')) {
        $path = $request->file('profile_photo')->store('profile_photos', 'public');
        $provider->profile_photo = $path; 
    }

    // Save other fields
    $provider->name = $request->name;
    $provider->email = $request->email;
    $provider->phone = $request->phone;
    $provider->price = $request->price;
    $provider->bio = $request->bio;
    $provider->instagram = $request->instagram;
    $provider->facebook = $request->facebook;
    $provider->website = $request->website;
   // $provider->profile_photo = $provider->profile_photo ? asset('storage/' . $provider->profile_photo) : null;

    $provider->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'profile_photo' => $provider->profile_photo 
            ? asset('storage/' . $provider->profile_photo) 
            : null,
    ]);
}
 

}

    


