'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '@/lib/api';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await bookingAPI.getAll(params);
      return response.data;
    },
  });

  const filteredBookings = bookings?.filter((booking: any) =>
    booking.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle_make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">Bookings</h1>
            <p className="text-gray-400 mt-1">Manage your service appointments</p>
          </div>
          <Link href="/bookings/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              New Booking
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <Select
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                placeholder="Filter by status"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4 animate-fade-in">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-400">Loading bookings...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-400">Failed to load bookings</p>
              </CardContent>
            </Card>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings.map((booking: any) => {
              const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <Card key={booking.id} hover className="group">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`${status.bg} p-3 rounded-lg`}>
                          <Calendar className={`h-6 w-6 ${status.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">
                              {booking.service_name || 'Service Appointment'}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {booking.vehicle_make} {booking.vehicle_model} ({booking.vehicle_year})
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDateTime(booking.scheduled_date)}
                            </span>
                            {booking.price && (
                              <span className="font-semibold text-primary-400">
                                {formatCurrency(booking.price)}
                              </span>
                            )}
                          </div>
                          {booking.notes && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                              {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 lg:flex-col">
                        <Link href={`/bookings/${booking.id}`} className="flex-1 lg:flex-none">
                          <Button variant="secondary" size="sm" fullWidth>
                            View Details
                          </Button>
                        </Link>
                        {booking.status === 'pending' && (
                          <Button variant="outline" size="sm" fullWidth>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No bookings found matching your filters'
                    : 'You have no bookings yet'}
                </p>
                <Link href="/bookings/new">
                  <Button>Schedule Your First Service</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
