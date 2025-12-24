'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI, bookingAPI } from '@/lib/api';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  Calendar,
  Car as CarIcon,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: upcomingBookings, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcomingBookings'],
    queryFn: async () => {
      const response = await bookingAPI.getAll({ status: 'confirmed', per_page: 3 });
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats();
      return response.data;
    },
  });

  const statCards = [
    {
      name: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      name: 'Upcoming',
      value: stats?.upcoming_bookings || 0,
      icon: Clock,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      name: 'Completed',
      value: stats?.completed_bookings || 0,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      name: 'Vehicles',
      value: stats?.total_vehicles || 0,
      icon: CarIcon,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400">
            Here&apos;s an overview of your service bookings and vehicles.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <Link href="/bookings/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              New Booking
            </Button>
          </Link>
          <Link href="/vehicles">
            <Button variant="secondary" leftIcon={<CarIcon className="h-4 w-4" />}>
              Manage Vehicles
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>
              View All Bookings
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          {statCards.map((stat) => (
            <Card key={stat.name} hover>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <Card className="animate-fade-in" glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your scheduled service appointments</CardDescription>
              </div>
              <Link href="/bookings">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUpcoming ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-400">Loading bookings...</p>
              </div>
            ) : upcomingBookings && upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-surface-light rounded-lg border border-gray-800 hover:border-primary-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-500/10 p-3 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{booking.service_name || 'Oil Change'}</p>
                        <p className="text-sm text-gray-400">
                          {booking.vehicle_make} {booking.vehicle_model}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(booking.scheduled_date)}
                        </p>
                      </div>
                    </div>
                    <Link href={`/bookings/${booking.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No upcoming bookings</p>
                <Link href="/bookings/new">
                  <Button>Schedule a Service</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest service history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Completed oil change',
                  vehicle: '2021 Toyota Camry',
                  date: '2 days ago',
                  status: 'completed',
                },
                {
                  action: 'Scheduled tire rotation',
                  vehicle: '2021 Toyota Camry',
                  date: '1 week ago',
                  status: 'confirmed',
                },
                {
                  action: 'Added new vehicle',
                  vehicle: '2023 Honda Civic',
                  date: '2 weeks ago',
                  status: 'info',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      activity.status === 'completed'
                        ? 'bg-green-500'
                        : activity.status === 'confirmed'
                        ? 'bg-primary-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.vehicle}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
