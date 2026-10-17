export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  phone?: string;
  createdAt?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  registration?: string;
  category: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
  vin?: string;
  mileage?: number;
  createdAt: string;
}

export interface WorkshopService {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'Diagnostics' | 'Performance' | 'Mechanical' | 'Body & Paint' | 'Detailing' | 'Electrical';
  basePrice: number; // in PKR
  durationMinutes: number;
  active: boolean;
  features: string[];
  supportedCategories: string[];
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  bookingReference: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleCategory: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
  vehicleRegistration?: string;
  serviceIds: string[];
  serviceNames: string[];
  notes?: string;
  appointmentDate: string; // YYYY-MM-DD
  slotTime: string;
  estimatedPrice: number;
  estimatedDuration: number;
  isPriority: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId?: string;
  authorName: string;
  vehicleBadge: string;
  rating: number;
  comment: string;
  serviceRendered: string;
  verifiedClient: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Diagnostics' | 'Performance' | 'Restoration' | 'Detailing' | 'Custom Builds';
  beforeImage: string;
  afterImage: string;
  vehicleModel: string;
  description: string;
  specs: string;
  completionDate: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface OperationalStatus {
  isOpen: boolean;
  statusText: string;
  nextChange: string;
  timezone: string;
}

export interface WorkshopStatusResponse {
  brand: string;
  tagline: string;
  developer: string;
  location: string;
  phone: string;
  email: string;
  operational: OperationalStatus;
  liveStats: {
    activeJobs: number;
    completedJobs: number;
    rating: number;
    totalReviews: number;
  };
  timezone: string;
}
