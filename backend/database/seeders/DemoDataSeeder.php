<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceBay;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Seed demo data for testing.
     */
    public function run(): void
    {
        $customer = User::where('email', 'customer@carservice.local')->first();

        if (!$customer) {
            $this->command->error('Customer user not found. Run AdminUserSeeder first.');
            return;
        }

        // Create demo vehicles
        $vehicles = [
            [
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2022,
                'license_plate' => 'ABC-1234',
                'color' => 'Silver',
            ],
            [
                'make' => 'Honda',
                'model' => 'Civic',
                'year' => 2023,
                'license_plate' => 'XYZ-5678',
                'color' => 'Blue',
            ],
            [
                'make' => 'Ford',
                'model' => 'F-150',
                'year' => 2021,
                'license_plate' => 'DEF-9012',
                'color' => 'Black',
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            Vehicle::updateOrCreate(
                [
                    'user_id' => $customer->id,
                    'license_plate' => $vehicleData['license_plate'],
                ],
                $vehicleData
            );
        }

        $customerVehicles = Vehicle::where('user_id', $customer->id)->get();
        $services = Service::where('is_active', true)->get();
        $serviceBay = ServiceBay::first();

        // Create demo bookings
        $bookings = [
            // Completed booking (past)
            [
                'vehicle' => $customerVehicles->first(),
                'services' => $services->take(2),
                'date' => Carbon::now()->subDays(7),
                'time' => '09:00',
                'status' => 'completed',
            ],
            // Completed booking (past)
            [
                'vehicle' => $customerVehicles->get(1) ?? $customerVehicles->first(),
                'services' => $services->slice(2, 1),
                'date' => Carbon::now()->subDays(3),
                'time' => '14:00',
                'status' => 'completed',
            ],
            // Confirmed upcoming booking
            [
                'vehicle' => $customerVehicles->first(),
                'services' => $services->take(1),
                'date' => Carbon::now()->addDays(2)->startOfDay(),
                'time' => '10:00',
                'status' => 'confirmed',
            ],
            // Pending booking
            [
                'vehicle' => $customerVehicles->get(2) ?? $customerVehicles->first(),
                'services' => $services->slice(3, 2),
                'date' => Carbon::now()->addDays(5)->startOfDay(),
                'time' => '11:00',
                'status' => 'pending',
            ],
        ];

        foreach ($bookings as $bookingData) {
            // Skip if it's a weekend
            $date = $bookingData['date'];
            if ($date->isWeekend()) {
                $date = $date->addDays($date->isSaturday() ? 2 : 1);
            }

            $totalPrice = $bookingData['services']->sum('price');
            $totalDuration = $bookingData['services']->sum('duration_minutes');

            $startTime = Carbon::parse($bookingData['time']);
            $endTime = $startTime->copy()->addMinutes($totalDuration);

            $booking = Booking::updateOrCreate(
                [
                    'user_id' => $customer->id,
                    'vehicle_id' => $bookingData['vehicle']->id,
                    'booking_date' => $date->format('Y-m-d'),
                    'start_time' => $startTime->format('H:i:s'),
                ],
                [
                    'service_bay_id' => $serviceBay?->id,
                    'end_time' => $endTime->format('H:i:s'),
                    'total_price' => $totalPrice,
                    'status' => $bookingData['status'],
                    'notes' => 'Demo booking for testing',
                ]
            );

            // Attach services
            $booking->services()->sync(
                $bookingData['services']->mapWithKeys(function ($service) {
                    return [
                        $service->id => [
                            'price' => $service->price,
                            'duration_minutes' => $service->duration_minutes,
                        ],
                    ];
                })->toArray()
            );
        }

        $this->command->info('Demo data created successfully!');
        $this->command->info('Created ' . count($vehicles) . ' vehicles and ' . count($bookings) . ' bookings');
    }
}
