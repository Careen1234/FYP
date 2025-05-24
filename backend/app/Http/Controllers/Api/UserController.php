<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::all();
        return response()->json(['users' => $users]);
    }
    public function show($id)
    {

        $user = User::findOrFail($id);
        
        return response()->json(['message' => "User details for ID: $id"]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'location' => $request->location,
            'phone' => $request->phone,
            'status' => 'active', 
        ]);
        
        return response()->json(['message' => 'User created successfully']);
    }
    public function update(Request $request, $id)

    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);
        $user = User::findOrFail($id);
        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);
        if ($request->has('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->location = $request->input('location', $user->location);
        $user->phone = $request->input('phone', $user->phone);
        $user->save();
        
        return response()->json(['message' => "User with ID: $id updated successfully"]);
    }
    public function destroy($id)
    {
        
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => "User with ID: $id deleted successfully"]);
    }
    public function toggleBlock($id)
    {
       
        $user = User::findOrFail($id);
        $user->status = ($user->status === 'blocked') ? 'active' : 'blocked';
        $user->save();
        return response()->json(['message' => "User with ID: $id block status toggled"]);
    }
}
