<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PasswordResetResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PasswordResetResourceController extends Controller
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
            $reset = DB::table('password_reset')->where('status', 1)->offset($offset)->limit($limit)->get();
             
            //return json message         
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "List of system password reset",
                'data' => PasswordResetResource::collection($reset)
            ];
            return response()->json($arr,Response::HTTP_OK);
        }     
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $reset = PasswordReset::create($input);
        return $reset;
    }

}
