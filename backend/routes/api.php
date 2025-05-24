<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\UserController;

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
});


