<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
use App\Http\Controllers\Api\ProviderController;

Route::prefix('providers')->group(function () {
    Route::get('/', [ProviderController::class, 'index']); // GET /api/providers
    Route::post('/', [ProviderController::class, 'store']); // POST /api/providers
    Route::get('{id}', [ProviderController::class, 'show']); // GET /api/providers/{id}
    Route::put('{id}', [ProviderController::class, 'update']); // PUT /api/providers/{id}
    Route::delete('{id}', [ProviderController::class, 'destroy']); // DELETE /api/providers/{id}

    Route::post('{id}/approve', [ProviderController::class, 'approve']); // POST /api/providers/{id}/approve
    Route::post('{id}/block', [ProviderController::class, 'block']); // POST /api/providers/{id}/block
});
