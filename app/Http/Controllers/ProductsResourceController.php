<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Product_Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ProductsResourceController extends Controller
{
    //set product status
    public $product_status = array('Active', 'Discontineu', 'Inactive');
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        $promotions = Product::where('deleted_status',0)->offset($offset)->limit($limit)->get();
        $count = Product::where('deleted_status',0)->count();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of products",
            'data' => ProductResource::collection($promotions),
            'totalRecords' => $count,
        ];
        return response()->json($arr,Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'product_name' => 'required|string|max:255|min:5',
            'product_quantity' => 'required|numeric',
            'description' => 'string|max:255',
            'selling_price' => 'required|numeric',
            'list_price' => 'numeric',
            'import_price' => 'numeric',
            'promotion_id' => 'required|exists:promotions,promotion_id',
            'unit_of_measure' => 'string|max:30',
            'weight' => 'required|string|max:10',
            'product_images' => 'required|numeric',
            'product_catalog' => 'string|max:255',
            'inventory' => 'required|numeric|max:11',
            'warehouse_id' => 'required|exists:warehouses,warehouse_id',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,svg|max:2048'
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
            
            //create new warehouse
            $input['product_id'] = 'PDT' . Carbon::now()->format('dmyhis');
            //set status
            $input['status'] = $this->product_status[0];

            $product = Product::create($input);

            //upload image
            if ($request->has('images')) {
                $images = $request->file('images');

                foreach ($images as $image) {
                    $fileName = Str::random(32) . "." . $image->getClientOriginalExtension();

                    $image->move('product_image/', $fileName);

                    Product_Image::create([
                        'image_name' => $fileName,
                        'product_id' => $input['product_id'],
                        'product_name' => $fileName,
                    ]);
                }
            }
            //return json message                  
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new product successfully",
                'data' => new ProductResource($product),
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array',
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
        $products = $request->input('products');
        //$userRequest = $request->user();

        foreach ($products as $product) {            
            $delete = Product::where('product_id', $product)->update(['deleted_status' => true]);
            //save acctivity
            // $account = Account::where('account_id', $user)->first();

            // $newRequest = (new RequestController)->makeActivityRequest(
            //     'Account Deleted',
            //     'Account',
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
            // 'activity' => [
            //     'activity_name' => $result->activity_name,
            //     'activity_type' => $result->activity_type,
            //     'activity_content' => $result->activity_content,
            //     'activity_time' => $result->created_at,
            // ],
        ];
        return response()->json($arr, Response::HTTP_NO_CONTENT);
    }
}
