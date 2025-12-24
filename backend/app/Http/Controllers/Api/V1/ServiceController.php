<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('category')->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('service_category_id', $request->category_id);
        }

        $services = $query->get();

        return response()->json([
            'services' => $services,
        ]);
    }

    public function show(Service $service)
    {
        $service->load('category');

        return response()->json([
            'service' => $service,
        ]);
    }

    public function categories()
    {
        $categories = ServiceCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->withCount('services')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
