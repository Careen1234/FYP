<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ServiceCategory;
class CategoryController extends Controller
{
    public function index()
    {
        // Fetch all categories
        $categories = ServiceCategory::all();

        // Return JSON response
         return response()->json($categories);
}
}