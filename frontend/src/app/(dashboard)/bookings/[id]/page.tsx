'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  no_show: { label: 'No Show', icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('');

  const bookingId = params.id as string;

  const { data: booking, isLoading, error: fetchError } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await bookingAPI.getById(bookingId);
      return response.data.data || response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => bookingAPI.cancel(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowCancelModal(false);
      setCancelReason('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    setError('');
    cancelMutation.mutate(cancelReason);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError || !booking) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Booking Not Found</h2>
          <p className="text-gray-400 mb-4">The booking you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/bookings">
            <Button>Back to Bookings</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Use either booking_date/start_time or date/time for compatibility
  const bookingDate = booking.booking_date || booking.date;
  const bookingTime = booking.start_time || booking.time;
  const totalAmount = booking.total_price || booking.total_amount || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">
                Booking #{booking.reference_number || booking.id}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.color} border ${status.border}`}>
                <StatusIcon className="h-4 w-4" />
                {status.label}
              </span>
            </div>
            <p className="text-gray-400">
              Created on {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
          {canCancel && (
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-400" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(bookingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Time</p>
                    <p className="text-lg font-semibold text-white">
                      {formatTime(bookingTime)}
                    </p>
                  </div>
                  {booking.service_bay && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Service Bay</p>
                      <p className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary-400" />
                        {booking.service_bay.name}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Estimated Duration</p>
                    <p className="text-lg font-semibold text-white">
                      {booking.total_duration || booking.services?.reduce((acc: number, s: any) => acc + (s.pivot?.duration_minutes || s.duration_minutes || 0), 0)} minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-400" />
                  Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {booking.vehicle ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-500/10 p-4 rounded-lg">
                      <Car className="h-8 w-8 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                      </p>
                      <p className="text-gray-400">
                        License Plate: {booking.vehicle.license_plate}
                      </p>
                      {booking.vehicle.color && (
                        <p className="text-gray-400">Color: {booking.vehicle.color}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Vehicle information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary-400" />
                  Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.services && booking.services.length > 0 ? (
                    booking.services.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-surface-light rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-white">{service.name}</p>
                          <p className="text-sm text-gray-400">
                            {service.pivot?.duration_minutes || service.duration_minutes} minutes
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-primary-400">
                          {formatCurrency(service.pivot?.price || service.price)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No services listed</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-400" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{booking.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Cancellation Info */}
            {booking.status === 'cancelled' && booking.cancellation_reason && (
              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-5 w-5" />
                    Cancellation Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-2">{booking.cancellation_reason}</p>
                  {booking.cancelled_at && (
                    <p className="text-sm text-gray-400">
                      Cancelled on {new Date(booking.cancelled_at).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <Card glow>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking.services?.map((service: any) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">{service.name}</span>
                      <span className="text-white">{formatCurrency(service.pivot?.price || service.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-xl font-bold text-primary-400">
                        {formatCurrency(totalAmount || booking.services?.reduce((acc: number, s: any) => acc + (s.pivot?.price || s.price || 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/bookings" className="block">
                  <Button variant="secondary" fullWidth>
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/bookings/new" className="block">
                  <Button variant="outline" fullWidth>
                    Book Another Service
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelReason('');
          setError('');
        }}
        title="Cancel Booking"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason for cancellation *
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="w-full px-4 py-3 bg-surface border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowCancelModal(false);
                setCancelReason('');
                setError('');
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleCancel}
              isLoading={cancelMutation.isPending}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
