<?php

namespace App\Http\Middleware;

use App\Http\Resources\AccountResource;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class CheckDisableAccount
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
            $status = DB::table('accounts')->where('account_id',$user->account_id)->select('status')->first();                          
            if($status->status===1){                
                return $next($request);
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Unauthenticated",
                    'data' => "Your account has been disable!"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }         
        }      
        return $next($request);
    }
}
