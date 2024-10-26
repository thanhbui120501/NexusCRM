<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProvincesResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $province = Province::orderBy('code')->get();
        return response()->json($province, Response::HTTP_OK);
    }

}
