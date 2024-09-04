<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\ActivityHistoryResourceController;
use Illuminate\Support\Facades\Auth;

class AccountResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */   
    public function index()
    {
        $account = Account::all();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system account",
            'data' => AccountResource::collection($account)
        ];
        return response()->json($arr,Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //The password contains characters from at least three of the following five categories:          
        // 1. English uppercase characters (A – Z)
        // 2. English lowercase characters (a – z)
        // 3. Base 10 digits (0 – 9)
        // 4. Non-alphanumeric (For example: !, $, #, or %)
        // 5. Unicode characters
        $input = $request->all();
        $validator = Validator::make($input,[
            'username' => 'required|string|min:5|max:20|unique:accounts,username',
            'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
            'password_confirm' => 'required|min:6|same:password|',
            'role_id' => 'required|string|exists:roles,role_id',
            'phone_number' => 'unique:accounts,phone_number|digits:10|numeric',
            'email' => 'email|unique:accounts,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'full_name' => 'required|string|max:40|regex:/^.*(?=.{3,})(?=.*[a-zA-Z]).*$/',           
            'date_of_birth' => 'date',
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
            $input['account_id'] = 'AC'.Carbon::now()->format('dmyhis');
            $input['password'] = Hash::make($input['password']);            
            $account = Account::create($input);
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new account successfully",
                'data' => new AccountResource($account),
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {      
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Account has been found",
            'data' => new AccountResource($account),
            ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        
        $input = $request->all();
        $validator = Validator::make($input,[                       
            'role_id' => 'string|exists:roles,role_id',
            'phone_number' => 'unique:accounts,phone_number|digits:10|numeric',
            'email' => 'email|unique:accounts,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'full_name' => 'string|max:40|regex:/^.*(?=.{3,})(?=.*[a-zA-Z]).*$/',           
            'date_of_birth' => 'date',           
        ]);

        if( $validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Updated Account Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }else{           
            $update = $account->update($input);
            $user = Auth::guard('api')->user();                                                              
            if($update){
                $request = new Request([
                    'activity_id' => 'AH'.Carbon::now()->format('dmyhis'),
                    'activity_name' => 'Account Updated',
                    'activity_type' => 'Account',
                    'activity_content' => 'The user '. $user->username . ' has just updated new information for user ' . $account->username .'.',
                    'account_id' => $user->account_id,
                    'username' => $user->username,
                ]);
                $result = (new ActivityHistoryResourceController)->store($request);
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",                   
                    'data' => new AccountResource($account),
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
                    'message' => "Updated Account Failed",                  
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }
    }
    public function resetPassword(Request $request, Account $account){
        $input = $request->all();
        $validator = Validator::make($input,[           
            'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
            'password_confirm' => 'required|same:password|',          
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
            if(!Hash::check($request->password, $account->password)) {
                $requestInput = new Request([
                    'password' => Hash::make($input['password'])
                ]);               
                $currentPassword = $account->password;    
                $currentUser = $account->account_id;                     
                $update = $account->update($requestInput->all());
                
                if($update){
                    $request = new Request([
                        'reset_id' => 'RES'.Carbon::now()->format('dmyhis'),
                        'account_id' => $currentUser,
                        'token' => $currentPassword,                   
                    ]);
                    $result = (new PasswordResetResourceController())->store($request);
                    $arr = [
                        'success' => true,
                        'status_code' => 201,
                        'message' => "Update password successfully",
                        'data' => new AccountResource($account),
                    ];
                    return response()->json($arr, Response::HTTP_CREATED);
                }else{
                    $arr = [
                        'success' => false,
                        'status_code' => 200,
                        'message' => "Updated Account Failed",                  
                        'data' => 'Failed!'
                    ];
                    return response()->json($arr, Response::HTTP_OK);
                }
            }
            else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Reset Password Failed",                  
                    'data' => 'The new password cannot be the same as the old password.'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }                   
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {   
        $delete =  $account->delete();      
            if($delete){
                $arr = [
                    'success' => true,
                    'status_code' => 204,
                    'message' => "Account has been deleted",
                    'data' => "Success!",
                ];
                return response()->json($arr, Response::HTTP_NO_CONTENT);    
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Deleted Failed!",
                ];
                return response()->json($arr, Response::HTTP_OK);    
            }           
    }
    
    
    
}
