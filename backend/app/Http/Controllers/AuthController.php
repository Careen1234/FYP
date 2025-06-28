<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\Provider; 
use App\Models\UserBasic; 
use App\Models\Service;
use Illuminate\Validation\Rule; 

class AuthController extends Controller
{
public function register(Request $request)
{
      try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:providers,email|unique:user,email',
            'phone' => 'required|string|max:10',
            'role' => 'required|in:admin,user,provider',
            'password' => 'required|string|min:6|confirmed',
            'location' => 'nullable|string|max:255',
            'service' => 'required_if:role,provider',
            'service.*' => 'exists:services,id',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    }

    $provider_id = null;
    $user_id = null;



    if ($request->role === 'provider') {
     
        $provider = Provider::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'location' => $request->location ?? '',
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

       
        $provider->services()->sync($request->service);

        $provider_id = $provider->id;
    } elseif ($request->role === 'user') {
        
        $user = UserBasic::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
           // 'location' => $request->location ?? '',
        ]);

        if ($request->has('service')) {
            $user->services()->sync($request->service);
        }

        $user_id = $user->id;
    }

    
   $generalUserData = [
    'password' => Hash::make($request->password),
    'role' => $request->role,
];

if ($provider_id) {
    $generalUserData['provider_id'] = $provider_id;
}

if ($user_id) {
    $generalUserData['user_id'] = $user_id;
}
    $generalUser = User::create($generalUserData);

    return response()->json([
        'message' => 'Registration successful',
        'user' => $generalUser,
    ], 201);
}




 public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Find user by email in related tables
    $user = User::whereHas('providerInfo', function ($q) use ($credentials) {
        $q->where('email', $credentials['email']);
    })->orWhereHas('userInfo', function ($q) use ($credentials) {
        $q->where('email', $credentials['email']);
    })->first();

    if (!$user) {
        return response()->json([
            'message' => 'Incorrect credentials.',
            'errors' => ['email' => ['Incorrect credentials.']],
        ], 401);
    }

    // Check password
    if (!Hash::check($credentials['password'], $user->password)) {
        return response()->json([
            'message' => 'Incorrect credentials.',
            'errors' => ['email' => ['Incorrect credentials.']],
        ], 401);
    }

    // Create token
    $token = $user->createToken('auth-token')->plainTextToken;

    // Return user info with related data
    return response()->json([
        'message' => 'Login successful',

        'role' => $user->role,
        'token' => $token,
        'user' => $user->load(['providerInfo', 'userInfo']),

        'user' => $user

    ]);
}







    public function me(Request $request)
    {
        return $request->user();
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }


    public function loginProvider(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $provider = Provider::where('email', $request->email)->first();

        if (!$provider || !Hash::check($request->password, $provider->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        Auth::login($provider); 

        return response()->json([
            'message' => 'Provider login successful',
            'user' => $provider
        ]);
    }
}


