<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceBay;
use Illuminate\Http\Request;

class AdminServiceBayController extends Controller
{
    public function index()
    {
        $bays = ServiceBay::withCount(['bookings' => function ($query) {
            $query->whereDate('date', '>=', now()->toDateString());
        }])->get();

        return response()->json([
            'data' => $bays,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:service_bays'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $bay = ServiceBay::create($validated);

        return response()->json([
            'message' => 'Service bay created successfully.',
            'data' => $bay,
        ], 201);
    }

    public function show(ServiceBay $serviceBay)
    {
        $serviceBay->loadCount(['bookings' => function ($query) {
            $query->whereDate('date', '>=', now()->toDateString());
        }]);

        return response()->json([
            'data' => $serviceBay,
        ]);
    }

    public function update(Request $request, ServiceBay $serviceBay)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', 'unique:service_bays,name,' . $serviceBay->id],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $serviceBay->update($validated);

        return response()->json([
            'message' => 'Service bay updated successfully.',
            'data' => $serviceBay,
        ]);
    }

    public function destroy(ServiceBay $serviceBay)
    {
        if ($serviceBay->bookings()->whereDate('date', '>=', now()->toDateString())->exists()) {
            return response()->json([
                'message' => 'Cannot delete service bay with upcoming bookings. Consider deactivating instead.',
            ], 422);
        }

        $serviceBay->delete();

        return response()->json([
            'message' => 'Service bay deleted successfully.',
        ]);
    }

    public function schedule(Request $request, ServiceBay $serviceBay)
    {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $bookings = $serviceBay->bookings()
            ->with(['user', 'vehicle', 'services'])
            ->whereDate('date', $request->date)
            ->orderBy('time')
            ->get();

        return response()->json([
            'data' => $bookings,
        ]);
    }
}
