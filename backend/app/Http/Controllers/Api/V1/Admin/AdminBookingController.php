<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'vehicle', 'services', 'serviceBay']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('booking_date', $request->date);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $bookings = $query->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $bookings->items(),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load(['user', 'vehicle', 'services', 'serviceBay', 'review']);

        return response()->json([
            'data' => $booking,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => ['required', 'in:pending,confirmed,in_progress,completed,cancelled,no_show'],
        ]);

        $booking->status = $request->status;

        if ($request->status === 'cancelled') {
            $booking->cancelled_at = now();
            $booking->cancellation_reason = $request->get('cancellation_reason', 'Cancelled by admin');
        }

        $booking->save();

        return response()->json([
            'message' => 'Booking status updated successfully.',
            'data' => $booking->load(['user', 'vehicle', 'services', 'serviceBay']),
        ]);
    }

    public function assignBay(Request $request, Booking $booking)
    {
        $request->validate([
            'service_bay_id' => ['required', 'exists:service_bays,id'],
        ]);

        $booking->service_bay_id = $request->service_bay_id;
        $booking->save();

        return response()->json([
            'message' => 'Service bay assigned successfully.',
            'data' => $booking->load(['user', 'vehicle', 'services', 'serviceBay']),
        ]);
    }

    public function stats()
    {
        $today = now()->toDateString();
        $thisMonth = now()->startOfMonth();

        return response()->json([
            'data' => [
                'today' => [
                    'total' => Booking::whereDate('booking_date', $today)->count(),
                    'pending' => Booking::whereDate('booking_date', $today)->where('status', 'pending')->count(),
                    'confirmed' => Booking::whereDate('booking_date', $today)->where('status', 'confirmed')->count(),
                    'in_progress' => Booking::whereDate('booking_date', $today)->where('status', 'in_progress')->count(),
                    'completed' => Booking::whereDate('booking_date', $today)->where('status', 'completed')->count(),
                ],
                'this_month' => [
                    'total' => Booking::where('created_at', '>=', $thisMonth)->count(),
                    'completed' => Booking::where('created_at', '>=', $thisMonth)->where('status', 'completed')->count(),
                    'cancelled' => Booking::where('created_at', '>=', $thisMonth)->where('status', 'cancelled')->count(),
                    'revenue' => Booking::where('created_at', '>=', $thisMonth)->where('status', 'completed')->sum('total_price'),
                ],
                'all_time' => [
                    'total' => Booking::count(),
                    'completed' => Booking::where('status', 'completed')->count(),
                ],
            ],
        ]);
    }
}
