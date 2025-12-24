<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            // Oil & Filter Services (category_id: 1)
            ['service_category_id' => 1, 'name' => 'Standard Oil Change', 'description' => 'Basic oil change with standard filter replacement', 'price' => 49.99, 'duration_minutes' => 30],
            ['service_category_id' => 1, 'name' => 'Synthetic Oil Change', 'description' => 'Premium synthetic oil change with high-performance filter', 'price' => 79.99, 'duration_minutes' => 45],
            ['service_category_id' => 1, 'name' => 'Oil Filter Replacement', 'description' => 'Replace oil filter only', 'price' => 19.99, 'duration_minutes' => 15],

            // Brake Services (category_id: 2)
            ['service_category_id' => 2, 'name' => 'Brake Pad Replacement', 'description' => 'Replace front or rear brake pads', 'price' => 149.99, 'duration_minutes' => 90],
            ['service_category_id' => 2, 'name' => 'Brake Rotor Replacement', 'description' => 'Replace front or rear brake rotors', 'price' => 199.99, 'duration_minutes' => 120],
            ['service_category_id' => 2, 'name' => 'Complete Brake Service', 'description' => 'Full brake system inspection and service', 'price' => 299.99, 'duration_minutes' => 180],
            ['service_category_id' => 2, 'name' => 'Brake Fluid Flush', 'description' => 'Complete brake fluid replacement', 'price' => 89.99, 'duration_minutes' => 60],

            // Tire Services (category_id: 3)
            ['service_category_id' => 3, 'name' => 'Tire Rotation', 'description' => 'Rotate all four tires for even wear', 'price' => 39.99, 'duration_minutes' => 30],
            ['service_category_id' => 3, 'name' => 'Wheel Alignment', 'description' => 'Computerized wheel alignment service', 'price' => 99.99, 'duration_minutes' => 60],
            ['service_category_id' => 3, 'name' => 'Tire Balancing', 'description' => 'Balance all four wheels', 'price' => 59.99, 'duration_minutes' => 45],
            ['service_category_id' => 3, 'name' => 'Tire Replacement', 'description' => 'Replace one tire (tire not included)', 'price' => 29.99, 'duration_minutes' => 30],

            // Engine Services (category_id: 4)
            ['service_category_id' => 4, 'name' => 'Engine Tune-Up', 'description' => 'Complete engine tune-up service', 'price' => 199.99, 'duration_minutes' => 120],
            ['service_category_id' => 4, 'name' => 'Engine Diagnostics', 'description' => 'Comprehensive engine diagnostic scan', 'price' => 89.99, 'duration_minutes' => 60],
            ['service_category_id' => 4, 'name' => 'Spark Plug Replacement', 'description' => 'Replace all spark plugs', 'price' => 129.99, 'duration_minutes' => 90],
            ['service_category_id' => 4, 'name' => 'Air Filter Replacement', 'description' => 'Replace engine air filter', 'price' => 29.99, 'duration_minutes' => 15],

            // Electrical Services (category_id: 5)
            ['service_category_id' => 5, 'name' => 'Battery Replacement', 'description' => 'Replace car battery (battery not included)', 'price' => 39.99, 'duration_minutes' => 30],
            ['service_category_id' => 5, 'name' => 'Alternator Replacement', 'description' => 'Replace alternator (part not included)', 'price' => 149.99, 'duration_minutes' => 120],
            ['service_category_id' => 5, 'name' => 'Starter Replacement', 'description' => 'Replace starter motor (part not included)', 'price' => 129.99, 'duration_minutes' => 90],
            ['service_category_id' => 5, 'name' => 'Electrical Diagnostics', 'description' => 'Diagnose electrical system issues', 'price' => 79.99, 'duration_minutes' => 60],

            // Inspection Services (category_id: 6)
            ['service_category_id' => 6, 'name' => 'Safety Inspection', 'description' => 'Complete vehicle safety inspection', 'price' => 49.99, 'duration_minutes' => 45],
            ['service_category_id' => 6, 'name' => 'Emissions Test', 'description' => 'State-required emissions testing', 'price' => 39.99, 'duration_minutes' => 30],
            ['service_category_id' => 6, 'name' => 'Pre-Purchase Inspection', 'description' => 'Comprehensive inspection for used car buyers', 'price' => 149.99, 'duration_minutes' => 90],
        ];

        foreach ($services as $service) {
            \App\Models\Service::create(array_merge($service, ['is_active' => true]));
        }
    }
}
