<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class AdminServiceCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = ServiceCategory::withCount('services')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:service_categories'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $validated['sort_order'] = $validated['sort_order'] ?? ServiceCategory::max('sort_order') + 1;

        $category = ServiceCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function show(ServiceCategory $serviceCategory)
    {
        return response()->json([
            'data' => $serviceCategory->loadCount('services'),
        ]);
    }

    public function update(Request $request, ServiceCategory $serviceCategory)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:service_categories,name,' . $serviceCategory->id],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $serviceCategory->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $serviceCategory,
        ]);
    }

    public function destroy(ServiceCategory $serviceCategory)
    {
        if ($serviceCategory->services()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with existing services. Remove or reassign services first.',
            ], 422);
        }

        $serviceCategory->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*.id' => ['required', 'exists:service_categories,id'],
            'order.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($request->order as $item) {
            ServiceCategory::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Categories reordered successfully.',
        ]);
    }
}
