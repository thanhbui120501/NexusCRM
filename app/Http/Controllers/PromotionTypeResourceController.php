<?php

namespace App\Http\Controllers;

use App\Http\Resources\PromotionTypeResource;
use App\Models\PromotionType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PromotionTypeResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {        
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);

        $promotion_types = PromotionType::where('status',1)->offset($offset)->limit($limit)->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of promotion type",
            'data' => PromotionTypeResource::collection($promotion_types)
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
            'promotion_type_name' => 'required|string|max:255|min:5',            
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
            //create new promotion type
            $input['promotion_type_id'] = 'PRT'.Carbon::now()->format('dmyhis');
            $promotion_type = PromotionType::create($input);
            
            //save activity
            // $user = $request->user();
            
            // $newRequest = (new RequestController)->makeActivityRequest(
            //     'Promotion Type Created',
            //     'Promotion Type',
            //     'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Type Created") . $promotion_type->promotion_type_name .'.',
            //     $user->account_id,
            //     $user->username);               
            // $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new promotion type successfully",
                'data' => new PromotionTypeResource($promotion_type),
                // 'activity' => [
                //     'activity_name' => $result->activity_name,
                //     'activity_type' => $result->activity_type,
                //     'activity_content' => $result->activity_content,
                //     'activity_time' => $result->created_at,    
                // ],
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PromotionType $promotionType)
    {
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Promotion type has been found",
            'data' => (new PromotionTypeResource($promotionType))
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PromotionType $promotionType)
    {
        //validate
        $input = $request -> all();             
        $validator = Validator::make($input,[
            'promotion_type_name' => 'string|max:255|min:5',
            
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
            
            
            $update = $promotionType->update($request->all());
            if($update){

                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Promotion Type Updated',
                    'Promotion Type',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Type Updated", $request) . $promotionType->promotion_type_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",                  
                    'data' => new PromotionTypeResource($promotionType),
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
                    'message' => "Update Failed",                   
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
            
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PromotionType $promotionType)
    {
        //delete: update status -> 0
        $check_id = DB::table('promotions')->where('promotion_type_id', $promotionType->promotion_type_id)->get();
        
        //check promotion_type_id in promotions table
        if($check_id->isEmpty()){
            //update status
            $delete = DB::table('promotion_types')->where('promotion_type_id', $promotionType->promotion_type_id)->update(['status'  => 0]); 
            
            //check update done
            if($delete == 1){
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Promotion Type Deleted',
                    'Promotion Type',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Type Deleted") . $promotionType->promotion_type_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 204,
                    'message' => "Deleted successful",
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
                    'message' => "Deleted Failed",
                    'data' => 'Failed!',
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }else{
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Deleted Failed",
                'data' => "This promotion type cannot be deleted because an promotion is already holding this type.",
            ];
            return response()->json($arr, Response::HTTP_OK);
        }
    }
}
