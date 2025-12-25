'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Car as CarIcon, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const vehicleSchema = z.object({
  make: z.string().min(2, 'Make must be at least 2 characters'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  license_plate: z.string().min(1, 'License plate is required'),
  color: z.string().optional(),
  vin: z.string().optional(),
});

const colorOptions = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue',
  'Green', 'Brown', 'Beige', 'Orange', 'Yellow', 'Gold'
];

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  // Fetch vehicles
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await vehicleAPI.getAll();
      return response.data;
    },
  });

  // Create vehicle mutation
  const createVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const response = await vehicleAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      reset();
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to add vehicle. Please try again.');
    },
  });

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleFormData }) => {
      const response = await vehicleAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setEditingVehicle(null);
      reset();
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Failed to update vehicle. Please try again.');
    },
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      await vehicleAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteConfirm(null);
    },
  });

  const openAddModal = () => {
    setEditingVehicle(null);
    reset({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      license_plate: '',
      color: '',
      vin: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: any) => {
    setEditingVehicle(vehicle);
    reset({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      license_plate: vehicle.license_plate,
      color: vehicle.color || '',
      vin: vehicle.vin || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const onSubmit = async (data: VehicleFormData) => {
    if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data });
    } else {
      createVehicleMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteVehicleMutation.mutate(id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">Vehicles</h1>
            <p className="text-gray-400 mt-1">Manage your registered vehicles</p>
          </div>
          <Button onClick={openAddModal} leftIcon={<Plus className="h-4 w-4" />}>
            Add Vehicle
          </Button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-400">Loading vehicles...</p>
              </CardContent>
            </Card>
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle: any) => (
              <Card key={vehicle.id} hover className="group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-500/10 p-3 rounded-lg">
                      <CarIcon className="h-8 w-8 text-primary-400" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(vehicle)}
                        className="p-2 text-gray-400 hover:text-primary-400 hover:bg-surface-light rounded-lg transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-surface-light rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{vehicle.year} {vehicle.color && `• ${vehicle.color}`}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">License Plate:</span>
                      <span className="text-white font-medium">{vehicle.license_plate}</span>
                    </div>
                    {vehicle.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Color:</span>
                        <span className="text-white">{vehicle.color}</span>
                      </div>
                    )}
                    {vehicle.vin && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">VIN:</span>
                        <span className="text-white font-mono text-xs">{vehicle.vin}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <CarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No vehicles registered</p>
                <Button onClick={openAddModal}>Add Your First Vehicle</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add/Edit Vehicle Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingVehicle(null);
            reset();
            setError('');
          }}
          title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          description={
            editingVehicle
              ? 'Update your vehicle information'
              : 'Add a new vehicle to your account'
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <Input
              label="Make"
              placeholder="Toyota, Honda, Ford..."
              error={errors.make?.message}
              {...register('make')}
            />

            <Input
              label="Model"
              placeholder="Camry, Civic, F-150..."
              error={errors.model?.message}
              {...register('model')}
            />

            <Input
              label="Year"
              type="number"
              placeholder="2024"
              error={errors.year?.message}
              {...register('year', { valueAsNumber: true })}
            />

            <Input
              label="License Plate"
              placeholder="ABC-1234"
              error={errors.license_plate?.message}
              {...register('license_plate')}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Color
              </label>
              <select
                {...register('color')}
                className="w-full px-4 py-2.5 bg-surface-light border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select a color</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="VIN (Optional)"
              placeholder="1HGBH41JXMN109186"
              error={errors.vin?.message}
              helperText="Vehicle Identification Number"
              {...register('vin')}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingVehicle(null);
                  reset();
                  setError('');
                }}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createVehicleMutation.isPending || updateVehicleMutation.isPending}
                fullWidth
              >
                {editingVehicle ? 'Update' : 'Add'} Vehicle
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Vehicle"
          description="Are you sure you want to delete this vehicle? This action cannot be undone."
        >
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              isLoading={deleteVehicleMutation.isPending}
              fullWidth
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
