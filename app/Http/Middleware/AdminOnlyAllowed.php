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
        $user = $request->user();
        if($user!=null){            
            $users = DB::table('accounts')->join('roles','accounts.role_id','=','roles.role_id')->where('account_id',$user->account_id)->select('roles.role_level')->first();            
            if($users->role_level <= 3){
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
