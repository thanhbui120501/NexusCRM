<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Account;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CustomerResource;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Address;

class CustomerResourceController extends Controller
{
    //display customer class
    private $customer_class = array('Diamond', 'Gold', 'Silver', 'Bronze', 'None');

    //display customer group
    private $customer_group = array('Personal', 'Business', 'Potential', 'Another');

    //display customer source
    private $customer_source = array('Self_contact', 'Introduced', 'Registration_form', 'Facebook');

    //display customer status
    private $customer_status = array('Active', 'Locked', 'Expired', 'Closed');

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // //get customer by status
        // //validate
        // $input = $request->all();
        // $validator = Validator::make($input,[           
        //     'offset' => 'min:0|numeric',
        //     'limit' => 'min:1|numeric',
        //     'status' => 'string'
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
        //     if($request->has('status') && !in_array($request->status,$this->customer_status)){
        //         $arr = [
        //             'success' => false,
        //             'status_code' => 200,
        //             'message' => "Failed",
        //             'data' => "Invalid state, state includes ('Active','Locked','Expired','Closed')"
        //         ];
        //         return response()->json($arr, Response::HTTP_OK);
        //     }else{
        //         //set offset and limit
        //         $offset = !$request->has('limit')  ? 0 : $request->offset;
        //         $limit = !$request->has('limit') ? 50 : $request->limit;

        //         //select customer
        //         $customer = $request->has('status')  ? 
        //             DB::table('customers')->where('status', $request->status)->offset($offset)->limit($limit)->get() :
        //             DB::table('customers')->offset($offset)->limit($limit)->get();

