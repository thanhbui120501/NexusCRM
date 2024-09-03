<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use PhpParser\Node\Expr\FuncCall;

class AuthController extends Controller
{    
    public function login(Request $request)
    {
        
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],   
            'password_confirm' => ['required','same:password'], 
            'remember_token' => ['string']            
        ]);
        $remember = ($request->has('remember_token') && $request->remember_token == 'true') ? true : false;
        
        if (Auth::guard('api')->attempt(['username' => $request->username, 'password' => $request->password],$remember)) {         
            $user = Auth::guard('api')->user();
            $request->session()->regenerateToken(); 
            $token = $request->user('api')->createToken('authToken')->plainTextToken;                  
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Login Account Success!",
                'Bearer-token' => $token,
                'data' => $user
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => "The provided credentials do not match our records."
            ];
            return response()->json($arr, Response::HTTP_OK);
        }
        
    }

    public function logout(Request $request)
    {
        Auth::guard('api')->logout();
        $request->user('sanctum')->currentAccessToken()->delete();
        $request->session()->invalidate(); 
        $request->session()->regenerateToken();      
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Success",
            'data' => "Logout successful"
        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    
    
}
