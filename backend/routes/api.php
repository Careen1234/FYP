<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\AuthController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('providers')->group(function () {
    Route::get('/', [ProviderController::class, 'index']); 
    Route::post('/', [ProviderController::class, 'store']); 
    Route::get('{id}', [ProviderController::class, 'show']); 
    Route::put('{id}', [ProviderController::class, 'update']); 
    Route::delete('{id}', [ProviderController::class, 'destroy']); 

   Route::post('{id}/approve', [ProviderController::class, 'approve']);
   Route::put('{id}/reject', [ProviderController::class, 'reject']);
    Route::put('{id}/block-toggle', [ProviderController::class, 'toggleBlock']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']); 
    Route::post('/', [UserController::class, 'store']); 
    Route::get('{id}', [UserController::class, 'show']); 
    Route::put('{id}', [UserController::class, 'update']); 
    Route::delete('{id}', [UserController::class, 'destroy']); 
    Route::put('{id}/block-toggle', [UserController::class, 'toggleBlock']);
});

Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::post('/', [ServiceController::class, 'store']);
    Route::get('{id}', [ServiceController::class, 'show']);
    Route::put('{id}', [ServiceController::class, 'update']);
    Route::delete('{id}', [ServiceController::class, 'destroy']);
});

Route::get('/service-categories', [CategoryController::class, 'index']);

Route::prefix('bookings')->group(function () {
    Route::get('/', [BookingController::class, 'index']);
    Route::post('/', [BookingController::class, 'store']);
    Route::get('{id}', [BookingController::class, 'show']);
    Route::put('{id}', [BookingController::class, 'update']);
    Route::delete('{id}', [BookingController::class, 'destroy']);
});




    Route::get('/users/count', [DashboardController::class, 'usersCount']);
    Route::get('/providers/count', [DashboardController::class, 'providersCount']);
    Route::get('/bookings/count', [DashboardController::class, 'bookingsCount']);
    Route::get('/activity/latest', [DashboardController::class, 'latestActivity']);

   
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);





