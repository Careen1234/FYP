<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
 public function register(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'phone' => 'required|string|max:20', 
        'role' => 'required|in:admin,user,provider',
        'password' => 'required|min:6|confirmed',  
        'location' => 'nullable|string|max:255',  
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone, 
        'role' => $request->role,
        'location' => $request->location,
        'password' => Hash::make($request->password),
    ]);

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

    Auth::login($user);

    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
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
}

