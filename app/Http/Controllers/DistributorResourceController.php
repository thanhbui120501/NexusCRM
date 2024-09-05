<?php

namespace App\Http\Controllers;

use App\Models\Distributor;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\DistributorResource;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DistributorResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $distributor = Distributor::all();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of distributor",
            'data' => DistributorResource::collection($distributor)
        ];
        return response()->json($arr,Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input,[
            'distributor_name' => 'required|string|max:100|min:5',
            'address' => 'string|max:255',
            'representative_name' => 'string|max:70',
            'phone_number' => "unique:distributors,phone_number|digits:10|numeric",
            'email' => 'email|unique:distributors,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'business_sector' => 'string|max:10'
        ]);
        //check validate
        if($validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            //crate new distributor
            $input['distributor_id'] = 'DIS'.Carbon::now()->format('dmyhis');
            $distributor = Distributor::create($input);
            
            //save activity
            $user = Auth::guard('api')->user();
            $newRequest = (new RequestController)->makeActivityRequest(
                'Distributor Created',
                'Distributor',
                'The user '. $user->username . (new RequestController)->makeActivityContent("Distributor Created") . $distributor->distributor_name .'.',
                $user->account_id,
                $user->username);               
            $result = (new ActivityHistoryResourceController)->store($newRequest);
            
            //return json message
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new distributor successfully",
                'data' => new DistributorResource($distributor),
                'activity' => [
                    'activity_name' => $result->activity_name,
                    'activity_type' => $result->activity_type,
                    'activity_content' => $result->activity_content,
                    'activity_time' => $result->created_at,    
                ],
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Distributor $distributor)
    {
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Distributor has been found",
            'data' => new DistributorResource($distributor),
            ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Distributor $distributor)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input,[
            'distributor_name' => 'string|max:100|min:5',
            'address' => 'string|max:255',
            'representative_name' => 'string|max:70',
            'phone_number' => "unique:distributors,phone_number|digits:10|numeric",
            'email' => 'email|unique:distributors,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'business_sector' => 'string|max:10'
        ]);
        //check validate
        if($validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            //update distributor
            $update = $distributor->update($request->all());
            if($update){
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Distributor Updated',
                    'Distributor',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Distributor Updated",$request) . $distributor->distributor_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated Distributor successful",                  
                    'data' => new DistributorResource($distributor),
                    'activity' => [
                        'activity_name' => $result->activity_name,
                        'activity_type' => $result->activity_type,
                        'activity_content' => $result->activity_content,
                        'activity_time' => $result->created_at,    
                    ],
                ];
                return response()->json($arr, Response::HTTP_OK);
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Update Distributor Failed",                   
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Distributor $distributor)
    {
        $check_id = DB::table('accounts')->where('role_id', $distributor->distributor_id)->get();
        if($check_id->isEmpty()){
            $delete = $distributor->delete();
            if($delete){
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Distributor Deleted',
                    'Distributor',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Distributor Deleted") . $distributor->distributor_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);
                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 204,
                    'message' => "Deleted Distributor successful",
                    'data' => 'Success!',
                    'activity' => [
                        'activity_name' => $result->activity_name,
                        'activity_type' => $result->activity_type,
                        'activity_content' => $result->activity_content,
                        'activity_time' => $result->created_at,    
                    ],        
                ];
                return response()->json($arr, Response::HTTP_NO_CONTENT);
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Deleted Distributor Failed",
                    'data' => 'Failed!',
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }else{
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Deleted Failed",
                'data' => "This distributor cannot be deleted because an warehouse is already holding this distributor.",
            ];
            return response()->json($arr, Response::HTTP_OK);
        }
    }
}
