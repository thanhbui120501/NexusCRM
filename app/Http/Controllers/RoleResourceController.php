<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class RoleResourceController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return Role[]|\Illuminate\Database\Eloquent\Collection
     */
    /**
     * 
    * @OA\Info(
 *      version="1.0.0",
 *      title="L5 OpenApi",
 *      description="L5 Swagger OpenApi description"
 * )
 * @OA\Get(
 *    path = "/role"
 *    summary="Role Data",
 *    description="Role Page",
 *    tags={"Role"},
 *    
 *   @OA\Response(
 *     response = 200,
 *     description="OK",
 *     @OA\MediaType(
 *       mediaType={"application/json"},
 *     )
 *   ),
 * @OA\PathItem (
     *     ),
 * ),
 * 
 */
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $role = Role::all();
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system roles",
            'data' => RoleResource::collection($role)
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
            'role_name' => 'required|string|max:50|min:5',
            'description' => 'string|max:255',
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
            $input['role_id'] = 'R'.Carbon::now()->format('d.m.y.h.i.s');
                        $role = Role::create($input);
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new roles successfully",
                'data' => new RoleResource($role),
            ];
            return response()->json($arr, Response::HTTP_CREATED);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {                       
             
        $arr =  [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Role has been found",
                    'data' => (new RoleResource($role))
                ];
        return response()->json($arr, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Role $role, Request $request )
    {
        $input = $request -> all();             
        $validator = Validator::make($input,[
            'role_name' => 'required|string|max:50|min:5',
            'description' => 'string|max:255',
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
            $update = $role->update($request->all());
            if($update){
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",                  
                    'data' => 'Success!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }else{
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Update Failed",
                    //'data' => $role->update($request->all()),
                    'data' => 'Failed!'
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
            
        }

        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {                          
        $check_id = DB::table('accounts')->where('role_id', $role->role_id)->get();
        if($check_id->isEmpty()){
            $delete = $role->delete();
            if($delete){
                $arr = [
                            'success' => true,
                            'status_code' => 204,
                            'message' => "Deleted successful",
                            'data' => 'Success!',
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
                'data' => "This role cannot be deleted because an account is already holding this role.",
            ];
            return response()->json($arr, Response::HTTP_OK);
        }
        
    }
}
