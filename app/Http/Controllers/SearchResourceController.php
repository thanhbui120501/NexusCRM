<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Resources\AccountResource;
use Illuminate\Http\Response;

class SearchResourceController extends Controller
{
    public function accountFillter(Request $request)
    {
        $user = $request->user();
        $limit = $request->query('limit', 10000);
        $offset = $request->query('offset', 0);
        $date = $request->query('date');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $created_by = $request->query('created_by');
        $query = Account::where('account_id', '!=', $user->account_id);
        
        //check by created_by
        if($request->has('created_by')){
            $query->where('created_by', $created_by);
        }

        //check by date
        if ($request->has('date')) {
            $date = Carbon::createFromFormat('d/m/Y', $date)->format('Y-m-d');
            $query->where('created_at', '>=', $date . ' 00:00:00')->where('created_at', '<=', $date . ' 23:59:59');            
        }

        //check by range date
        if ($request->has('start_date') && $request->has('end_date')) {
            $start_date = Carbon::createFromFormat('d/m/Y', $start_date)->format('Y-m-d');
            $end_date = Carbon::createFromFormat('d/m/Y', $end_date)->format('Y-m-d');
            $query->where('created_at', '>=', $start_date . ' 00:00:00')->where('created_at', '<=', $end_date . ' 23:59:59');            
        }
        
        $result = $query->limit($limit)->offset($offset)->get();
        $count = $query->count();
        
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of account",
            'data' => AccountResource::collection($result),
            'totalRecords' => $count
        ];
        return response()->json($arr, Response::HTTP_OK);
    }
}
