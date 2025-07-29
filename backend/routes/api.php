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
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ClickPesaController;
use App\Http\Controllers\Api\ProviderAuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Api\ProviderDashboardController;
use App\Http\Controllers\Api\ProviderReportController;
use App\Http\Controllers\Api\UserReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});


Route::middleware('auth:sanctum')->get('/provider/dashboard', [ProviderDashboardController::class, 'index']);
Route::middleware(['auth:sanctum'])->get('/admin/dashboard', [DashboardController::class, 'index']);
Route::middleware('auth:sanctum')->get('/provider/reports', [ProviderReportController::class, 'myReport']);

Route::middleware('auth:sanctum')->get('/user/reports', [UserReportController::class, 'Report']);




// ✅ Providers
Route::prefix('providers')->group(function () {
    Route::get('/providers', [ProviderController::class, 'listProviders']);
    Route::get('/', [ProviderController::class, 'index']);
    Route::post('/', [ProviderController::class, 'store']);
    Route::get('/profile', [ProviderController::class, 'getProfile'])->middleware('auth:sanctum');
    Route::patch('/profile', [ProviderController::class, 'updateProfile'])->middleware('auth:sanctum');
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

// ✅ Services
Route::prefix('services')->group(function () {
    Route::get('/', [ServiceController::class, 'index']);
    Route::post('/', [ServiceController::class, 'store']);
    Route::get('{id}', [ServiceController::class, 'show']);
    Route::put('{id}', [ServiceController::class, 'update']);
    Route::delete('{id}', [ServiceController::class, 'destroy']);
});

// Categories
Route::get('/service-categories', [CategoryController::class, 'index']);


Route::middleware('auth:sanctum')->prefix('bookings')->group(function () {
   Route::get('/providers/match', [BookingController::class, 'getAvailableProviders']);
    Route::post('/book', [BookingController::class, 'book']);
    Route::get('/', [BookingController::class, 'index']);
    Route::post('/', [BookingController::class, 'store']);
    Route::get('/user', [BookingController::class, 'userBookings']);
    Route::get('{id}', [BookingController::class, 'show']);
    Route::put('{id}', [BookingController::class, 'update']);
    Route::delete('{id}', [BookingController::class, 'destroy']);
    Route::patch('{id}/status', [BookingController::class, 'updateStatus']);
});

  

//  Dashboard Stats
Route::get('/users/count', [DashboardController::class, 'usersCount']);
Route::get('/providers/count', [DashboardController::class, 'providersCount']);
Route::get('/bookings/count', [DashboardController::class, 'bookingsCount']);
Route::get('/activity/latest', [DashboardController::class, 'latestActivity']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/ratings', [RatingsController::class, 'index']);
Route::get('/provider/reviews', [RatingsController::class, 'providerReviews']);
});

Route::put('/profile', [UserController::class, 'updateCurrentUserProfile'])->middleware('auth:sanctum');
Route::get('/profile', [UserController::class, 'getProfile'])->middleware('auth:sanctum');
   



Route::get('/service', [ServiceController::class, 'getServicesByCategory']);
Route::get('/service/register', [ServiceController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings/book', [BookingController::class, 'book']);
    Route::get('/providers/match', [BookingController::class, 'getAvailableProviders']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/provider/bookings', [ProviderController::class, 'getProviderBookings']);
    //Route::post('/provider/bookings/{id}/accept', [ProviderController::class, 'acceptBooking']);
   // Route::post('/provider/bookings/{id}/reject', [ProviderController::class, 'rejectBooking']);
    //Route::post('/provider/bookings/{id}/complete', [ProviderController::class, 'completeBooking']);
});


Route::get('/clickpesa/token', [PaymentController::class, 'getToken']);
Route::post('/clickpesa', [PaymentController::class, 'initiateClickPesaUssdPush']);






