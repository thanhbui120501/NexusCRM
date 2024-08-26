<?php

use App\Http\Controllers\AccountResourceController;
use App\Http\Controllers\RoleResourceController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

////Roles
Route::get('/role/get-all-role',[RoleResourceController::class, 'index'])->name('api.role.index'); //get all role
Route::post('/role/create-new-role',[RoleResourceController::class, 'store'])->name('api.role.store'); //create new role
Route::get('/role/get-detail-role/{role}',[RoleResourceController::class, 'show'])->name('api.role.show'); //show role detail
Route::patch('/role/update-role/{role}',[RoleResourceController::class, 'update'])->name('api.role.update'); //update role by id
Route::delete('/role/delete-role/{role}',[RoleResourceController::class, 'destroy'])->name('api.role.update'); //delete role by id

////Accounts
Route::get('/account/get-all-account',[AccountResourceController::class, 'index'])->name('api.account.index'); //get account role
Route::post('/account/create-new-account',[AccountResourceController::class, 'store'])->name('api.account.store'); //create account role
Route::get('/account/get-detail-account/{account}',[AccountResourceController::class, 'show'])->name('api.account.show'); //show account detail
Route::patch('/account/update-account/{account}',[AccountResourceController::class, 'update'])->name('api.account.update'); //update account by id
Route::delete('/account/delete-account/{account}',[AccountResourceController::class, 'deupdatestroy'])->name('api.account.update'); //delete account by id

////Authentication
//Route::post('/account/test',[AuthController::class, 'test']);
Route::post('/account/login',[AuthController::class, 'login'])->name('api.auth.login'); //account login
//Route::get('/account/logout',[AuthController::class, 'logout'])->name('api.auth.logout');  //account logout