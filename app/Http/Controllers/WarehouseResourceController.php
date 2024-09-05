<?php

namespace App\Http\Controllers;

use App\Http\Resources\WarehouseResource;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class WarehouseResourceController extends Controller
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
            //select enable warehouse
            $warehouse = DB::table('warehouses')->where('status', 1)->offset($offset)->limit($limit)->get();
            
            //return json message      
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "List of warehouse",
                'data' => WarehouseResource::collection($warehouse)
            ];
            return response()->json($arr,Response::HTTP_OK);
        }
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input,[
            'warehouse_name' => 'required|string|max:255|min:5',
            'address' => 'string|max:255',
            'distributor_id' => 'required|string|exists:distributors,distributor_id',
            'product_quantity' => "required|numeric",            
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
            //create new warehouse
            $input['warehouse_id'] = 'WAR'.Carbon::now()->format('dmyhis');
            $warehouse = Warehouse::create($input);
            
            //save activity
            $user = Auth::guard('api')->user();
            $newRequest = (new RequestController)->makeActivityRequest(
                'Warehouse Created',
                'Warehouse',
                'The user '. $user->username . (new RequestController)->makeActivityContent("Warehouse Created") . $warehouse->warehouse_name .'.',
                $user->account_id,
                $user->username);               
            $result = (new ActivityHistoryResourceController)->store($newRequest);
            
            //return json message
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new warehouse successfully",
                'data' => new WarehouseResource($warehouse),
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
    public function show(Warehouse $warehouse)
    {
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Warehouse has been found",
            'data' => new WarehouseResource($warehouse),
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $input = $request->all();
        $validator = Validator::make($input,[
            'warehouse_name' => 'string|max:255|min:5',
            'address' => 'string|max:255',
            'distributor_id' => 'string|exists:distributors,distributor_id',
            'product_quantity' => "unique:distributors,phone_number|digits:10|numeric",
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
            $update = $warehouse->update($request->all());
            if($update){
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Warehouse Updated',
                    'Warehouse',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Warehouse Updated",$request) . $warehouse->warehouse_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);
                
                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated Warehouse successful",                  
                    'data' => new WarehouseResource($warehouse),
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
                    'message' => "Update Warehouse Failed",                   
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {   
        //check products.warehouse_id are holding warehouses
        //

        //delete: update status -> 0
        $delete = DB::table('warehouses')->where('warehouse_id', $warehouse->warehouse_id)->update(['status'  => 0]);      
        if($delete == 1){
            //save activity
            $user = Auth::guard('api')->user();
            $newRequest = (new RequestController)->makeActivityRequest(
                'Warehouse Created',
                'Warehouse',
                'The user '. $user->username . (new RequestController)->makeActivityContent("Warehouse Created") . $warehouse->warehouse_name .'.',
                $user->account_id,
                $user->username);               
            $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message
            $arr = [
                'success' => true,
                'status_code' => 204,
                'message' => "Warehouse has been deleted",
                'data' => "Success!",
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
                'message' => "Failed",
                'data' => "Deleted Warehouse Failed!",
            ];
            return response()->json($arr, Response::HTTP_OK);    
        }       
    }
}
