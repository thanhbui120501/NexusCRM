<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AddressResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required|string'
        ]);
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }

        $address = Address::where('customer_id', $request->customer_id)
            ->where('deleted_status', 0)
            ->get();

        //json arr
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of address customer",
            'data' => AddressResource::collection($address),
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required|string',
            'address_line' => 'required|string',
            'province' => 'required|string',
            'town' => 'required|string',
            'ward' => 'required|string',
            'country' => 'required|string',
        ]);
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            //check address count 
            $addressCount = Address::where('customer_id', $request->customer_id)->count();
            if ($addressCount >= 10) {
                $arr = [
                    'success' => false,
                    'status_code' => 422,
                    'message' => "Failed",
                    'data' => 'This customer has 10 address. Can not create new.'
                ];
                return response()->json($arr, Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $input['customer_id'] = $request->customer_id;
            $address = Address::create($input);
            //dd($address);
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new account successfully",
                'data' => new AddressResource($address),
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Address $address)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Address $address)
    {
        
    }
    public function setDefaultAddress(Address $address)
    {
        
        $setNormalAddress = Address::where('is_default_address', 1)->update(['is_default_address' => 0]);
        $setDefault = Address::where("address_id", $address->address_id)->update(['is_default_address' => 1]);
        $add = Address::where("address_id", $address->address_id)->first();
        if ($setDefault) {
            //json arr
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Update Succesfully",
                'data' => new AddressResource($add),
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{
            //json arr
            $arr = [
                'success' => true,
                'status_code' => 422,
                'message' => "Update Failed",
                'data' => "Failed",
            ];
            return response()->json($arr, Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Address $address)
    {
        
    }
}
