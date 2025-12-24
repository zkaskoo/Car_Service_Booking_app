import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
    name: string;
    phone?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),

  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
  }) => api.put('/users/profile', data),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => api.put('/users/password', data),
};

// Vehicle API
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),

  getById: (id: string) => api.get(`/vehicles/${id}`),

  create: (data: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    vin?: string;
  }) => api.post('/vehicles', data),

  update: (
    id: string,
    data: {
      make?: string;
      model?: string;
      year?: number;
      license_plate?: string;
      vin?: string;
    }
  ) => api.put(`/vehicles/${id}`, data),

  delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Service API
export const serviceAPI = {
  getAll: () => api.get('/services'),

  getById: (id: string) => api.get(`/services/${id}`),

  getCategories: () => api.get('/services/categories'),
};

// Booking API
export const bookingAPI = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings', { params }),

  getById: (id: string) => api.get(`/bookings/${id}`),

  create: (data: {
    vehicle_id: string;
    service_id: string;
    scheduled_date: string;
    scheduled_time: string;
    notes?: string;
  }) => api.post('/bookings', data),

  update: (
    id: string,
    data: {
      scheduled_date?: string;
      scheduled_time?: string;
      notes?: string;
    }
  ) => api.put(`/bookings/${id}`, data),

  cancel: (id: string) => api.put(`/bookings/${id}/cancel`),

  getAvailableSlots: (date: string, serviceId: string) =>
    api.get('/bookings/available-slots', {
      params: { date, service_id: serviceId },
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),

  getRecentBookings: (limit = 5) =>
    api.get('/dashboard/recent-bookings', { params: { limit } }),

  getUpcomingBookings: (limit = 5) =>
    api.get('/dashboard/upcoming-bookings', { params: { limit } }),
};

export default api;
