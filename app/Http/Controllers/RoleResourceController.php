<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\DB;

class RoleResourceController extends Controller
{
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
        return response()->json($arr,200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        
        
        $validator = Validator::make($input,[
            'role_name' => 'required'
        ]);
        if($validator->fails()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Role name cannot be empty",
                'data' => $validator->errors()
            ];
            return response()->json($arr, 200);
        }else{
            $input['role_id'] = 'R'.Carbon::now()->format('d.m.y.h.i.s');
                        $role = Role::create($input);
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new roles successfully",
                'data' => new RoleResource($role),
            ];
            return response()->json($arr, 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {       
        //$role = DB::select('SELECT * FROM ROLES WHERE ROLE_ID = ?',[$id]);
        $role = DB::table('roles')->where('role_id',$id)->get();
        if($role->isEmpty()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Role with code ".$id." not found.",
                'data' => null,
                
            ];
            return response()->json($arr, 200);
        }else{
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Role has been found",
                'data' => $role,
            ];
            return response()->json($arr, 200);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $input = $request -> all();      
        $check_id = DB::table('roles')->where('role_id', $id)->get();            
        if($check_id->isEmpty()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Role with code ".$id." not found.",
                'data' => null,
            ];
            return response()->json($arr, 200);
        }else{
            $update_at = Carbon::now('Asia/Ho_Chi_Minh')->format('y-m-d h:i:s');                               
            $role = DB::update("UPDATE ROLES SET ROLE_NAME = '{$input['role_name']}' , DESCRIPTION ='{$input['description']}' , UPDATED_AT = '$update_at'  WHERE ROLE_ID = ?",[$id]);          
            $role = DB::select('SELECT * FROM ROLES WHERE ROLE_ID = ?',[$id]);
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Update successful",
                'data' => $role,
            ];
            return response()->json($arr, 200);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {            
        $check_id = DB::table('roles')->where('role_id', $id)->get();   
        if($check_id->isEmpty()){
            $arr = [
                'success' => false,
                'status_code' => 200,
                'message' => "Role with code ".$id." not found.",
                'data' => null,
            ];
            return response()->json($arr, 200);
        }else{          
            $role = DB::delete('DELETE FROM ROLES WHERE ROLE_ID = ?', [$id]);
            $arr = [
                'success' => true,
                'status_code' => 200,
                'message' => "Deleted successful",
                'data' => 'success',
            ];
            return response()->json($arr, 200);
        }
    }
}
