<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('category');

        if ($request->has('category_id')) {
            $query->where('service_category_id', $request->category_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $services = $query->orderBy('name')->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $services->items(),
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'service_category_id' => ['required', 'exists:service_categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'is_active' => ['boolean'],
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service created successfully.',
            'data' => $service->load('category'),
        ], 201);
    }

    public function show(Service $service)
    {
        return response()->json([
            'data' => $service->load('category'),
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'service_category_id' => ['sometimes', 'exists:service_categories,id'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'duration_minutes' => ['sometimes', 'integer', 'min:15'],
            'is_active' => ['boolean'],
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service updated successfully.',
            'data' => $service->load('category'),
        ]);
    }

    public function destroy(Service $service)
    {
        if ($service->bookings()->exists()) {
            return response()->json([
                'message' => 'Cannot delete service with existing bookings. Consider deactivating instead.',
            ], 422);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully.',
        ]);
    }

    public function toggleActive(Service $service)
    {
        $service->is_active = !$service->is_active;
        $service->save();

        return response()->json([
            'message' => $service->is_active ? 'Service activated.' : 'Service deactivated.',
            'data' => $service,
        ]);
    }
}
