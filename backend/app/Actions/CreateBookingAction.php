<?php

namespace App\Actions;

use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceBay;
use App\Services\BookingAvailabilityService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateBookingAction
{
    public function __construct(
        protected BookingAvailabilityService $availabilityService
    ) {}

    public function execute(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $services = Service::whereIn('id', $data['service_ids'])->get();

            $totalDuration = $services->sum('duration_minutes');
            $totalPrice = $services->sum('price');

            $startTime = Carbon::parse($data['start_time']);
            $endTime = $startTime->copy()->addMinutes($totalDuration);

            $availableSlots = $this->availabilityService->getAvailableSlots(
                $data['booking_date'],
                $data['service_ids']
            );

            $requestedSlot = $startTime->format('H:i');
            if (!in_array($requestedSlot, $availableSlots)) {
                throw new \Exception('The selected time slot is not available.');
            }

            $availableBay = $this->findAvailableBay($data['booking_date'], $startTime, $endTime);

            if (!$availableBay) {
                throw new \Exception('No service bay available for the selected time.');
            }

            $booking = Booking::create([
                'user_id' => $data['user_id'],
                'vehicle_id' => $data['vehicle_id'],
                'service_bay_id' => $availableBay->id,
                'booking_date' => $data['booking_date'],
                'start_time' => $startTime->format('H:i:s'),
                'end_time' => $endTime->format('H:i:s'),
                'total_price' => $totalPrice,
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($services as $service) {
                $booking->services()->attach($service->id, [
                    'price' => $service->price,
                    'duration_minutes' => $service->duration_minutes,
                ]);
            }

            return $booking;
        });
    }

    protected function findAvailableBay($date, $startTime, $endTime): ?ServiceBay
    {
        return ServiceBay::where('is_active', true)
            ->whereDoesntHave('bookings', function ($query) use ($date, $startTime, $endTime) {
                $query->where('booking_date', $date)
                    ->where('status', '!=', 'cancelled')
                    ->where(function ($q) use ($startTime, $endTime) {
                        $q->whereBetween('start_time', [$startTime->format('H:i:s'), $endTime->format('H:i:s')])
                            ->orWhereBetween('end_time', [$startTime->format('H:i:s'), $endTime->format('H:i:s')])
                            ->orWhere(function ($q2) use ($startTime, $endTime) {
                                $q2->where('start_time', '<=', $startTime->format('H:i:s'))
                                    ->where('end_time', '>=', $endTime->format('H:i:s'));
                            });
                    });
            })
            ->first();
    }
}
