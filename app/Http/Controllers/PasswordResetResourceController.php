<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PasswordResetResource;
use Illuminate\Auth\Notifications\ResetPassword;

class PasswordResetResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reset = PasswordReset::all();        
        $arr = [
            'success' => true,
            'status_code' => 200,
            'message' => "List of system roles",
            'data' => PasswordResetResource::collection($reset)
        ];
        return response()->json($arr,Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $reset = PasswordReset::create($input);
        return $reset;
    }

}
