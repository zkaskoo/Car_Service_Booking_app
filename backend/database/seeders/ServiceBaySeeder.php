<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceBaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bays = [
            ['name' => 'Bay 1', 'description' => 'General service bay', 'is_active' => true],
            ['name' => 'Bay 2', 'description' => 'General service bay', 'is_active' => true],
            ['name' => 'Bay 3', 'description' => 'Specialized for engine work', 'is_active' => true],
            ['name' => 'Bay 4', 'description' => 'Tire and brake services', 'is_active' => true],
        ];

        foreach ($bays as $bay) {
            \App\Models\ServiceBay::create($bay);
        }
    }
}
