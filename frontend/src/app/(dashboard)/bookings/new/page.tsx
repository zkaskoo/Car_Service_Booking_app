'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { vehicleAPI, serviceAPI, bookingAPI } from '@/lib/api';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle, Calendar, CheckCircle, Wrench } from 'lucide-react';

export default function NewBookingPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Fetch vehicles
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehicleAPI.getAll();
      return response.data.data || response.data || [];
    },
  });

  // Fetch services
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceAPI.getAll();
      return response.data.services || response.data.data || response.data || [];
    },
  });

  // Fetch available time slots
  const { data: availableSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['availableSlots', bookingDate, selectedServices],
    queryFn: async () => {
      if (!bookingDate || selectedServices.length === 0) return [];
      const response = await bookingAPI.checkAvailability({
        date: bookingDate,
        service_ids: selectedServices,
      });
      return response.data.available_slots || [];
    },
    enabled: !!bookingDate && selectedServices.length > 0,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const response = await bookingAPI.create({
        vehicle_id: parseInt(vehicleId),
        service_ids: selectedServices,
        booking_date: bookingDate,
        start_time: startTime,
        notes: notes || undefined,
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create booking. Please try again.');
    },
  });

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    setStartTime(''); // Reset time when services change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!vehicleId) {
      setError('Please select a vehicle');
      return;
    }
    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }
    if (!bookingDate) {
      setError('Please select a date');
      return;
    }
    if (!startTime) {
      setError('Please select a time');
      return;
    }

    createBookingMutation.mutate();
  };

  const vehicles = vehiclesData || [];
  const services = servicesData || [];
  const slots = availableSlots || [];

  const calculateTotal = () => {
    return services
      .filter((s: any) => selectedServices.includes(s.id))
      .reduce((acc: number, s: any) => acc + (s.price || 0), 0);
  };

  const calculateDuration = () => {
    return services
      .filter((s: any) => selectedServices.includes(s.id))
      .reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0);
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
        <form onSubmit={handleSubmit}>
          <Card className="animate-fade-in" glow>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Fill in the information below to schedule your service
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Select Vehicle *
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-surface px-3 py-2.5 text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">Choose a vehicle</option>
                  {vehicles.map((vehicle: any) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                    </option>
                  ))}
                </select>
                {isLoadingVehicles && (
                  <p className="text-sm text-gray-400 mt-1">Loading vehicles...</p>
                )}
                {!isLoadingVehicles && vehicles.length === 0 && (
                  <p className="text-sm text-yellow-500 mt-1">
                    No vehicles found. Please add a vehicle first.
                  </p>
                )}
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Select Services *
                </label>
                {isLoadingServices ? (
                  <p className="text-sm text-gray-400">Loading services...</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service: any) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceToggle(service.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedServices.includes(service.id)
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedServices.includes(service.id)
                                ? 'bg-primary-500 border-primary-500'
                                : 'border-gray-600'
                            }`}>
                              {selectedServices.includes(service.id) && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">{service.name}</p>
                              <p className="text-sm text-gray-400">{service.duration_minutes} min</p>
                            </div>
                          </div>
                          <p className="font-semibold text-primary-400">${service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <Input
                label="Appointment Date *"
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  setStartTime(''); // Reset time when date changes
                }}
                helperText="Select your preferred date"
                min={new Date().toISOString().split('T')[0]}
              />

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Appointment Time *
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={!bookingDate || selectedServices.length === 0}
                  className="w-full rounded-lg border border-gray-700 bg-surface px-3 py-2.5 text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingSlots
                      ? 'Loading available slots...'
                      : !bookingDate || selectedServices.length === 0
                      ? 'Select date and services first'
                      : 'Choose a time slot'}
                  </option>
                  {slots.map((slot: string) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {bookingDate && selectedServices.length > 0 && !isLoadingSlots && slots.length === 0 && (
                  <p className="text-sm text-yellow-500 mt-1">
                    No available slots for this date. Please try another date.
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or concerns?"
                  className="w-full rounded-lg border border-gray-700 bg-surface px-3 py-2 text-base text-white placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* Summary */}
              {selectedServices.length > 0 && (
                <div className="p-4 bg-surface-light rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Services selected:</span>
                      <span>{selectedServices.length}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Estimated duration:</span>
                      <span>{calculateDuration()} min</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold pt-2 border-t border-gray-700">
                      <span>Total:</span>
                      <span className="text-primary-400">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
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
                disabled={createBookingMutation.isPending || !vehicleId || selectedServices.length === 0 || !bookingDate || !startTime}
                className="flex-1"
              >
                Schedule Booking
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
