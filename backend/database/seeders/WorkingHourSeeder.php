<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkingHourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workingHours = [
            ['day_of_week' => 0, 'open_time' => '00:00:00', 'close_time' => '00:00:00', 'is_closed' => true], // Sunday - Closed
            ['day_of_week' => 1, 'open_time' => '08:00:00', 'close_time' => '18:00:00', 'is_closed' => false], // Monday
            ['day_of_week' => 2, 'open_time' => '08:00:00', 'close_time' => '18:00:00', 'is_closed' => false], // Tuesday
            ['day_of_week' => 3, 'open_time' => '08:00:00', 'close_time' => '18:00:00', 'is_closed' => false], // Wednesday
            ['day_of_week' => 4, 'open_time' => '08:00:00', 'close_time' => '18:00:00', 'is_closed' => false], // Thursday
            ['day_of_week' => 5, 'open_time' => '08:00:00', 'close_time' => '18:00:00', 'is_closed' => false], // Friday
            ['day_of_week' => 6, 'open_time' => '09:00:00', 'close_time' => '15:00:00', 'is_closed' => false], // Saturday
        ];

        foreach ($workingHours as $hours) {
            \App\Models\WorkingHour::create($hours);
        }
    }
}
