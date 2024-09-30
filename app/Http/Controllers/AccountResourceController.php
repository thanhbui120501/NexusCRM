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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        $account = Account::where('deleted_status', 0)->where('account_id', '!=', $request->user()->account_id)->offset($offset)->limit($limit)->orderBy('created_at', 'desc')->get();
        $count = Account::where('deleted_status', 0)->where('account_id', '!=', $request->user()->account_id)->count();

        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system account",
            'data' => AccountResource::collection($account),
            'totalRecords' => $count
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        //The password contains characters from at least three of the following five categories:          
        // 1. English uppercase characters (A – Z)
        // 2. English lowercase characters (a – z)
        // 3. Base 10 digits (0 – 9)
        // 4. Non-alphanumeric (For example: !, $, #, or %)
        // 5. Unicode characters
        $input = $request->all();
        $validator = Validator::make($input, [
            'username' => 'required|string|min:5|max:20|unique:accounts,username',
            'password' => 'required|min:6|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#%!@]).{6,14}$/',
            'password_confirm' => 'required|min:6|same:password|',
            'role_id' => 'required|string|exists:roles,role_id',
            'phone_number' => 'required|string|regex:/^0[0-9]{9}$/|unique:accounts,phone_number',
            'email' => 'required|email|unique:accounts,email|string|max:255|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/|email:rfc,dns',
            'full_name' => 'required|string|max:40|regex:/^(?=.*[a-zA-Z])(?!.*\d).{3,100}$/',
            'date_of_birth' => 'required|string',
            'images' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);
        //check vailidate
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            //create account id, hash password
            $input['account_id'] = 'AC' . Carbon::now()->format('dmyhis');
            $input['password'] = Hash::make($input['password']);

            //create avatar
            if ($request->has('images')) {
                $image = $request->file('images');
                //set filename
                $fileName = Str::random(32) . "." . $image->getClientOriginalExtension();

                $image->move('uploads/', $fileName);

                //set image file
                $input['image_name'] = $fileName;
            }

            $account = Account::create($input);
            
            //save activity
            $user = $request->user();

            $newRequest = (new RequestController())->makeActivityRequest(
                'Account Created',
                'Account',
                (new RequestController)->getActivityContent("Account Created", $request, null,$account->username),
                $user->account_id,
                $user->username
            );
            
            $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message           
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new account successfully",
                'data' => new AccountResource($account),
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
        //validate
        $input = $request->all();
        $validator = Validator::make($input, [
            'password' => 'min:6|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#%!@]).{6,14}$/',
            'password_confirm' => 'min:6|same:password|',
            'role_id' => 'string|exists:roles,role_id',
            'phone_number' => 'string|regex:/^0[0-9]{9}$/|unique:accounts,phone_number,' . $account->account_id . ',account_id',
            'email' => 'email|unique:accounts,email,' . $account->account_id . ',account_id|string|max:255|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/|email:rfc,dns',
            'full_name' => 'string|max:40|regex:/^(?=.*[a-zA-Z])(?!.*\d).{3,100}$/',
            'date_of_birth' => 'string',
            'images' => 'image|mimes:jpeg,png,jpg,svg|max:2048',
            'status' => 'string'
        ]);
        //check validate
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 400,
                'message' => "Updated Account Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            $user = $request->user();
            //check change data
            $updateData = [];
            //hash password
            if ($request->has('password')) {
                $updateData['password'] = Hash::make($input['password']);
            }
            //upload image
            if ($request->has('images')) {
                $image = $request->file('images');
                //set filename
                $fileName = Str::random(32) . "." . $image->getClientOriginalExtension();

                $image->move('uploads/', $fileName);

                //set image file
                $updateData['image_name'] = $fileName;
            }
            if (isset($input['full_name']) && $input['full_name'] !== $account->full_name) {
                $updateData['full_name'] = $input['full_name'];
            }
            if (isset($input['date_of_birth']) && $input['date_of_birth'] !== $account->full_name) {
                $updateData['date_of_birth'] = $input['date_of_birth'];
            }
            if (isset($input['role_id']) && $input['role_id'] !== $account->role_id) {
                $updateData['role_id'] = $input['role_id'];
            }
            if (isset($input['email']) && $input['email'] !== $account->email) {
                $updateData['email'] = $input['email'];
            }
            if (isset($input['phone_number']) && $input['phone_number'] !== $account->phone_number) {
                $updateData['phone_number'] = $input['phone_number'];
            }
            if (isset($input['status'])) {
                $status = $input['status'] === 'true' ? 1 : 0;
                
                if ($status !== $account->status) {
                    $updateData['status'] = $status;
                }
            }
            //update user   

            if (!empty($updateData)) {                
                $update = $account->update($updateData);
                if ($update) {
                    //save activity
                    $newRequest = (new RequestController)->makeActivityRequest(
                        'Account Updated',
                        'Account',
                        (new RequestController)->getActivityContent("Account Updated",$request ,$updateData, $account->username),
                        $user->account_id,
                        $user->username
                    );
                    $result = (new ActivityHistoryResourceController)->store($newRequest);                    
                    //return json message
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
                } else {
                    //failed message
                    $arr = [
                        'success' => false,
                        'status_code' => 400,
                        'message' => "Updated Account Failed",
                        'data' => 'Failed!'
                    ];
                    return response()->json($arr, Response::HTTP_OK);
                }
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 204,
                    'message' => "No changes detected",
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_NO_CONTENT);
            }
        }
    }
    //Reset password function
    public function resetPassword(Request $request, Account $account)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input, [
            'password' => 'required|min:6|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
            'password_confirm' => 'required|same:password|',
        ]);
        //check validate
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            //check old and new password are same?  
            if (!Hash::check($request->password, $account->password)) {
                //update new password
                $requestInput = new Request([
                    'password' => Hash::make($input['password'])
                ]);
                $currentPassword = $account->password;
                $currentUser = $account->account_id;
                $update = $account->update($requestInput->all());
                //check update
                if ($update) {
                    //save old password
                    $request = new Request([
                        'reset_id' => 'RES' . Carbon::now()->format('dmyhis'),
                        'account_id' => $currentUser,
                        'token' => $currentPassword,
                    ]);
                    $result = (new PasswordResetResourceController)->store($request);

                    //save activity
                    $user = $request->user();
                    $newRequest = (new RequestController())->makeActivityRequest(
                        'Account Reset Password',
                        'Account',
                        'The user ' . $user->username . (new RequestController)->makeActivityContent("Account Reset Password", $request) . $account->username . '.',
                        $user->account_id,
                        $user->username
                    );
                    $result = (new ActivityHistoryResourceController)->store($newRequest);

                    //return json message
                    $arr = [
                        'success' => true,
                        'status_code' => 201,
                        'message' => "Update password successfully",
                        'data' => new AccountResource($account),
                        'activity' => [
                            'activity_name' => $result->activity_name,
                            'activity_type' => $result->activity_type,
                            'activity_content' => $result->activity_content,
                            'activity_time' => $result->created_at,
                        ],
                    ];
                    return response()->json($arr, Response::HTTP_CREATED);
                } else {
                    $arr = [
                        'success' => false,
                        'status_code' => 200,
                        'message' => "Updated Account Failed",
                        'data' => 'Failed!'
                    ];
                    return response()->json($arr, Response::HTTP_OK);
                }
            } else {
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
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'users' => 'required|array',
        ]);
        //delete: update status -> 0        
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        }
        $users = $request->input('users');
        $userRequest = $request->user();

        foreach ($users as $user) {
            $delete =  DB::table('accounts')->where('account_id', $user)->update(['deleted_status' => true]);

            //save acctivity
            $account = Account::where('account_id', $user)->first();

            $newRequest = (new RequestController)->makeActivityRequest(
                'Account Deleted',
                'Account',
                (new RequestController)->getActivityContent("Account Deleted", $request, null ,$account->username),
                $userRequest->account_id,
                $userRequest->username
            );
            $result = (new ActivityHistoryResourceController)->store($newRequest);                // Thực hiện các xử lý cần thiết
        }

        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Account has been deleted",
            'data' => "Success!",
            'activity' => [
                'activity_name' => $result->activity_name,
                'activity_type' => $result->activity_type,
                'activity_content' => $result->activity_content,
                'activity_time' => $result->created_at,
            ],
        ];
        return response()->json($arr, Response::HTTP_NO_CONTENT);
    }
    public function getUsernamePhoneAndPhone(Request $request)
    {
        $username = Account::select('username')->get();
        $email = Account::select('email')->get();
        $phoneNumber = Account::select('phone_number')->get();
        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Success",
            'usernames' => $username,
            'emails' => $email,
            'phone_numbers' => $phoneNumber

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    public function getUsernamePhoneAndPhoneExcept(Account $account)
    {
        $account_id = $account->account_id;
        $username = Account::select('username')->where('account_id', '!=', $account_id)->get();
        $email = Account::select('email')->where('account_id', '!=', $account_id)->get();
        $phoneNumber = Account::select('phone_number')->where('account_id', '!=', $account_id)->get();
        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Success",
            'usernames' => $username,
            'emails' => $email,
            'phone_numbers' => $phoneNumber

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
}
