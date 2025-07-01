<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;


class ServiceController extends Controller
{
public function index(Request $request)
{
    $query = Service::query()
        ->join('service_category', 'services.category_id', '=', 'service_category.id')
        ->select(
            'services.*',
            'service_category.name as category_name'
        )
        ->withCount('bookings');

    if ($search = $request->input('search')) {
        $query->where(function ($q) use ($search) {
            $q->where('services.name', 'like', "%{$search}%")
              ->orWhere('service_category.name', 'like', "%{$search}%");
        });
    }

    if ($categoryName = $request->input('category')) {
        $query->where('service_category.name', $categoryName);
    }

    return $query->paginate(10);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
           // 'price' => 'required|numeric',
            'category_id' => 'required|exists:service_category,id',
           // 'status' => 'boolean',
        ]);

        Service::create($validated);

        return response()->json(['message' => 'Service created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
           // 'price' => 'sometimes|numeric',
            'category_id' => 'sometimes|exists:service_categories,id',
            //'status' => 'boolean',
        ]);

        $service->update($validated);

        return response()->json(['message' => 'Service updated successfully']);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }


 public function register(): JsonResponse
    {
        $services = Service::select('id', 'name')->get();

        return response()->json([
            'services' => $services,
        ]);
    }



public function getServicesByCategory(Request $request)
{
    $categoryName = $request->query('category');

    if (!$categoryName) {
        return response()->json(['error' => 'Missing category'], 400);
    }

    $category = ServiceCategory::where('category', $categoryName)->first();

    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    $services = Service::where('service_category_id', $category->id)->get();

    return response()->json($services);
}






}

