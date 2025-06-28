<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Provider;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class ProviderAuthController extends Controller
{

      public function login(Request $request)
    {
        $provider = Provider::where('email', $request->email)->first();

        if (! $provider || ! Hash::check($request->password, $provider->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $provider->createToken('provider-token')->plainTextToken;

        return response()->json([
            'provider' => $provider,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'provider' => auth('provider')->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
    
}
