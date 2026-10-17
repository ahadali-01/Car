import { User, WorkshopService, Appointment, Review, GalleryItem, ContactInquiry, WorkshopStatusResponse } from '../types/index.js';
import { EstimateResult } from '../lib/pricing.js';

const TOKEN_KEY = 'autocraft3d_auth_token';
const USER_KEY = 'autocraft3d_auth_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  apiRequest,
  // Status
  async getStatus(): Promise<WorkshopStatusResponse> {
    return apiRequest<WorkshopStatusResponse>('/api/status');
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return apiRequest<{ user: User }>('/api/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      authStorage.clear();
    }
  },

  // Services
  async getServices(): Promise<WorkshopService[]> {
    const res = await apiRequest<{ services: WorkshopService[] }>('/api/services');
    return res.services;
  },

  async createService(payload: Partial<WorkshopService>): Promise<WorkshopService> {
    const res = await apiRequest<{ service: WorkshopService }>('/api/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.service;
  },

  async updateService(id: string, payload: Partial<WorkshopService>): Promise<WorkshopService> {
    const res = await apiRequest<{ service: WorkshopService }>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.service;
  },

  // Pricing
  async estimatePrice(payload: {
    category: string;
    serviceIds: string[];
    addons?: { id: string; name: string; pricePkr: number }[];
    isPriority?: boolean;
  }): Promise<{ estimate: EstimateResult; disclaimer: string }> {
    return apiRequest<{ estimate: EstimateResult; disclaimer: string }>('/api/pricing/estimate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Appointments
  async getSlotAvailability(date: string): Promise<{
    date: string;
    timezone: string;
    slots: { time: string; available: boolean; remainingBays: number }[];
  }> {
    return apiRequest(`/api/appointments/availability?date=${encodeURIComponent(date)}`);
  },

  async createAppointment(payload: any): Promise<{
    appointment: Appointment;
    bookingReference: string;
    estimate: EstimateResult;
  }> {
    return apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAppointments(): Promise<Appointment[]> {
    const res = await apiRequest<{ appointments: Appointment[] }>('/api/appointments');
    return res.appointments;
  },

  async getAppointment(idOrRef: string): Promise<Appointment> {
    const res = await apiRequest<{ appointment: Appointment }>(`/api/appointments/${idOrRef}`);
    return res.appointment;
  },

  async updateAppointmentStatus(id: string, payload: {
    status?: string;
    cancellationReason?: string;
    slotTime?: string;
    appointmentDate?: string;
  }): Promise<Appointment> {
    const res = await apiRequest<{ appointment: Appointment }>(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.appointment;
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await apiRequest<{ items: GalleryItem[] }>('/api/gallery');
    return res.items;
  },

  async createGalleryItem(payload: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await apiRequest<{ item: GalleryItem }>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.item;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await apiRequest<{ reviews: Review[] }>('/api/reviews');
    return res.reviews;
  },

  async submitReview(payload: {
    authorName: string;
    vehicleBadge?: string;
    rating: number;
    comment: string;
    serviceRendered?: string;
  }): Promise<Review> {
    const res = await apiRequest<{ review: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.review;
  },

  // Contact
  async submitContact(payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; inquiryId: string }> {
    return apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getContactInquiries(): Promise<ContactInquiry[]> {
    const res = await apiRequest<{ inquiries: ContactInquiry[] }>('/api/contact');
    return res.inquiries;
  },

  // Admin Metrics & Audit
  async getAdminMetrics(): Promise<any> {
    const res = await apiRequest<{ metrics: any }>('/api/admin/metrics');
    return res.metrics;
  },

  async getAuditLogs(): Promise<any[]> {
    const res = await apiRequest<{ auditLogs: any[] }>('/api/admin/audit-logs');
    return res.auditLogs;
  },
};
