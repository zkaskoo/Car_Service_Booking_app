'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/ui/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(6, 'Password must be at least 6 characters'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileError, setProfileError] = useState<string>('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await userAPI.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      setProfileSuccess(true);
      setProfileError('');
      refreshUser();
      setTimeout(() => setProfileSuccess(false), 3000);
    },
    onError: (err: any) => {
      setProfileError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
      setProfileSuccess(false);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string; confirm_password: string }) => {
      const response = await userAPI.changePassword({
        current_password: data.current_password,
        password: data.new_password,
        password_confirmation: data.confirm_password,
      });
      return response.data;
    },
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError('');
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (err: any) => {
      setPasswordError(
        err.response?.data?.detail || 'Failed to change password. Please try again.'
      );
      setPasswordSuccess(false);
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Profile Information */}
        <Card className="animate-fade-in" glow>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              {profileError && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{profileError}</p>
                </div>
              )}

              {profileSuccess && (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-500">Profile updated successfully!</p>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="h-5 w-5" />}
                helperText="Email cannot be changed"
              />

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                leftIcon={<User className="h-5 w-5" />}
                error={profileErrors.name?.message}
                {...registerProfile('name')}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone className="h-5 w-5" />}
                error={profileErrors.phone?.message}
                helperText="Optional - for booking notifications"
                {...registerProfile('phone')}
              />

              <Input
                label="Address"
                type="text"
                placeholder="123 Main St, City, State 12345"
                leftIcon={<MapPin className="h-5 w-5" />}
                error={profileErrors.address?.message}
                helperText="Optional"
                {...registerProfile('address')}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  isLoading={updateProfileMutation.isPending}
                  disabled={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              {passwordError && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-500">Password changed successfully!</p>
                </div>
              )}

              <Input
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={passwordErrors.current_password?.message}
                {...registerPassword('current_password')}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={passwordErrors.new_password?.message}
                helperText="Must be at least 8 characters"
                {...registerPassword('new_password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter your new password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={passwordErrors.confirm_password?.message}
                {...registerPassword('confirm_password')}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  isLoading={changePasswordMutation.isPending}
                  disabled={changePasswordMutation.isPending}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email Verification</span>
                {user?.email_verified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                    <AlertCircle className="h-3 w-3" />
                    Not Verified
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-medium">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
