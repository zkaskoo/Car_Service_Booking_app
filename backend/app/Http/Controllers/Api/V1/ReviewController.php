<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with(['user', 'booking.services'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $reviews,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => ['required', 'exists:bookings,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        // Verify user owns the booking
        if ($booking->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only review your own bookings.',
            ], 403);
        }

        // Verify booking is completed
        if ($booking->status !== 'completed') {
            return response()->json([
                'message' => 'You can only review completed bookings.',
            ], 422);
        }

        // Check if review already exists
        if ($booking->review) {
            return response()->json([
                'message' => 'You have already reviewed this booking.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'data' => $review->load(['user', 'booking.services']),
        ], 201);
    }

    public function show(Review $review)
    {
        // Only allow user to view their own reviews
        if ($review->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Review not found.',
            ], 404);
        }

        return response()->json([
            'data' => $review->load(['user', 'booking.services']),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        // Only allow user to update their own reviews
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only update your own reviews.',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully.',
            'data' => $review->load(['user', 'booking.services']),
        ]);
    }

    public function destroy(Review $review)
    {
        // Only allow user to delete their own reviews
        if ($review->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own reviews.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully.',
        ]);
    }

    public function forBooking(Booking $booking)
    {
        // Allow viewing review for any booking the user has access to
        if ($booking->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        $review = $booking->review;

        if (!$review) {
            return response()->json([
                'data' => null,
                'can_review' => $booking->status === 'completed',
            ]);
        }

        return response()->json([
            'data' => $review->load('user'),
            'can_review' => false,
        ]);
    }
}