        //          //return json message      
        //         $arr = [
        //             'success' => true,
        //             'status_code' => 200,
        //             'message' => "List of customer",
        //             'data' => CustomerResource::collection($customer)
        //         ];
        //         return response()->json($arr,Response::HTTP_OK);
        //     }
        // }
        //set last month         
        //$lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        //limit and offset
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        //get account not deleted
        $customers = Customer::where('deleted_status', 0)->offset($offset)->limit($limit)->orderBy('created_at', 'desc')->get();
        //count all account without limit and offset 
        $count = Customer::where('deleted_status', 0)->count();
        // //get account this month
        // $account_this_month = Customer::whereYear('created_at', Carbon::now()->year)
        //     ->whereMonth('created_at', Carbon::now()->month)
        //     ->count();
        // //get all disable account
        // $acount_disable = Customer::whereYear('created_at', Carbon::now()->year)->whereMonth('created_at', Carbon::now()->month)->where('status', 0)->count();
        // //get all account last month
        // $account_last_month = Customer::where('created_at', '<=', $lastMonthEnd)->count();
        // //get disable account last month
        // $disable_last_month = Customer::where('created_at', '<=', $lastMonthEnd)->where('status', 0)->count();
        //json arr
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system customers",
            'data' =>   CustomerResource::collection($customers),
            'totalRecords' => $count,
            // 'account_this_month' => $account_this_month,
            // 'total_disable_account' => $acount_disable,
            // 'account_lastmonth' => $account_last_month,
            // 'disable_account_lastmonth' => $disable_last_month
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input, [
            'phone_number' => 'required|unique:customers,phone_number|digits:10|numeric',
            'email' => 'required|email|unique:customers,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'full_name' => 'required|string|max:40|regex:/^.*(?=.{3,})(?=.*[a-zA-Z]).*$/',
            'gender' => 'required|integer|digits_between:0,1',
            'date_of_birth' => 'required|string',
            // 'province' => 'string|max:50|min:5',
            // 'town' => 'string|max:50|min:5',
            // 'ward' => 'string|max:50|min:5',
            // 'address' => 'string|max:255|min:5',
            // 'customer_class' => 'required|string|max:50',
            'customer_group' => 'required|string|max:50',
            'customer_source' => 'required|string|max:50',
            'images' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
            'addresses' => 'array',
            'addresses.*.province' => 'string|max:255',
            'addresses.*.district' => 'string|max:255',
            'addresses.*.ward' => 'string|max:255',
            'addresses.*.is_default_address' => 'string',
            'addresses.*.address_line' => 'string|max:255',
        ]);

        //checking validate
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            //get account id
            $user = $request->user();
            $input['account_id'] = $user->account_id;
            //get customer id
            $input['customer_id'] = 'CUS' . Carbon::now()->format('dmyhis');
            $input['customer_class'] = "None";
            //create avatar
            if ($request->has('images')) {
                $image = $request->file('images');
                //set filename
                $fileName = Str::random(32) . "." . $image->getClientOriginalExtension();

                $image->move('uploads/', $fileName);

                //set image file
                $input['image_name'] = $fileName;
            }
            //get customer status
            $input['status'] = $this->customer_status[0];

            //checking validate           

            if (!$this->validateCustomerGroup($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid customer group, group includes ('Personal','Business','Potential','Another')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }

            if (!$this->validateCustomerSource($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid customer source, source includes ('Self_contact','Introduced','Registration_form','Facebook')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
            //create new customer
            $customer = Customer::create($input);

            //check list address
            if ($request->has('addresses')) {

                //create address
                foreach ($request->input('addresses') as $addressData) {
                    Address::create([
                        'customer_id' => $customer->customer_id,
                        'province' => $addressData['province'],
                        'ward' => $addressData['ward'],
                        'town' => $addressData['town'],
                        'is_default_address' => $addressData['is_default_address'],
                        'address_line' => $addressData['address_line'],
                    ]);
                }
            }

            // //save activity            
            // $newRequest = (new RequestController())->makeActivityRequest(
            //     'Customer Created',
            //     'Customer',
            //     (new RequestController)->getActivityContent("Account Created", $request, null, $customer->full_name),
            //     $user->account_id,
            //     $user->username);               
            // $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message                  
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new customer successfully",
                'data' => new CustomerResource($customer),
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }
    //get customer address
    public function getCustomerAddress(Request $request)
    {
        $address = "";
        if ($request->has('address')) {
            $address .= $request->address . ", ";
        }
        if ($request->has('ward')) {
            $address .= $request->ward . ", ";
        }
        if ($request->has('town')) {
            $address .= $request->town . ", ";
        }
        if ($request->has('province')) {
            $address .= $request->province . ".";
        }

        return $address;
    }
    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "Customer has been found",
            'data' => new CustomerResource($customer),
        ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        //validate
        $input = $request->all();
        $validator = Validator::make($input, [
            'phone_number' => 'unique:customers,phone_number|digits:10|numeric',
            'email' => 'email|unique:customers,email|string|max:255|regex:/(.+)@(.+)\.(.+)/i|email:rfc,dns',
            'full_name' => 'string|max:40|regex:/^.*(?=.{3,})(?=.*[a-zA-Z]).*$/',
            'gender' => 'integer|digits_between:0,1',
            'date_of_birth' => 'string',
            'province' => 'string|max:50|min:5',
            'town' => 'string|max:50|min:5',
            'ward' => 'string|max:50|min:5',
            'address' => 'string|max:255|min:5',
            'customer_class' => 'string|max:50',
            'customer_group' => 'string|max:50',
            'customer_source' => 'string|max:50',
            'status' => 'string|max:50'
        ]);
        //checking validate
        if ($validator->fails()) {
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Updated Customer Failed",
                'data' => $validator->errors()
            ];
            return response()->json($arr, Response::HTTP_OK);
        } else {
            //checking validate
            if (!$this->validateCustomerClass($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid customer class, class includes ('Diamond','Gold','Silver','Bronze','None')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            };

            if (!$this->validateCustomerGroup($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid customer group, group includes ('Personal','Business','Potential','Another')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }

            if (!$this->validateCustomerSource($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid customer source, source includes ('Self_contact','Introduced','Registration_form','Facebook')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            }

            if (!$this->validateStatus($request)) {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Failed",
                    'data' => "Invalid state, state includes ('Active','Locked','Expired','Closed')"
                ];
                return response()->json($arr, Response::HTTP_OK);
            };

            //get account id
            $user = $request->user();

            //get address           
            $input['address'] = $this->getCustomerAddress($request);

            //create new customer
            $update = $customer->update($input);

            //checking update
            if ($update) {
                // //save activity
                // $newRequest = (new RequestController)->makeActivityRequest(
                //     'Customer Updated',
                //     'Customer',
                //     'The user '. $user->username . (new RequestController)->makeActivityContent("Customer Updated",$request) . $customer->full_name .'.',
                //     $user->account_id,
                //     $user->username);               
                // $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",
                    'data' => new CustomerResource($customer),
                ];
                return response()->json($arr, Response::HTTP_OK);
            } else {
                //failed message
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Updated Customer Failed",
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        }
    }

    //validate customer status
    public function validateStatus(Request $request)
    {
        //validate status
        if ($request->has('status') && !in_array($request->status, $this->customer_status)) {
            return false;
        }
        return true;
    }

    //validate customer class
    public function validateCustomerClass(Request $request)
    {

        //validate 
        if ($request->has('customer_class') && in_array($request->customer_class, $this->customer_class) == false) {
            return false;
        }
        return true;
    }

    //validate customer class
    public function validateCustomerGroup(Request $request)
    {
        //validate
        if ($request->has('customer_group') && !in_array($request->customer_group, $this->customer_group)) {
            return false;
        }
        return true;
    }

    //validate customer class
    public function validateCustomerSource(Request $request)
    {
        //validate
        if ($request->has('customer_source') && !in_array($request->customer_source, $this->customer_source)) {
            return false;
        }
        return true;
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customers' => 'required|array',
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
        $customers = $request->input('customers');
        $userRequest = $request->user();

        foreach ($customers as $customer) {
            $delete =  DB::table('customers')->where('customer_id', $customer)->update(['deleted_status' => true]);

            //save acctivity
            //$account = Account::where('account_id', $userRequest->account_id)->first();

            // $newRequest = (new RequestController)->makeActivityRequest(
            //     'Customer Deleted',
            //     'Customer',
            //     (new RequestController)->getActivityContent("Account Deleted", $request, null, $account->username),
            //     $userRequest->account_id,
            //     $userRequest->username
            // );
            // $result = (new ActivityHistoryResourceController)->store($newRequest);                // Thực hiện các xử lý cần thiết
        }

        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Account has been deleted",
            'data' => "Success!",
        ];
        return response()->json($arr, Response::HTTP_NO_CONTENT);
    }
    public function getListPhoneAndEmail(Customer $customer)
    {
        $customer_id = $customer->customer_id;
        $email = Customer::select('email')->where('customer_id', '!=', $customer_id)->get();
        $phoneNumber = Customer::select('phone_number')->where('customer_id', '!=', $customer_id)->get();
        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Success",
            'emails' => $email,
            'phone_numbers' => $phoneNumber

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
    public function getAllPhoneAndEmail()
    {

        $email = Customer::select('email')->get();
        $phoneNumber = Customer::select('phone_number')->get();
        //return json message
        $arr = [
            'success' => true,
            'status_code' => 204,
            'message' => "Success",
            'emails' => $email,
            'phone_numbers' => $phoneNumber

        ];
        return response()->json($arr, Response::HTTP_OK);
    }
}
