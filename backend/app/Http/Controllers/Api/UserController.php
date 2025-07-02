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


    
public function getProfile(Request $request)
{
   $user = auth()->user(); 
$user->load('userBasic');

return response()->json([
    'id' => $user->id,
    'role' => $user->role,
    'name' => $user->userBasic->name,
    'email' => $user->userBasic->email,
    'phone' => $user->userBasic->phone,
]);

}

public function updateCurrentUserProfile(Request $request)
{
    $user = auth()->user(); // from users table

    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:user,email,' . $user->user_id . ',id',
        'phone' => 'nullable|string|max:20',
    ]);

    $userBasic = $user->userBasic;

    if (!$userBasic) {
        return response()->json(['message' => 'User basic info not found'], 404);
    }

    $userBasic->update($request->only(['name', 'email', 'phone']));

    return response()->json(['message' => 'Profile updated successfully']);
}
   
}






