<?php

namespace App\Http\Controllers;

use App\Http\Resources\WarehouseResource;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class WarehouseResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $warehouse = Warehouse::all();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of warehouse",
            'data' => WarehouseResource::collection($warehouse)
        ];
        return response()->json($arr,Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input,[
            'warehouse_name' => 'required|string|max:255|min:5',
            'address' => 'string|max:255',
            'distributor_id' => 'required|string|exists:distributors,distributor_id',
            'product_quantity' => "required|numeric",            
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
            $input['warehouse_id'] = 'WAR'.Carbon::now()->format('dmyhis');
            $distributor = Warehouse::create($input);
            dd($distributor);
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new warehouse successfully",
                'data' => new WarehouseResource($distributor),
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
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated Warehouse successful",                  
                    'data' => new WarehouseResource($warehouse)
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
        $delete =  $warehouse->delete();      
            if($delete){
                $arr = [
                    'success' => true,
                    'status_code' => 204,
                    'message' => "Warehouse has been deleted",
                    'data' => "Success!",
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
