<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\VehicleController;
use App\Http\Controllers\Api\V1\Admin\AdminBookingController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceCategoryController;
use App\Http\Controllers\Api\V1\Admin\AdminWorkingHourController;
use App\Http\Controllers\Api\V1\Admin\AdminBlockedDateController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceBayController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\NotificationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Services (public)
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    Route::get('/service-categories', [ServiceController::class, 'categories']);
});

// Protected routes
Route::prefix('v1')->middleware(['auth:sanctum', 'verified'])->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User Profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'update']);

    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    // Booking availability
    Route::post('/bookings/check-availability', [BookingController::class, 'availability']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/{review}', [ReviewController::class, 'show']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::get('/bookings/{booking}/review', [ReviewController::class, 'forBooking']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/{notification}', [NotificationController::class, 'show']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
});

// Admin routes
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'verified', 'admin'])->group(function () {
    // Dashboard stats
    Route::get('/stats/bookings', [AdminBookingController::class, 'stats']);
    Route::get('/stats/users', [AdminUserController::class, 'stats']);

    // Bookings management
    Route::get('/bookings', [AdminBookingController::class, 'index']);
    Route::get('/bookings/{booking}', [AdminBookingController::class, 'show']);
    Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus']);
    Route::patch('/bookings/{booking}/assign-bay', [AdminBookingController::class, 'assignBay']);

    // Services management
    Route::apiResource('services', AdminServiceController::class);
    Route::post('/services/{service}/toggle-active', [AdminServiceController::class, 'toggleActive']);

    // Categories management
    Route::apiResource('categories', AdminServiceCategoryController::class)->parameters([
        'categories' => 'serviceCategory'
    ]);
    Route::post('/categories/reorder', [AdminServiceCategoryController::class, 'reorder']);

    // Working hours management
    Route::get('/working-hours', [AdminWorkingHourController::class, 'index']);
    Route::put('/working-hours/{workingHour}', [AdminWorkingHourController::class, 'update']);
    Route::put('/working-hours', [AdminWorkingHourController::class, 'bulkUpdate']);

    // Blocked dates management
    Route::get('/blocked-dates', [AdminBlockedDateController::class, 'index']);
    Route::post('/blocked-dates', [AdminBlockedDateController::class, 'store']);
    Route::post('/blocked-dates/bulk', [AdminBlockedDateController::class, 'bulkStore']);
    Route::delete('/blocked-dates/{blockedDate}', [AdminBlockedDateController::class, 'destroy']);

    // Service bays management
    Route::apiResource('service-bays', AdminServiceBayController::class)->parameters([
        'service-bays' => 'serviceBay'
    ]);
    Route::get('/service-bays/{serviceBay}/schedule', [AdminServiceBayController::class, 'schedule']);

    // Users management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);
});
