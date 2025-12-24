<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Models\EmailVerificationToken;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request, RegisterUserAction $action)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $action->execute($validated);

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email address before logging in.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
        ]);

        $verificationToken = EmailVerificationToken::where('email', $request->email)
            ->where('token', $request->token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$verificationToken) {
            return response()->json([
                'message' => 'Invalid or expired verification token.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
            ], 400);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        $verificationToken->delete();

        return response()->json([
            'message' => 'Email verified successfully.',
        ]);
    }

    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
            ], 400);
        }

        EmailVerificationToken::where('email', $request->email)->delete();

        $token = Str::random(60);
        EmailVerificationToken::create([
            'email' => $request->email,
            'token' => $token,
            'expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new \App\Mail\VerifyEmailMail($token, $user->email));

        return response()->json([
            'message' => 'Verification email sent successfully.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $request->email)->first();

        \App\Models\PasswordResetToken::where('email', $request->email)->delete();

        $token = Str::random(60);
        \App\Models\PasswordResetToken::create([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        Mail::to($user->email)->send(new \App\Mail\PasswordResetMail($token, $user->email));

        return response()->json([
            'message' => 'Password reset link sent to your email.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $resetToken = \App\Models\PasswordResetToken::where('email', $request->email)->first();

        if (!$resetToken || !Hash::check($request->token, $resetToken->token)) {
            return response()->json([
                'message' => 'Invalid password reset token.',
            ], 400);
        }

        if ($resetToken->isExpired()) {
            $resetToken->delete();
            return response()->json([
                'message' => 'Password reset token has expired.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        $resetToken->delete();

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }
}
