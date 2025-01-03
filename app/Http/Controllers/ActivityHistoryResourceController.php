<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityHistoryResource;
use App\Http\Controllers\AccountResourceController;
use App\Models\ActivityHistory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\FuncCall;
use App\Models\Account;

class ActivityHistoryResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Account $account)
    {  
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        $activity = ActivityHistory::where('status', 1)->where('account_id', $account->account_id)->offset($offset)->limit($limit)->orderBy('created_at', 'desc')->get();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of acctivity history",
            'data' => ActivityHistoryResource::collection($activity)
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
            'activity_name' => 'required|string|max:50|min:5',
            'activity_type' => 'required|string|max:100',
            'activity_content' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,account_id',
            'username' => 'required|string|min:5|max:20'
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
            $input['activity_id'] = 'AH'.Carbon::now()->format('dmyhis').substr(Carbon::now()->format('u'), 0, 3);;            
            $activity = ActivityHistory::create($input);           
            return $activity;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityHistory $activityHistory)
    {       
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Activity history has been found",
            'data' => new ActivityHistoryResource($activityHistory),
            ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function getActivityHistoryByType(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input,[
            'activity_type' => 'required|string|max:100',          
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
            $activity = DB::table('activity_history')->where('activity_type',$request->activity_type)->get();
            if($activity->isEmpty()){
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "No result for type ".$request->activity_type,
                    'data' => 'Failed'
                ];  
            }else{
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "List of acctivity history by type ".$request->activity_type,
                    'data' => ActivityHistoryResource::collection($activity)
                ];  
            }
                     
            return response()->json($arr,Response::HTTP_OK);           
        }
        
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityHistory $activityHistory)
    {       
        //delete: update -> 0
        $delete = DB::table('activity_history')->where('activity_id',$activityHistory->activity_id)->update(['status' => 0]);
        
        //check update
        if($delete == 1){
            $arr = [
                'success' => true,
                'status_code' => 204,
                'message' => "Activity has been deleted",
                'data' => "Success!",
            ];
            return response()->json($arr, Response::HTTP_NO_CONTENT);    
        }else{
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => "Deleted Activity Failed!",
            ];
            return response()->json($arr, Response::HTTP_OK);    
        }    
    }
}
