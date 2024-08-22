<?php

use App\Http\Controllers\RoleResourceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

////Roles
Route::get('/role/get-all-role',[RoleResourceController::class, 'index'])->name('api.role.index');//get all role
Route::post('/role/create-new-role',[RoleResourceController::class, 'store'])->name('api.role.store');//create new role
Route::get('/role/get-detail-role/{id}',[RoleResourceController::class, 'show'])->name('api.role.show');//show role detail
Route::patch('/role/update-role/{id}',[RoleResourceController::class, 'update'])->name('api.role.update');//update role by id
Route::delete('/role/delete-role/{id}',[RoleResourceController::class, 'destroy'])->name('api.role.update');