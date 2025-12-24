'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Mail, CheckCircle, XCircle, Loader2, Car } from 'lucide-react';

function VerifyEmailContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token && email) {
      verifyEmail(token, email);
    }
  }, [token, email]);

  const verifyEmail = async (verificationToken: string, userEmail: string) => {
    setStatus('loading');
    try {
      await authAPI.verifyEmail({ email: userEmail, token: verificationToken });
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      if (refreshUser) {
        await refreshUser();
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 'Email verification failed. The link may be invalid or expired.'
      );
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      await authAPI.resendVerification(user.email);
      setMessage('Verification email sent! Please check your inbox.');
      setStatus('idle');
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || 'Failed to resend verification email. Please try again.'
      );
      setStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-16 w-16 text-primary-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Verifying Email</h3>
          <p className="text-gray-400">Please wait while we verify your email address...</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Email Verified!</h3>
          <p className="text-gray-400 mb-4">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Verification Failed</h3>
          <p className="text-gray-400 mb-6">{message}</p>
          <Button onClick={handleResendVerification} isLoading={isResending}>
            Resend Verification Email
          </Button>
        </div>
      );
    }

    // Default state - no token provided
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 border-2 border-primary-500 mb-4 shadow-glow">
          <Mail className="h-8 w-8 text-primary-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Verify Your Email</h3>
        <p className="text-gray-400 mb-6">
          We&apos;ve sent a verification link to <strong>{user?.email}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Please check your inbox and click the verification link to activate your account.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={handleResendVerification} isLoading={isResending}>
            Resend Verification Email
          </Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary-950/20">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 border-2 border-primary-500 mb-4 shadow-glow">
            <Car className="h-8 w-8 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white glow-text">
            Car Service Booking
          </h1>
        </div>

        <Card className="animate-fade-in" glow>
          <CardContent className="pt-6">{renderContent()}</CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Didn&apos;t receive the email? Check your spam folder or resend the verification email.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
