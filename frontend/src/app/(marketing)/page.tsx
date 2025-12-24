'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Car as CarIcon,
  Calendar,
  Clock,
  CheckCircle,
  Shield,
  Users,
  Wrench,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule service appointments in just a few clicks',
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'See available time slots and book instantly',
    },
    {
      icon: CheckCircle,
      title: 'Service Tracking',
      description: 'Track your service history and upcoming appointments',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security',
    },
  ];

  const services = [
    'Oil Change',
    'Tire Rotation',
    'Brake Service',
    'Engine Diagnostics',
    'Air Conditioning',
    'Battery Service',
    'Wheel Alignment',
    'Transmission Service',
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      content: 'Best car service booking experience ever! So easy to use and the service is always top-notch.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'I manage a fleet of vehicles and this platform makes scheduling maintenance a breeze.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'First-time User',
      content: 'As someone who knows nothing about cars, this service made everything simple and stress-free.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-950/10">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/10 border-2 border-primary-500 shadow-glow-sm">
                <CarIcon className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">Car Service Booking</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 border-2 border-primary-500 mb-8 shadow-glow">
              <CarIcon className="h-10 w-10 text-primary-400" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 glow-text">
              Your Car Service,
              <br />
              Simplified
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Book service appointments, manage your vehicles, and track maintenance history all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to manage your car service needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-400">
              Professional car maintenance and repair services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {services.map((service, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="py-6">
                  <Wrench className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {[
              { number: '10,000+', label: 'Happy Customers' },
              { number: '50,000+', label: 'Services Completed' },
              { number: '4.9/5', label: 'Average Rating' },
            ].map((stat, index) => (
              <Card key={index} glow className="text-center">
                <CardContent className="py-8">
                  <p className="text-4xl font-bold text-primary-400 mb-2">{stat.number}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-primary-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of customers who trust us with their car service needs
          </p>
          <Link href="/register">
            <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/10 border-2 border-primary-500 shadow-glow-sm">
                  <CarIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">Car Service Booking</h1>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Professional car service booking platform. Schedule appointments, manage vehicles, and track maintenance history.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-primary-400">Sign In</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-primary-400">Register</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-primary-400">Services</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-primary-400">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-primary-400">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-primary-400">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-primary-400">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Car Service Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
