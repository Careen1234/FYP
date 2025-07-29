<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserBasic; 
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = UserBasic::all();
        return response()->json(['users' => $users]);
    }
    public function show($id)
    {

        $user = UserBasic::findOrFail($id);
        
        return response()->json(['message' => "User details for ID: $id"]);
    }
  
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

    
    UserBasic::create([
        'user_id' => $user->id,
        'name' => $request->name,
        'email' => $request->email,
        'phone' => $request->phone,
        //'location' => $request->location,
    ]);

    return response()->json(['message' => 'User created successfully']);
}

public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:user,email,' . $id,
        'password' => 'nullable|string|min:8',
        'phone' => 'nullable|string|max:20',
       
    ]);

    $userBasic = UserBasic::findOrFail($id);

    // Only update password if provided
    if ($request->filled('password')) {
        $user = User::find($userBasic->user_id);
        $user->password = bcrypt($request->password);
        $user->save();
    }

    // Update basic info
    $userBasic->update($request->only(['name', 'email', 'phone']));

    return response()->json(['message' => 'User updated successfully']);
}


    public function destroy($id)
    {
        
        $user = UserBasic::findOrFail($id);
        $user->delete();
        return response()->json(['message' => "User with ID: $id deleted successfully"]);
    }
    public function toggleBlock($id)
    {
       
        $user = User::findOrFail($id);
        $user->status = ($user->status === 'active') ? 'active' : 'blocked';
        $user->save();
        return response()->json(['message' => "User with ID: $id block status toggled"]);
    }

    public function updateCurrentUserProfile(Request $request)
{
    $user = auth()->user(); 

    // Validate the request
    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:user,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        //'location' => 'nullable|string|max:255',
    ]);

    if ($request->has('name')) {
        $user->name = $request->name;
    }
    if ($request->has('email')) {
        $user->email = $request->email;
    }
    if ($request->has('phone')) {
        $user->phone = $request->phone;
    }
    

    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
           // 'location' => $user->location,
            'role' => $user->role,
            'status' => $user->status,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]
    ]);
}

}
