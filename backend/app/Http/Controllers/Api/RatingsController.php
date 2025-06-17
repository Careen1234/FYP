<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ratings;


class RatingsController extends Controller
{
public function index()
{
    
        
    $ratings = Ratings::with(['user', 'provider', 'service'])->get();

    $ratings = $ratings->map(function ($rating) {
        return [
            'id' => $rating->id,
            'user_name' => $rating->user ? $rating->user->name : 'N/A',
            'provider_name' => $rating->provider ? $rating->provider->name : 'N/A',
            'service_name' => $rating->service ? $rating->service->name : 'N/A',
            'rating' => $rating->rating,
            'reviews' => $rating->reviews,
           
            
        ];
    });

   return response()->json(['data' => $ratings]);

      
}
}