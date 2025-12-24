<?php

namespace App\Services;

use App\Models\BlockedDate;
use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceBay;
use App\Models\WorkingHour;
use Carbon\Carbon;

class BookingAvailabilityService
{
    public function getAvailableSlots(string $date, array $serviceIds): array
    {
        $date = Carbon::parse($date);

        if ($this->isDateBlocked($date)) {
            return [];
        }

        $workingHours = $this->getWorkingHours($date);
        if (!$workingHours) {
            return [];
        }

        $services = Service::whereIn('id', $serviceIds)->get();
        $totalDuration = $services->sum('duration_minutes');

        $slots = $this->generateTimeSlots(
            $workingHours->open_time,
            $workingHours->close_time,
            $totalDuration
        );

        $availableSlots = [];
        foreach ($slots as $slot) {
            if ($this->isSlotAvailable($date, $slot, $totalDuration)) {
                $availableSlots[] = $slot;
            }
        }

        return $availableSlots;
    }

    protected function isDateBlocked(Carbon $date): bool
    {
        return BlockedDate::where('date', $date->format('Y-m-d'))->exists();
    }

    protected function getWorkingHours(Carbon $date): ?WorkingHour
    {
        $dayOfWeek = $date->dayOfWeek;

        return WorkingHour::where('day_of_week', $dayOfWeek)
            ->where('is_closed', false)
            ->first();
    }

    protected function generateTimeSlots(string $openTime, string $closeTime, int $duration): array
    {
        $slots = [];
        $current = Carbon::parse($openTime);
        $close = Carbon::parse($closeTime);

        $slotInterval = 30;

        while ($current->copy()->addMinutes($duration) <= $close) {
            $slots[] = $current->format('H:i');
            $current->addMinutes($slotInterval);
        }

        return $slots;
    }

    protected function isSlotAvailable(Carbon $date, string $startTime, int $duration): bool
    {
        $start = Carbon::parse($date->format('Y-m-d') . ' ' . $startTime);
        $end = $start->copy()->addMinutes($duration);

        $activeBaysCount = ServiceBay::where('is_active', true)->count();

        if ($activeBaysCount === 0) {
            return false;
        }

        $bookedBaysCount = Booking::where('booking_date', $date->format('Y-m-d'))
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->where('start_time', '<', $end->format('H:i:s'))
                        ->where('end_time', '>', $start->format('H:i:s'));
                });
            })
            ->count();

        return $bookedBaysCount < $activeBaysCount;
    }

    public function isTimeSlotAvailable(string $date, string $startTime, int $duration): bool
    {
        $availableSlots = $this->getAvailableSlots($date, []);

        return in_array($startTime, $availableSlots);
    }
}
