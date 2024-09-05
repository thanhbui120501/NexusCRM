<?php

namespace App\Http\Controllers;

use App\Http\Resources\LoginHistoryResource;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class LoginHistoryResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input,[           
            'offset' => 'min:0|numeric',
            'limit'=> 'min:1|numeric',
        ]); 
        //checking validate
        if($validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            //set offset and limit
            $offset = !$request->has('limit')  ? 0 : $request->offset;
            $limit = !$request->has('limit') ? 50 : $request->limit;

            //select enable account
            $loginHistory = DB::table('login_history')->where('status', 1)->offset($offset)->limit($limit)->get();
             
            //return json message
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "List of login and logout history",
                'data' => LoginHistoryResource::collection($loginHistory)
            ];
            return response()->json($arr,Response::HTTP_OK);
        }       
    }

    /**
     * Store a newly created resource in storage.
     */
    public function showHistoryLoginOrLogout(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'login' => 'string',
            'logout' => 'string',
            'offset' => 'min:0|numeric',
            'limit'=> 'min:1|numeric',
        ]);
        if($validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            if($request->has('login') && $request->has('logout')){
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Select only one of the two login or logout methods to access",
                    'data' => "Unable to access!"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }else{
                //set offset and limit
                $offset = !$request->has('limit')  ? 0 : $request->offset;
                $limit = !$request->has('limit') ? 50 : $request->limit;

                //check type request login or logout
                if($request->login == 'true'){
                    $login = DB::table('login_history')->where('logout_time',null)->offset($offset)->limit($limit)->get();
                    $arr = [
                        'success' => true,
                        'status_code' => 200,
                        'message' => "List of login history",
                        'data' => LoginHistoryResource::collection($login),
                    ];
                    return response()->json($arr, Response::HTTP_OK);
                }
                if($request->logout == 'true'){
                    $logout = DB::table('login_history')->where('login_time',null)->offset($offset)->limit($limit)->get();
                    $arr = [
                        'success' => true,
                        'status_code' => 200,
                        'message' => "List of logout history",
                        'data' => LoginHistoryResource::collection($logout),
                    ];
                    return response()->json($arr, Response::HTTP_OK);
                }
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "The value passed can only be true, no other value can be used.",
                    'data' => 'Unable to access!',
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(LoginHistory $loginHistory)
    {
        $arr =  [
            'success' => true,
            'status_code' => 200,
            'message' => "Login/logout History has been found",
            'data' => (new LoginHistoryResource($loginHistory))
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoginHistory $loginHistory)
    {       
        //delete: update status -> 0
        $delete = DB::table('login_history')->where('history_id',$loginHistory->history_id)->update(['status' => 0]);
        
        //check update
        if($delete == 1){
            $arr = [
                'success' => true,
                'status_code' => 204,
                'message' => "Deleted successful",
                'data' => 'Success!',
            ];     
            return response()->json($arr, Response::HTTP_NO_CONTENT);
        }else{
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Deleted Failed",
                'data' => 'Failed!',
            ];
            return response()->json($arr, Response::HTTP_OK);
        }   
    }
}
