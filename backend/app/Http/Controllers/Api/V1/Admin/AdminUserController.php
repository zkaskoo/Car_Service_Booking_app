<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount(['bookings', 'vehicles']);

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(User $user)
    {
        $user->load(['vehicles', 'bookings' => function ($query) {
            $query->with(['vehicle', 'services'])->orderBy('date', 'desc')->limit(10);
        }]);

        return response()->json([
            'data' => $user,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'in:customer,admin,mechanic'],
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully.',
            'data' => $user,
        ]);
    }

    public function stats()
    {
        return response()->json([
            'data' => [
                'total' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'mechanics' => User::where('role', 'mechanic')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'unverified' => User::whereNull('email_verified_at')->count(),
                'new_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            ],
        ]);
    }
}
