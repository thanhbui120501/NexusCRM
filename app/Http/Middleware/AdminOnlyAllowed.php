<?php

namespace App\Http\Middleware;

use App\Http\Resources\AccountResource;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class AdminOnlyAllowed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('api')->user();
        if($user!=null){
            $users = DB::table('accounts')->join('roles','accounts.role_id','=','roles.role_id')->where('account_id',$user->account_id)->select('roles.role_name')->first();
            if($users->role_name == "Admin"){
                return $next($request);
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Unauthenticated",
                    'data' => "Your account does not have this permission!"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }         
        }      
        return $next($request);
    }
}
