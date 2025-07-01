<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ratings;


class RatingsController extends Controller
{
public function index()
{
    $ratings = Ratings::with(['user', 'provider'])->get();

    $ratings = $ratings->map(function ($rating) {
        $providerName = 'N/A';

        // If provider has a related user for their name
        if ($rating->provider && $rating->provider->user) {
            $providerName = $rating->provider->user->name;
        } elseif ($rating->provider && $rating->provider->name) {
            $providerName = $rating->provider->name;
        }

        return [
            'id' => $rating->id,
            'user_name' => $rating->user?->name ?? 'N/A',
            'provider_name' => $providerName,
            'rating' => $rating->rating,
            'review' => $rating->review,
            'date' => $rating->created_at?->toDateString() ?? '',
        ];
    });

    return response()->json(['data' => $ratings]);
}

      


public function providerReviews(Request $request)
{
    $user = $request->user();

    if (!$user || !$user->provider) {
        return response()->json(['error' => 'User is not a provider or not authenticated.'], 403);
    }

    $providerId = $user->provider->id;

    $ratings = Ratings::where('provider_id', $providerId)
                      ->with(['user', 'service'])
                      ->get();

    $formattedRatings = $ratings->map(function ($rating) use ($user) {
        return [
            'id' => $rating->id,
            'customer' => $rating->user ? $rating->user->name : 'N/A',
            'rating' => $rating->rating,
            'date' => $rating->created_at->toDateString(),
            'comment' => $rating->reviews,
            'service' => $rating->service ? $rating->service->name : 'N/A',
            'customer_avatar' => $rating->user ? $rating->user->name[0] : '?',
        ];
    });

    return response()->json(['data' => $formattedRatings]);
}
}