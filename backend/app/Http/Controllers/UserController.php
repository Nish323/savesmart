<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    /**********************************************************************************
     * SHOW
     **********************************************************************************/
    public function showTop()
    {
        return response()->json(['message' => 'Laravel経由のユーザートップ：データ']);
    }
    /**********************************************************************************
     * LOGIC
     **********************************************************************************/
    
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        
        $token = $user->createToken('token', ['user'], now()->addMonth())->plainTextToken;
        
        return response()->json([
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);
 
        $user = User::where('email', $data['email'])->first();
 
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => '無効なメールアドレスまたはパスワードです'], 401);
        }
 
        $token = $user->createToken('token', ['user'], now()->addMonth())->plainTextToken;
 
        return response()->json([
            'token' => $token,
        ]);
    }
 
    public function checkAuth(Request $request)
    {
        return response()->json($request->user());
    }
 
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json();
    }
}
