<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\Provider; 

class AuthController extends Controller
{
 public function register(Request $request)
{
     try {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,user,provider',
            'password' => 'required|min:6|confirmed',
            'location' => 'nullable|string|max:255',
            'service' => 'required_if:role,provider|string|max:255',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    }
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone, 
        'role' => $request->role,
        'location' => $request->location,
        'password' => Hash::make($request->password),
        
    ]);

    if ($user->role === 'provider') {
        Provider::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'email' => $request->email,
            'location' => $request->location ?? '',
            'service' => $request->service,
            
        ]);
    }

    return response()->json([
        'message' => 'Registration successful',
        'user' => $user,
    ], 201);

    return response()->json($user, 201);
}


    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json([
            'message' => 'Incorrect credentials.',
            'errors' => [
                'email' => ['Incorrect credentials.']
            ]
        ], 401);
    }
    if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

    Auth::login($user);

    return response()->json([
        'message' => 'Login successful',
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

        Auth::login($provider); // ✅ uses the default 'web' guard

        return response()->json([
            'message' => 'Provider login successful',
            'user' => $provider
        ]);
    }
}


