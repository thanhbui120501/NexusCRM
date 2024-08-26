<?php

namespace App\Http\Controllers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function test(){
        dd(1);
    }
    public function login(Request $request)
    {
        
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],   
            'password_confirm' => ['required','same:password'],             
        ]);
        $remember = $request->has('remember_token') ? true : false;
       
        if (Auth::guard('api')->attempt(['username' => $request->username, 'password' => $request->password])) {         
            $user = Auth::guard('api')->user();
            
            $token = $user->createToken('authToken')->plainTextToken;                   
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Login Account Success!",
                'Bearer-token' => $token,
                'data' => ""
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
    public function logout(Request $request):RedirectResponse
    {
        $request->validate([
            'username' => ['required'],
            'password' => ['required'],   
            'password_confirm' => ['required','same:password'],             
        ]);
        dd($request->validate());
        return 1;
    }
    
}
