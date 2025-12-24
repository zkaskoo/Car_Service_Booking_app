'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { vehicleAPI, serviceAPI, bookingAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { AlertCircle, Calendar, Car as CarIcon, CheckCircle } from 'lucide-react';

const bookingSchema = z.object({
  vehicle_id: z.string().min(1, 'Please select a vehicle'),
  service_id: z.string().min(1, 'Please select a service'),
  scheduled_date: z.string().min(1, 'Please select a date'),
  scheduled_time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function NewBookingPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedDate = watch('scheduled_date');
  const selectedServiceId = watch('service_id');

  // Fetch vehicles
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehicleAPI.getAll();
      return response.data;
    },
  });

  // Fetch services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceAPI.getAll();
      return response.data;
    },
  });

  // Fetch available time slots
  const { data: availableSlots } = useQuery({
    queryKey: ['availableSlots', selectedDate, selectedServiceId],
    queryFn: async () => {
      if (!selectedDate || !selectedServiceId) return [];
      const response = await bookingAPI.getAvailableSlots(selectedDate, selectedServiceId);
      return response.data;
    },
    enabled: !!selectedDate && !!selectedServiceId,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await bookingAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to create booking. Please try again.');
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setError('');
    createBookingMutation.mutate(data);
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-6">
                Your service appointment has been scheduled successfully.
              </p>
              <p className="text-sm text-gray-500">Redirecting to bookings...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white">New Booking</h1>
          <p className="text-gray-400 mt-1">Schedule a service appointment for your vehicle</p>
        </div>

        {/* Form */}
        <Card className="animate-fade-in" glow>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Fill in the information below to schedule your service
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Vehicle Selection */}
              <div>
                <Select
                  label="Select Vehicle"
                  placeholder="Choose a vehicle"
                  options={
                    vehicles?.map((vehicle: any) => ({
                      value: vehicle.id,
                      label: `${vehicle.make} ${vehicle.model} (${vehicle.year}) - ${vehicle.license_plate}`,
                    })) || []
                  }
                  error={errors.vehicle_id?.message}
                  {...register('vehicle_id')}
                />
                {isLoadingVehicles && (
                  <p className="text-sm text-gray-400 mt-1">Loading vehicles...</p>
                )}
                {vehicles && vehicles.length === 0 && (
                  <p className="text-sm text-yellow-500 mt-1">
                    No vehicles found. Please add a vehicle first.
                  </p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <Select
                  label="Select Service"
                  placeholder="Choose a service"
                  options={
                    services?.map((service: any) => ({
                      value: service.id,
                      label: `${service.name} - $${service.price} (${service.duration}min)`,
                    })) || []
                  }
                  error={errors.service_id?.message}
                  {...register('service_id')}
                />
                {isLoadingServices && (
                  <p className="text-sm text-gray-400 mt-1">Loading services...</p>
                )}
              </div>

              {/* Date Selection */}
              <Input
                label="Appointment Date"
                type="date"
                error={errors.scheduled_date?.message}
                helperText="Select your preferred date"
                min={new Date().toISOString().split('T')[0]}
                {...register('scheduled_date')}
              />

              {/* Time Selection */}
              <div>
                <Select
                  label="Appointment Time"
                  placeholder="Choose a time slot"
                  options={
                    availableSlots?.map((slot: string) => ({
                      value: slot,
                      label: slot,
                    })) || [
                      { value: '09:00', label: '9:00 AM' },
                      { value: '10:00', label: '10:00 AM' },
                      { value: '11:00', label: '11:00 AM' },
                      { value: '13:00', label: '1:00 PM' },
                      { value: '14:00', label: '2:00 PM' },
                      { value: '15:00', label: '3:00 PM' },
                      { value: '16:00', label: '4:00 PM' },
                    ]
                  }
                  error={errors.scheduled_time?.message}
                  {...register('scheduled_time')}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Any special requests or concerns?"
                  className="w-full rounded-lg border border-gray-700 bg-surface px-3 py-2 text-base text-white placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </CardContent>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={createBookingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createBookingMutation.isPending}
                disabled={createBookingMutation.isPending}
                className="flex-1"
              >
                Schedule Booking
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
