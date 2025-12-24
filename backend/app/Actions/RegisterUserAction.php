<?php

namespace App\Actions;

use App\Models\EmailVerificationToken;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterUserAction
{
    public function execute(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'customer',
        ]);

        $token = Str::random(60);
        EmailVerificationToken::create([
            'email' => $user->email,
            'token' => $token,
            'expires_at' => now()->addHours(24),
        ]);

        // Send verification email
        // Mail::to($user->email)->send(new VerifyEmailMail($token));

        return $user;
    }
}
