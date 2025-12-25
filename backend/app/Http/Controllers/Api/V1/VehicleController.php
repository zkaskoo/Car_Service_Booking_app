<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = $request->user()->vehicles;

        return response()->json([
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'make' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'license_plate' => ['required', 'string', 'max:20', 'unique:vehicles,license_plate'],
            'vin' => ['nullable', 'string', 'max:17'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $vehicle = $request->user()->vehicles()->create($validated);

        return response()->json([
            'message' => 'Vehicle added successfully.',
            'vehicle' => $vehicle,
        ], 201);
    }

    public function show(Request $request, Vehicle $vehicle)
    {
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'make' => ['sometimes', 'string', 'max:255'],
            'model' => ['sometimes', 'string', 'max:255'],
            'year' => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'license_plate' => ['sometimes', 'string', 'max:20', 'unique:vehicles,license_plate,' . $vehicle->id],
            'vin' => ['nullable', 'string', 'max:17'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $vehicle->update($validated);

        return response()->json([
            'message' => 'Vehicle updated successfully.',
            'vehicle' => $vehicle,
        ]);
    }

    public function destroy(Request $request, Vehicle $vehicle)
    {
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully.',
        ]);
    }
}
