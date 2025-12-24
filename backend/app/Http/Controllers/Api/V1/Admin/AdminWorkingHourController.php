<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkingHour;
use Illuminate\Http\Request;

class AdminWorkingHourController extends Controller
{
    public function index()
    {
        $workingHours = WorkingHour::orderBy('day_of_week')->get();

        return response()->json([
            'data' => $workingHours,
        ]);
    }

    public function update(Request $request, WorkingHour $workingHour)
    {
        $validated = $request->validate([
            'open_time' => ['required_unless:is_closed,true', 'nullable', 'date_format:H:i'],
            'close_time' => ['required_unless:is_closed,true', 'nullable', 'date_format:H:i', 'after:open_time'],
            'is_closed' => ['boolean'],
        ]);

        if ($request->boolean('is_closed')) {
            $validated['open_time'] = null;
            $validated['close_time'] = null;
        }

        $workingHour->update($validated);

        return response()->json([
            'message' => 'Working hours updated successfully.',
            'data' => $workingHour,
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'hours' => ['required', 'array'],
            'hours.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'hours.*.open_time' => ['required_unless:hours.*.is_closed,true', 'nullable', 'date_format:H:i'],
            'hours.*.close_time' => ['required_unless:hours.*.is_closed,true', 'nullable', 'date_format:H:i'],
            'hours.*.is_closed' => ['boolean'],
        ]);

        foreach ($request->hours as $hour) {
            $data = [
                'open_time' => $hour['is_closed'] ?? false ? null : $hour['open_time'],
                'close_time' => $hour['is_closed'] ?? false ? null : $hour['close_time'],
                'is_closed' => $hour['is_closed'] ?? false,
            ];

            WorkingHour::updateOrCreate(
                ['day_of_week' => $hour['day_of_week']],
                $data
            );
        }

        return response()->json([
            'message' => 'Working hours updated successfully.',
            'data' => WorkingHour::orderBy('day_of_week')->get(),
        ]);
    }
}
