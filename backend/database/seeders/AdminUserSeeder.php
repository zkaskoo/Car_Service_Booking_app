<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the admin user.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@carservice.local'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create a demo customer user
        User::updateOrCreate(
            ['email' => 'customer@carservice.local'],
            [
                'name' => 'Demo Customer',
                'password' => Hash::make('customer123'),
                'role' => 'customer',
                'email_verified_at' => now(),
                'phone' => '+1234567890',
            ]
        );

        $this->command->info('Admin and demo users created successfully!');
        $this->command->info('Admin: admin@carservice.local / admin123');
        $this->command->info('Customer: customer@carservice.local / customer123');
    }
}
