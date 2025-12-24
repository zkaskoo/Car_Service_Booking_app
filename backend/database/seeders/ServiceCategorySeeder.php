<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Oil & Filter Services',
                'description' => 'Regular oil changes and filter replacements to keep your engine running smoothly',
                'icon' => 'oil-can',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Brake Services',
                'description' => 'Complete brake system inspection, repair, and replacement services',
                'icon' => 'brake-pads',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Tire Services',
                'description' => 'Tire rotation, balancing, alignment, and replacement services',
                'icon' => 'tire',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Engine Services',
                'description' => 'Engine diagnostics, tune-ups, and major engine repairs',
                'icon' => 'engine',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Electrical Services',
                'description' => 'Battery, alternator, starter, and electrical system diagnostics',
                'icon' => 'battery',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Inspection Services',
                'description' => 'Vehicle safety inspections and emissions testing',
                'icon' => 'clipboard-check',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\ServiceCategory::create($category);
        }
    }
}
