<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
      public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $admin = User::where('role', 'admin')->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid admin credentials'], 401);
        }

        
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Admin logged in successfully',
            'token' => $token,
            'role' => $admin->role,
            'id' => $admin->id,
        ]);
    }
}
