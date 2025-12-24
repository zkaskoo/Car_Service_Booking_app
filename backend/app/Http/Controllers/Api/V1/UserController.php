<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load(['vehicles', 'bookings']),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'current_password' => ['sometimes', 'required_with:password'],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();

        if (isset($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect.',
                    'errors' => ['current_password' => ['Current password is incorrect.']],
                ], 422);
            }

            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }
}
