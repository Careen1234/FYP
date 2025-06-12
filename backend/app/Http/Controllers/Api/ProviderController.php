<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProviderController extends Controller
{

    public function index()
    {
        return response()->json(Provider::all());
    }



    public function listProviders(Request $request)
    {
        $request->validate([
            'service_id' => 'required|integer|exists:services,id',
            'user_lat' => 'required|numeric',
            'user_lng' => 'required|numeric',
        ]);

        $serviceId = $request->service_id;
        $userLat = $request->user_lat;
        $userLng = $request->user_lng;

        $radiusKm = 10; // Radius for nearby providers, can be changed

        // Haversine formula to calculate distance between two lat/lng points
        $haversine = "(6371 * acos(cos(radians($userLat)) 
                     * cos(radians(latitude)) 
                     * cos(radians(longitude) - radians($userLng)) 
                     + sin(radians($userLat)) 
                     * sin(radians(latitude))))";

        $providers = Provider::select('providers.*')
            ->join('provider_service', 'providers.id', '=', 'provider_service.provider_id')
            ->leftJoin('ratings', 'providers.id', '=', 'ratings.provider_id')
            ->where('provider_service.service_id', $serviceId)
            ->selectRaw("AVG(ratings.rating) as average_rating")
            ->groupBy('providers.id')
            ->havingRaw("$haversine < ?", [$radiusKm])
            ->orderByDesc('average_rating')
            ->get();

        return response()->json($providers);
    }
















    
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
}

    // Block provider
    


