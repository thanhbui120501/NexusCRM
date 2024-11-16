<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Http\Resources\PromotionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class PromotionResourceController extends Controller
{
    //set promotion status
    public $promotion_status = array('Active','Upcoming','Expired');

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        $promotions = Promotion::offset($offset)->limit($limit)->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of promotion",
            'data' => PromotionResource::collection($promotions)
        ];
        return response()->json($arr,Response::HTTP_OK);
        // $input = $request->all();
        // $validator = Validator::make($input,[           
        //     'offset' => 'min:0|numeric',
        //     'limit' => 'min:1|numeric',
        //     'status' 
        // ]);
        // if($validator->fails()){
        //     $arr = [
        //         'success' => false,
        //         'status_code' => 200,
        //         'message' => "Failed",
        //         'data' => $validator->errors()
        //     ];
        //     return response()->json($arr, Response::HTTP_OK);
        // }else{
        //     //check status is right?
        //     if($request->has('status') && !in_array($request->status,$this->promotion_status)){
        //         $arr = [
        //             'success' => false,
        //             'status_code' => 200,
        //             'message' => "Failed",
        //             'data' => "Invalid state, state includes ('Active','Upcoming','Expired')"
        //         ];
        //         return response()->json($arr, Response::HTTP_OK);
        //     }else{
        //         //set offset and limit
        //         $offset = !$request->has('limit')  ? 0 : $request->offset;
        //         $limit = !$request->has('limit') ? 50 : $request->limit;
                
        //         //select customer
        //         $promotion = $request->has('status')  ? 
        //             DB::table('promotions')->where('status', $request->status)->offset($offset)->limit($limit)->get() :
        //             DB::table('promotions')->offset($offset)->limit($limit)->get();

        //         //return json message      
        //         $arr = [
        //             'success' => true,
        //             'status_code' => 200,
        //             'message' => "List of promotion",
        //             'data' => PromotionResource::collection($promotion)
        //         ];
        //         return response()->json($arr,Response::HTTP_OK);
        //     }
        // }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input,[
            'promotion_name' => 'required|string|max:100|min:5',      
            'description' => 'string|max:255|min:5',
            'type' => 'required|string|max:255|min:5',
            'start_date' => 'string',
            'end_date' => 'string',
            'condition' => 'string',
            'amount' => 'required|integer|min:50000',
            'percentage' => 'required|integer|min:10',
            'maximum_limit' => 'required|integer|min:100000',
            'promotion_type_id' => 'required|string|exists:promotion_types,promotion_type_id',                     
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
            $input['promotion_id'] = 'PRO'.Carbon::now()->format('dmyhis');

            //get promotion status
            $input['status'] = $this->promotion_status[1];

            //create promotion
            $promotion = Promotion::create($input);

            // //save activity
            // $user = $request->user();           
            // $newRequest = (new RequestController)->makeActivityRequest(
            //     'Promotion Created',
            //     'Promotion',
            //     'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Created") . $promotion->promotion_name .'.',
            //     $user->account_id,
            //     $user->username);               
            // $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new promotion successfully",
                'data' => new PromotionResource($promotion),
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
    public function show(Promotion $promotion)
    {
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Promotion has been found",
            'data' => (new PromotionResource($promotion))
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promotion $promotion)
    {
        //validate
        $input = $request -> all();             
        $validator = Validator::make($input,[
            'promotion_name' => 'string|max:100|min:5',      
            'description' => 'string|max:255|min:5',
            'type' => 'string|max:255|min:5',
            'start_date' => 'string',
            'end_date' => 'string',
            'condition' => 'string',
            'amount' => 'integer|min:50000',
            'percentage' => 'integer|min:10',
            'maximum_limit' => 'integer|min:100000',
            'promotion_type_id' => 'string|exists:promotion_types,promotion_type_id',
            'status' => 'string'            
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
            
            //check satus
            if($request->has('status') && !in_array($request->status,$this->promotion_status)){
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid promotion status, status includes ('Active','Upcoming','Expired')"
                ];                
                return response()->json($arr, Response::HTTP_OK);
            }

            $update = $promotion->update($request->all());
            if($update){
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Promotion Updated',
                    'Promotion',
                    'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Updated", $request) . $promotion->promotion_name .'.',
                    $user->account_id,
                    $user->username);               
                $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",                  
                    'data' => new PromotionResource($promotion),
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
    public function destroy(Promotion $promotion)
    {
        //check products.promotion are holding promotion
        //

        //delete: update status -> expired
        $delete = DB::table('promotions')->where('promotion_id', $promotion->promotion_id)->update(['status'  => $this->promotion_status[2]]);      
        if($delete == 1){
            //save activity
            $user = Auth::guard('api')->user();
            $newRequest = (new RequestController)->makeActivityRequest(
                'Promotion Deleted',
                'Promotion',
                'The user '. $user->username . (new RequestController)->makeActivityContent("Promotion Deleted") . $promotion->promotion_name .'.',
                $user->account_id,
                $user->username);               
            $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message
            $arr = [
                'success' => true,
                'status_code' => 204,
                'message' => "Promotion has been deleted",
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
                'data' => "Deleted Promotion Failed!",
            ];
            return response()->json($arr, Response::HTTP_OK);    
        }
    }
}
