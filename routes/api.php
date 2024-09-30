<?php

use App\Http\Controllers\AccountResourceController;
use App\Http\Controllers\ActivityHistoryResourceController;
use App\Http\Controllers\RoleResourceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerResourceController;
use App\Http\Controllers\DistributorResourceController;
use App\Http\Controllers\LoginHistoryResourceController;
use App\Http\Controllers\WarehouseResourceController;
use App\Http\Controllers\PasswordResetResourceController;
use App\Http\Controllers\PromotionTypeResourceController;
use App\Http\Controllers\PromotionResourceController;
use App\Http\Controllers\SearchResourceController;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'v1'], function () {
    //account login route
    Route::post('/account/login', [AuthController::class, 'login'])->middleware(HandleCors::class)->name('api.auth.login');
    //['auth:sanctum'] middleware routes
    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::group(['middleware' => ['admin_only_allowed']], function () {
            //Role routes
            Route::controller(RoleResourceController::class)->group(function () {
                Route::get('/role/get-all-role', 'index')->name('api.role.index'); //get all role
                Route::post('/role/create-new-role', 'store')->name('api.role.store'); //create new role
                Route::get('/role/get-detail-role/{role}', 'show')->name('api.role.show'); //show role detail
                Route::patch('/role/update-role/{role}', 'update')->name('api.role.update'); //update role by id
                Route::delete('/role/delete-role/{role}', 'destroy')->name('api.role.update'); //delete role
            });
            //Account routes
            Route::controller(AccountResourceController::class)->group(function () {
                Route::get('/account/get-all-account', 'index')->name('api.account.index'); //get account role
                Route::post('/account/create-new-account', 'store')->name('api.account.store'); //create account role
                Route::get('/account/get-detail-account/{account}', 'show')->name('api.account.show'); //show account detail
                Route::post('/account/update-account/{account}', 'update')->name('api.account.update'); //update account by id
                Route::post('/account/delete-account', 'destroy')->name('api.account.delete'); //delete account by id
                Route::patch('/account/reset-password/{account}', 'resetPassword')->name('api.account.reset.password'); //reset account password
                Route::get('account/get-username-email-phone', 'getUsernamePhoneAndPhone')->name('api.get.username.email.phonenumber'); //get list username, phonenumber and email
                Route::get('account/get-username-email-phone-except/{account}', 'getUsernamePhoneAndPhoneExcept')->name('api.get.username.email.phonenumber.except'); //get list username, phonenumber and email except account
            });
            //Activity History
            Route::controller(ActivityHistoryResourceController::class)->group(function () {
                Route::get('/activity/get-all-activity/{account}', 'index')->name('api.activity.index');
                Route::get('/activity/get-detail-activity/{activityHistory}', 'show')->name('api.activity.show'); //get all activity history
                Route::post('/activity/get-activity-by-type', 'getActivityHistoryByType')->name('api.activity.getActivityHistoryByType');
                Route::delete('/activity/delete-activity/{activityHistory}', 'destroy')->name('api.activity.delete'); //delete activity
            });
            //Login, Logout History
            Route::controller(LoginHistoryResourceController::class)->group(function () {
                Route::post('/login-history/get-all-history', 'index')->name('api.login.history.index'); //get all login and logout history
                Route::post('/login-history/get-login-or-logout-history', 'showHistoryLoginOrLogout')->name('api.login.history.showHistoryLoginOrLogout'); //get login or logout history
                Route::get('/login-history/get-detail-history/{loginHistory}', 'show')->name('api.login.history.show'); //show detail history
                Route::delete('/login-history/delete-history/{loginHistory}', 'destroy')->name('api.login.history.destroy'); //delete history
            });
            Route::controller(PasswordResetResourceController::class)->group(function () {
                Route::post('/password-reset/get-all-password-reset', 'index')->name('api.password.reset.index'); //get all password reset  
            });
            Route::controller(SearchResourceController::class)->group(function () {
                Route::get('account/account-fillter', 'accountFillter')->name('api.account.fillter');
                Route::get('account/get-list-admin', 'getAccountsWithCreatedUsers')->name('api.account.get.list.admin');
                Route::get('account/search-by-keyword', 'searchUserByKeyWord')->name('api.account.search.by.keyword');
            });
        });


        //Auth logout
        Route::controller(AuthController::class)->group(function () {
            Route::post('/account/logout', 'logout')->name('api.auth.logout');
        });

        //Distrbutor routes
        Route::controller(DistributorResourceController::class)->group(function () {
            Route::post('/distributor/get-all-distributor', 'index')->name('api.distributor.index'); //get all distributor
            Route::post('/distributor/create-new-distributor', 'store')->name('api.distributor.store'); //create new distributor
            Route::get('/distributor/get-detail-distributor/{distributor}', 'show')->name('api.distributor.show'); //show distributor detail
            Route::patch('/distributor/update-distributor/{distributor}', 'update')->name('api.distributor.update'); //update distributor by id
            Route::delete('/distributor/delete-distributor/{distributor}', 'destroy')->name('api.distributor.update'); //delete distributor by id
        });
        //Warehouse routes
        Route::controller(WarehouseResourceController::class)->group(function () {
            Route::post('/warehouse/get-all-warehouse', 'index')->name('api.warehouse.index'); //get all warehouse
            Route::post('/warehouse/create-new-warehouse', 'store')->name('api.warehouse.store'); //create new warehouse
            Route::get('/warehouse/get-detail-warehouse/{warehouse}', 'show')->name('api.warehouse.show'); //show warehouse detail
            Route::patch('/warehouse/update-warehouse/{warehouse}', 'update')->name('api.warehouse.update'); //update warehouse by id
            Route::delete('/warehouse/delete-warehouse/{warehouse}', 'destroy')->name('api.warehouse.update'); //delete warehouse by id
        });

        //Customer routes
        Route::controller(CustomerResourceController::class)->group(function () {
            Route::post('/customer/create-new-customer', 'store')->name('api.customer.store'); //create new customer  
            Route::post('/customer/get-list-customer', 'index')->name('api.customer.get.list.customer'); // get list customer by status
            Route::get('/customer/get-customer-by-id/{customer}', 'show')->name('api.customer.get.customer.by.id'); // get customer by id
            Route::patch('/customer/update-customer/{customer}', 'update')->name('api.customer.update.customer'); // update customer by id
            Route::delete('/customer/delete-customer/{customer}', 'destroy')->name('api.customer.delete.customer'); // delete customer by id
        });

        //Promotion Type routes
        Route::controller(PromotionTypeResourceController::class)->group(function () {
            Route::post('/promotion-type/get-all-promotion-type', 'index')->name('api.promotion.type.index'); // show all promotion type
            Route::post('/promotion-type/create-new-promotion-type', 'store')->name('api.promotion.type.store'); // create new promotion type 
            Route::get('/promotion-type/get-promotion-type-by-id/{promotionType}', 'show')->name('api.promotion.type.show'); // get promotion type by id
            Route::patch('/promotion-type/update-promotion-type/{promotionType}', 'update')->name('api.promotion.type.update'); // update promotion type by id
            Route::delete('/promotion-type/delete-promotion-type/{promotionType}', 'destroy')->name('api.promotion.type.delete'); // delete promotion type by id
        });

        //Promotion routes
        Route::controller(PromotionResourceController::class)->group(function () {
            Route::post('/promotion/get-all-promotion', 'index')->name('api.promotion.index'); // show all promotion 
            Route::post('/promotion/create-new-promotion', 'store')->name('api.promotion.store'); // create new promotion  
            Route::get('/promotion/get-promotion-by-id/{promotion}', 'show')->name('api.promotion.show'); // get promotion by id
            Route::patch('/promotion/update-promotion/{promotion}', 'update')->name('api.promotion.update'); // update promotion by id
            Route::delete('/promotion/delete-promotion/{promotion}', 'destroy')->name('api.promotion.delete'); // delete promotion by id
        });
    });
});
