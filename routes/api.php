<?php

use App\Http\Controllers\AccountResourceController;
use App\Http\Controllers\RoleResourceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DistributorResourceController;
use App\Http\Controllers\WarehouseResourceController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

//account login route
Route::post('/account/login',[AuthController::class,'login'])->name('api.auth.login');
//['auth:sanctum'] middleware routes
Route::group(['middleware' => ['auth:sanctum']] ,function () {
    //Role routes
    Route::controller(RoleResourceController::class)-> group( function() {
        Route::get('/role/get-all-role','index')-> name('api.role.index'); //get all role
        Route::post('/role/create-new-role','store')-> name('api.role.store'); //create new role
        Route::get('/role/get-detail-role/{role}','show')->name('api.role.show'); //show role detail
        Route::patch('/role/update-role/{role}','update')->name('api.role.update'); //update role by id
        Route::delete('/role/delete-role/{role}','destroy')->name('api.role.update'); //delete role
    });
    //Auth routes
    Route::controller(AuthController::class)->group(function(){        
        Route::get('/account/logout','logout')->name('api.auth.logout');
    });
    //Account routes
    Route::controller(AccountResourceController::class)->group(function(){        
        Route::get('/account/get-all-account','index')->name('api.account.index'); //get account role
        Route::post('/account/create-new-account','store')->name('api.account.store'); //create account role
        Route::get('/account/get-detail-account/{account}','show')->name('api.account.show'); //show account detail
        Route::patch('/account/update-account/{account}','update')->name('api.account.update'); //update account by id
        Route::delete('/account/delete-account/{account}','destroy')->name('api.account.delete'); //delete account by id
    });
    //Distrbutor routes
    Route::controller(DistributorResourceController::class)->group( function(){        
        Route::get('/distributor/get-all-distributor','index')->name('api.distributor.index'); //get all distributor
        Route::post('/distributor/create-new-distributor','store')->name('api.distributor.store'); //create new distributor
        Route::get('/distributor/get-detail-distributor/{distributor}','show')->name('api.distributor.show'); //show distributor detail
        Route::patch('/distributor/update-distributor/{distributor}','update')->name('api.distributor.update'); //update distributor by id
        Route::delete('/distributor/delete-distributor/{distributor}','destroy')->name('api.distributor.update'); //delete distributor by id
    });
    //Warehouse routes
    Route::controller(WarehouseResourceController::class)->group(function(){                
        Route::get('/warehouse/get-all-warehouse','index')->name('api.warehouse.index'); //get all warehouse
        Route::post('/warehouse/create-new-warehouse','store')->name('api.warehouse.store'); //create new warehouse
        Route::get('/warehouse/get-detail-warehouse/{warehouse}','show')->name('api.warehouse.show'); //show warehouse detail
        Route::patch('/warehouse/update-warehouse/{warehouse}','update')->name('api.warehouse.update'); //update warehouse by id
        Route::delete('/warehouse/delete-warehouse/{warehouse}','destroy')->name('api.warehouse.update'); //delete warehouse by id
    });
});







