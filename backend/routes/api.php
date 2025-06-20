<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\CategoryController; 
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RatingsController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ✅ Public Auth Routes
Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register'])->middleware('guest');

// ✅ Logout and "me" - must be protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// ✅ CSRF route (optional – usually handled automatically)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

// ✅ Providers
Route::prefix('providers')->group(function () {
    Route::get('/providers', [ProviderController::class, 'listProviders']);
    Route::get('/', [ProviderController::class, 'index']);
    Route::post('/', [ProviderController::class, 'store']);
    Route::get('{id}', [ProviderController::class, 'show']);
    Route::put('{id}', [ProviderController::class, 'update']);
    Route::delete('{id}', [ProviderController::class, 'destroy']);
    Route::post('{id}/approve', [ProviderController::class, 'approve']);
    Route::put('{id}/reject', [ProviderController::class, 'reject']);
    Route::put('{id}/block-toggle', [ProviderController::class, 'toggleBlock']);
});

// ✅ Users
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('{id}', [UserController::class, 'show']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'destroy']);
    Route::put('{id}/block-toggle', [UserController::class, 'toggleBlock']);
});

// ✅ Services
Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::post('/', [ServiceController::class, 'store']);
    Route::get('{id}', [ServiceController::class, 'show']);
    Route::put('{id}', [ServiceController::class, 'update']);
    Route::delete('{id}', [ServiceController::class, 'destroy']);
});

// ✅ Categories
Route::get('/service-categories', [CategoryController::class, 'index']);

// ✅ Bookings
Route::prefix('bookings')->group(function () {
    Route::post('/providers/match', [BookingController::class, 'getAvailableProviders']);
    Route::get('/', [BookingController::class, 'index']);
    Route::post('/', [BookingController::class, 'store']);
    Route::get('/user', [BookingController::class, 'userBookings']);
    Route::get('{id}', [BookingController::class, 'show']);
    Route::put('{id}', [BookingController::class, 'update']);
    Route::delete('{id}', [BookingController::class, 'destroy']);
});

// ✅ Dashboard Stats
Route::get('/users/count', [DashboardController::class, 'usersCount']);
Route::get('/providers/count', [DashboardController::class, 'providersCount']);
Route::get('/bookings/count', [DashboardController::class, 'bookingsCount']);
Route::get('/activity/latest', [DashboardController::class, 'latestActivity']);

// ✅ Ratings
Route::get('/ratings', [RatingsController::class, 'index']);

Route::put('/profile', [UserController::class, 'updateCurrentUserProfile']);
   