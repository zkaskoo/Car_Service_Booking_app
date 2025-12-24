<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateBookingAction;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\BookingAvailabilityService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        protected BookingAvailabilityService $availabilityService
    ) {}

    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['vehicle', 'services', 'serviceBay'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request, CreateBookingAction $action)
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['exists:services,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['user_id'] = $request->user()->id;

        try {
            $booking = $action->execute($validated);

            return response()->json([
                'message' => 'Booking created successfully.',
                'booking' => $booking->load(['vehicle', 'services', 'serviceBay']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create booking.',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    public function show(Request $request, Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['vehicle', 'services', 'serviceBay', 'user']);

        return response()->json([
            'booking' => $booking,
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be updated.',
            ], 422);
        }

        $validated = $request->validate([
            'booking_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking->load(['vehicle', 'services', 'serviceBay']),
        ]);
    }

    public function cancel(Request $request, Booking $booking)
    {
        $this->authorize('cancel', $booking);

        if (in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'This booking cannot be cancelled.',
            ], 422);
        }

        $validated = $request->validate([
            'cancellation_reason' => ['required', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'],
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'booking' => $booking,
        ]);
    }

    public function availability(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['exists:services,id'],
        ]);

        $availability = $this->availabilityService->getAvailableSlots(
            $validated['date'],
            $validated['service_ids']
        );

        return response()->json([
            'date' => $validated['date'],
            'available_slots' => $availability,
        ]);
    }
}
