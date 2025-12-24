<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedDate;
use Illuminate\Http\Request;

class AdminBlockedDateController extends Controller
{
    public function index(Request $request)
    {
        $query = BlockedDate::query();

        if ($request->has('from')) {
            $query->where('date', '>=', $request->from);
        }

        if ($request->has('to')) {
            $query->where('date', '<=', $request->to);
        }

        $blockedDates = $query->orderBy('date')->get();

        return response()->json([
            'data' => $blockedDates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today', 'unique:blocked_dates,date'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $blockedDate = BlockedDate::create($validated);

        return response()->json([
            'message' => 'Blocked date created successfully.',
            'data' => $blockedDate,
        ], 201);
    }

    public function destroy(BlockedDate $blockedDate)
    {
        $blockedDate->delete();

        return response()->json([
            'message' => 'Blocked date removed successfully.',
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'dates' => ['required', 'array'],
            'dates.*' => ['required', 'date', 'after_or_equal:today'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $created = [];
        foreach ($request->dates as $date) {
            $blockedDate = BlockedDate::firstOrCreate(
                ['date' => $date],
                ['reason' => $request->reason]
            );
            $created[] = $blockedDate;
        }

        return response()->json([
            'message' => count($created) . ' blocked dates created.',
            'data' => $created,
        ], 201);
    }
}
