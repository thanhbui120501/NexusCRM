<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

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
    public function index(Request $request)
    {
        $limit = $request->query('limit', 100000);
        $offset = $request->query('offset', 0);
        $role = Role::where('status', 1)->offset($offset)->limit($limit)->get();

        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system roles",
            'data' => RoleResource::collection($role)
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
            'role_name' => 'required|string|max:50|min:5',
            'description' => 'string|max:255',
            'role_another_name' => 'string|max:100',
            'role_level' => 'integer'
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
            //create new role
            $input['role_id'] = 'R' . Carbon::now()->format('dmyhis');
            $role = Role::create($input);

            //save activity
            $user = Auth::guard('api')->user();
            $newRequest = (new RequestController)->makeActivityRequest(
                'Role Created',
                'Role',
                'The user ' . $user->username . (new RequestController)->makeActivityContent("Role Created") . $role->role_name . '.',
                $user->account_id,
                $user->username
            );
            $result = (new ActivityHistoryResourceController)->store($newRequest);

            //return json message
            $arr = [
                'success' => true,
                'status_code' => 201,
                'message' => "Creating new roles successfully",
                'data' => new RoleResource($role),
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
    public function show(Role $role)
    {
        $arr = [
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
    public function update(Role $role, Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'role_name' => 'required|string|max:50|min:5',
            'description' => 'string|max:255',
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
            $update = $role->update($request->all());
            if ($update) {
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Role Updated',
                    'Role',
                    'The user ' . $user->username . (new RequestController)->makeActivityContent("Role Updated", $request) . $role->role_name . '.',
                    $user->account_id,
                    $user->username
                );
                $result = (new ActivityHistoryResourceController)->store($newRequest);

                //return json message
                $arr = [
                    'success' => true,
                    'status_code' => 200,
                    'message' => "Updated successful",
                    'data' => new RoleResource($role),
                    'activity' => [
                        'activity_name' => $result->activity_name,
                        'activity_type' => $result->activity_type,
                        'activity_content' => $result->activity_content,
                        'activity_time' => $result->created_at,
                    ],
                ];
                return response()->json($arr, Response::HTTP_OK);
            } else {
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
    public function destroy(Role $role)
    {
        $check_id = DB::table('accounts')->where('role_id', $role->role_id)->get();
        if ($check_id->isEmpty()) {
            $delete = $role->delete();
            if ($delete) {
                //save activity
                $user = Auth::guard('api')->user();
                $newRequest = (new RequestController)->makeActivityRequest(
                    'Role Deleted',
                    'Role',
                    'The user ' . $user->username . (new RequestController)->makeActivityContent("Role Deleted") . $role->role_name . '.',
                    $user->account_id,
                    $user->username
                );
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
            } else {
                $arr = [
                    'success' => false,
                    'status_code' => 200,
                    'message' => "Deleted Failed",
                    'data' => 'Failed!',
                ];
                return response()->json($arr, Response::HTTP_OK);
            }
        } else {
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
