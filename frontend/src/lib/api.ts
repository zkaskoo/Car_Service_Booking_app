import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    phone?: string;
  }) => api.post('/v1/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/v1/login', data),

  logout: () => api.post('/v1/logout'),

  verifyEmail: (data: { email: string; token: string }) =>
    api.post('/v1/verify-email', data),

  resendVerification: (email: string) =>
    api.post('/v1/resend-verification', { email }),

  forgotPassword: (email: string) =>
    api.post('/v1/forgot-password', { email }),

  resetPassword: (data: { email: string; token: string; password: string; password_confirmation: string }) =>
    api.post('/v1/reset-password', data),

  getCurrentUser: () => api.get('/v1/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/v1/profile'),

  updateProfile: (data: {
    name?: string;
    phone?: string;
  }) => api.put('/v1/profile', data),

  changePassword: (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => api.put('/v1/profile', data),
};

// Vehicle API
export const vehicleAPI = {
  getAll: () => api.get('/v1/vehicles'),

  getById: (id: string) => api.get(`/v1/vehicles/${id}`),

  create: (data: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin?: string;
    color?: string;
  }) => api.post('/v1/vehicles', data),

  update: (
    id: string,
    data: {
      make?: string;
      model?: string;
      year?: number;
      license_plate?: string;
      vin?: string;
      color?: string;
    }
  ) => api.put(`/v1/vehicles/${id}`, data),

  delete: (id: string) => api.delete(`/v1/vehicles/${id}`),
};

// Service API
export const serviceAPI = {
  getAll: (params?: { category_id?: number }) => api.get('/v1/services', { params }),

  getById: (id: string) => api.get(`/v1/services/${id}`),

  getCategories: () => api.get('/v1/service-categories'),
};

// Booking API
export const bookingAPI = {
  getAll: (params?: { status?: string; page?: number; per_page?: number }) =>
    api.get('/v1/bookings', { params }),

  getById: (id: string) => api.get(`/v1/bookings/${id}`),

  create: (data: {
    vehicle_id: number;
    service_ids: number[];
    booking_date: string;
    start_time: string;
    notes?: string;
  }) => api.post('/v1/bookings', data),

  update: (
    id: string,
    data: {
      booking_date?: string;
      start_time?: string;
      notes?: string;
    }
  ) => api.put(`/v1/bookings/${id}`, data),

  cancel: (id: string, reason?: string) => api.post(`/v1/bookings/${id}/cancel`, { cancellation_reason: reason }),

  checkAvailability: (data: { date: string; service_ids: number[] }) =>
    api.post('/v1/bookings/check-availability', data),
};

// Dashboard API - Combines bookings and vehicles data
export const dashboardAPI = {
  getStats: async () => {
    const [bookingsRes, vehiclesRes] = await Promise.all([
      api.get('/v1/bookings'),
      api.get('/v1/vehicles'),
    ]);

    const bookings = bookingsRes.data.data || bookingsRes.data.bookings || bookingsRes.data || [];
    const vehicles = vehiclesRes.data.vehicles || vehiclesRes.data || [];
    const now = new Date();

    return {
      data: {
        total_bookings: bookings.length,
        upcoming_bookings: bookings.filter((b: any) =>
          new Date(b.booking_date || b.date) >= now &&
          ['pending', 'confirmed'].includes(b.status)
        ).length,
        completed_bookings: bookings.filter((b: any) => b.status === 'completed').length,
        total_vehicles: vehicles.length,
      }
    };
  },

  getUpcomingBookings: (limit = 5) =>
    api.get('/v1/bookings').then(res => {
      const bookings = res.data.data || res.data.bookings || res.data || [];
      const now = new Date();
      return {
        data: bookings
          .filter((b: any) => new Date(b.booking_date || b.date) >= now && ['pending', 'confirmed'].includes(b.status))
          .sort((a: any, b: any) => new Date(a.booking_date || a.date).getTime() - new Date(b.booking_date || b.date).getTime())
          .slice(0, limit)
      };
    }),
};

export default api;
