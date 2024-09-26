<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use Carbon\Carbon;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required'],
            'password' => ['required'],
            'remember_token' => ['string'],
        ]);
        $remember = ($request->has('remember_token') && $request->remember_token == 'true') ? true : false;

        //check username and password
        if (Auth::guard('api')->attempt(['username' => $request->username, 'password' => $request->password], $remember)) {
            //get user
            $user = Auth::guard('api')->user();

            if ($user->deleted_status == 1) {
                $arr = [
                    'success' => false,
                    'status_code' => 401,
                    'message' => "Failed",
                    'data' => "The provided credentials do not match our records."
                ];
                return response()->json($arr, Response::HTTP_UNAUTHORIZED);
            }
            if ($user->status == 0) {
                //return json message if account has blocked
                $arr = [
                    'success' => false,
                    'status_code' => 403,
                    'message' => "Account disabled",
                    'data' => "Your account has been disabled",
                ];
                return response()->json($arr, Response::HTTP_FORBIDDEN);
            }


            //generate token, session, ip adress and user agent
            //$request->session()->regenerateToken(); 
            $token = $request->user('api')->createToken('authToken')->plainTextToken;

            // //get ipadress 
            // if($request->has('ip_address')){
            //     $ip = $request->ipaddress;
            // }else{
            //     $ip = $request->ip();
            // }                

            // //get user-agent
            // if($request->has('user_agent')){
            //     $userAgent = $request->user_agent;
            // }else{
            //     $userAgent = $request->header('User-Agent');
            // }                

            //create login history
            // $request = new Request([
            //     'history_id' => 'HIS'.Carbon::now()->format('dmyhis'),
            //     'account_id' => $user->account_id,
            //     'login_time' => Carbon::now(),
            //     'logout_time' => null,
            //     'ip_address' => null,
            //     'device_name' => null,               
            //     'status' => 1
            // ]);
            // $this->createLoginHistory($request);
            //create json message
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Success!",
                'Bearer_token' => $token,
                'data' => (new AccountResource($user))
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            $arr = [
                'success' => false,
                'status_code' => 401,
                'message' => "Failed",
                'data' => "The provided credentials do not match our records."
            ];
            return response()->json($arr, Response::HTTP_UNAUTHORIZED);
        }
    }
    public function logout(Request $request)
    {
        //$user = $request->user();
        // $ip = $request->ip();
        // $userAgent = $request->header('User-Agent');

        //logout
        //Auth::guard('api')->logout();

        //create logout history
        // $request = new Request([
        //     'history_id' => 'HIS'.Carbon::now()->format('d.m.y.h.i.s'),
        //     'account_id' => $user->account_id,
        //     'login_time' => null,
        //     'logout_time' => Carbon::now(),
        //     'ip_address' => null,
        //     'device_name' => null,               
        //     'status' => 1
        // ]);
        // $this->createLoginHistory($request);         
        $request->user('sanctum')->currentAccessToken()->delete();
        //regenerate token
        // $request->session()->invalidate(); 
        // $request->session()->regenerateToken();      


        //create json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Success",
            'data' => "Logout successful"
        ];
        return response()->json($arr, Response::HTTP_NO_CONTENT);
    }

    public function createLoginHistory(Request $request)
    {
        $input = $request->all();
        $history = LoginHistory::create($input);
        return $history;
    }
}
