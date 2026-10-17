import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb, User, Vehicle, Appointment, WorkshopService, Review, GalleryItem, ContactInquiry, AuditLog } from './db.js';
import { authenticateUser, requireAdmin, generateToken, AuthenticatedRequest } from './auth.js';
import { calculateEstimate, getWorkshopOperationalStatus } from '../lib/pricing.js';
import { validateBookingRequest } from '../lib/booking.js';

export const apiRouter = Router();

// Standard available workshop time slots per day
const DAILY_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '12:30 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
];

// Helper to log audit actions
function logAudit(admin: { userId: string; email: string }, action: string, targetType: string, targetId: string, details: string) {
  const db = getDb();
  const log: AuditLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    adminId: admin.userId,
    adminEmail: admin.email,
    action,
    targetType,
    targetId,
    details,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) db.auditLogs.pop(); // keep recent 200
  saveDb(db);
}

// ==========================================
// 1. AUTHENTICATION & PROFILE
// ==========================================

// Register
apiRouter.post('/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    res.status(400).json({ error: 'Invalid email address format.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const db = getDb();
  const existing = db.users.find(u => u.email === cleanEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email address already exists.' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim(),
    email: cleanEmail,
    passwordHash,
    role: 'CLIENT', // Strict server-side role assignment: signup is ALWAYS CLIENT
    phone: phone ? String(phone).trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const token = generateToken(newUser);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: 'Account successfully registered.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    },
  });
});

// Login
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const db = getDb();
  const user = db.users.find(u => u.email === cleanEmail);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Authentication successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

// Get Current User Profile
apiRouter.get('/auth/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
});

// Logout
apiRouter.post('/auth/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

// ==========================================
// 2. WORKSHOP STATUS & METADATA
// ==========================================

apiRouter.get('/status', (_req, res) => {
  const operational = getWorkshopOperationalStatus();
  const db = getDb();
  const activeJobs = db.appointments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'CONFIRMED').length;
  const completedJobs = db.appointments.filter(a => a.status === 'COMPLETED').length + 850; // include legacy certified historical jobs

  res.json({
    brand: 'AUTO CRAFT 3D',
    tagline: 'Precision Performance Workshop',
    developer: 'Developed & Designed by Ahad Ali Nisar',
    location: 'Sector I-9/3 Industrial Area, Islamabad, Pakistan',
    phone: '+92 51 8899221 / +92 300 0000000',
    email: 'service@autocraft3d.com',
    operational,
    liveStats: {
      activeJobs,
      completedJobs,
      rating: 4.96,
      totalReviews: db.reviews.length + 180,
    },
    timezone: 'Asia/Karachi (PKT UTC+5)',
  });
});

// ==========================================
// 3. SERVICES CATALOG & ADMIN CRUD
// ==========================================

apiRouter.get('/services', (_req, res) => {
  const db = getDb();
  res.json({ services: db.services });
});

// Admin add service
apiRouter.post('/services', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, category, basePrice, durationMinutes, features, supportedCategories, description } = req.body;
  if (!name || !category || !basePrice || !durationMinutes) {
    res.status(400).json({ error: 'Missing required service fields.' });
    return;
  }

  const db = getDb();
  const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newService: WorkshopService = {
    id: `srv_${Date.now()}`,
    name: String(name),
    slug,
    category,
    basePrice: Number(basePrice),
    durationMinutes: Number(durationMinutes),
    active: true,
    features: Array.isArray(features) ? features : [String(features)],
    supportedCategories: Array.isArray(supportedCategories) ? supportedCategories : ['sedan', 'suv', 'sports', 'exotic'],
    description: String(description || ''),
  };

  db.services.push(newService);
  saveDb(db);
  logAudit(req.user!, 'SERVICE_CREATED', 'SERVICE', newService.id, `Created service: ${newService.name}`);

  res.status(201).json({ service: newService });
});

// Admin update service price/status
apiRouter.put('/services/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const sIndex = db.services.findIndex(s => s.id === req.params.id);
  if (sIndex === -1) {
    res.status(404).json({ error: 'Service not found.' });
    return;
  }

  const s = db.services[sIndex];
  if (req.body.basePrice !== undefined) s.basePrice = Number(req.body.basePrice);
  if (req.body.durationMinutes !== undefined) s.durationMinutes = Number(req.body.durationMinutes);
  if (req.body.active !== undefined) s.active = Boolean(req.body.active);
  if (req.body.name !== undefined) s.name = String(req.body.name);
  if (req.body.description !== undefined) s.description = String(req.body.description);

  saveDb(db);
  logAudit(req.user!, 'SERVICE_UPDATED', 'SERVICE', s.id, `Updated service ${s.name} - Price PKR ${s.basePrice}`);

  res.json({ service: s });
});

// ==========================================
// 4. COST ESTIMATOR API
// ==========================================

apiRouter.post('/pricing/estimate', (req, res) => {
  const { category, serviceIds, addons, isPriority } = req.body;
  if (!category || !Array.isArray(serviceIds) || serviceIds.length === 0) {
    res.status(400).json({ error: 'Vehicle category and at least one service are required.' });
    return;
  }

  const db = getDb();
  const matchedServices = db.services
    .filter(s => serviceIds.includes(s.id))
    .map(s => ({
      id: s.id,
      name: s.name,
      basePricePkr: s.basePrice,
      durationMinutes: s.durationMinutes,
    }));

  if (matchedServices.length === 0) {
    res.status(400).json({ error: 'No matching services found for the given IDs.' });
    return;
  }

  const result = calculateEstimate({
    category,
    services: matchedServices,
    addons: addons || [],
    isPriority: Boolean(isPriority),
  });

  res.json({
    estimate: result,
    disclaimer: 'This cost estimate is non-binding. Final invoice may vary based on vehicle inspection and proprietary parts requirement.',
  });
});

// ==========================================
// 5. APPOINTMENTS & REAL-TIME AVAILABILITY
// ==========================================

// Get available slots for a given date (YYYY-MM-DD)
apiRouter.get('/appointments/availability', (req, res) => {
  const date = String(req.query.date || '');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'Valid date query param (YYYY-MM-DD) is required.' });
    return;
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    res.json({ date, slots: [], message: 'Past dates are unavailable for booking.' });
    return;
  }

  const db = getDb();
  // Filter active appointments on that date (excluding CANCELLED)
  const existingBookings = db.appointments.filter(
    a => a.appointmentDate === date && a.status !== 'CANCELLED'
  );

  // Workshop max bay capacity per slot = 2 concurrent cars
  const MAX_CAPACITY_PER_SLOT = 2;

  const slotAvailability = DAILY_SLOTS.map(slotTime => {
    const bookedCount = existingBookings.filter(a => a.slotTime === slotTime).length;
    const available = bookedCount < MAX_CAPACITY_PER_SLOT;
    return {
      time: slotTime,
      available,
      remainingBays: Math.max(0, MAX_CAPACITY_PER_SLOT - bookedCount),
    };
  });

  res.json({
    date,
    timezone: 'Asia/Karachi (PKT UTC+5)',
    slots: slotAvailability,
  });
});

// Book an appointment (Atomic concurrency & conflict check)
apiRouter.post('/appointments', (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleCategory,
    vehicleRegistration,
    serviceIds,
    notes,
    appointmentDate,
    slotTime,
    isPriority,
    userId,
  } = req.body;

  // Pure validation check
  const validation = validateBookingRequest({
    customerName,
    customerEmail,
    customerPhone,
    appointmentDate,
    slotTime,
    serviceIds,
    vehicleYear: Number(vehicleYear),
  });

  if (!validation.valid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  if (!vehicleMake || !vehicleModel || !vehicleCategory) {
    res.status(400).json({ error: 'Vehicle specifications are incomplete.' });
    return;
  }

  // Verify date is not in the past
  const targetDate = new Date(`${appointmentDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (targetDate < today) {
    res.status(400).json({ error: 'Cannot book appointments in the past.' });
    return;
  }

  const db = getDb();

  // ATOMIC CONFLICT RE-CHECK: check if slot is already fully booked
  const conflicting = db.appointments.filter(
    a => a.appointmentDate === appointmentDate && a.slotTime === slotTime && a.status !== 'CANCELLED'
  );

  if (conflicting.length >= 2) {
    res.status(409).json({
      error: `Selected slot (${slotTime} on ${appointmentDate}) was just filled by another reservation. Please select another slot.`,
    });
    return;
  }

  // Calculate price estimate
  const matchedServices = db.services.filter(s => serviceIds.includes(s.id));
  const estimateResult = calculateEstimate({
    category: vehicleCategory,
    services: matchedServices.map(s => ({
      id: s.id,
      name: s.name,
      basePricePkr: s.basePrice,
      durationMinutes: s.durationMinutes,
    })),
    isPriority: Boolean(isPriority),
  });

  // Generate unique booking reference: AC3D-YEAR-RANDOMHEX
  const randomRef = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `AC3D-2026-${randomRef}`;

  const newAppointment: Appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    bookingReference,
    userId: userId || (customerEmail ? `guest_${customerEmail.replace(/[^a-z0-9]/g, '')}` : 'guest'),
    customerName: String(customerName).trim(),
    customerEmail: String(customerEmail).trim().toLowerCase(),
    customerPhone: String(customerPhone).trim(),
    vehicleMake: String(vehicleMake).trim(),
    vehicleModel: String(vehicleModel).trim(),
    vehicleYear: Number(vehicleYear),
    vehicleCategory,
    vehicleRegistration: vehicleRegistration ? String(vehicleRegistration).trim().toUpperCase() : undefined,
    serviceIds,
    serviceNames: matchedServices.map(s => s.name),
    notes: notes ? String(notes).trim() : undefined,
    appointmentDate,
    slotTime,
    estimatedPrice: estimateResult.grandTotalPkr,
    estimatedDuration: estimateResult.totalDurationMinutes,
    isPriority: Boolean(isPriority),
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.appointments.push(newAppointment);

  // If user is registered and vehicle does not exist in saved vehicles, auto-save vehicle
  if (userId && !userId.startsWith('guest_')) {
    const existingVeh = db.vehicles.find(
      v => v.userId === userId && v.make.toLowerCase() === vehicleMake.toLowerCase() && v.model.toLowerCase() === vehicleModel.toLowerCase()
    );
    if (!existingVeh) {
      db.vehicles.push({
        id: `veh_${Date.now()}`,
        userId,
        make: vehicleMake,
        model: vehicleModel,
        year: Number(vehicleYear),
        registration: vehicleRegistration,
        category: vehicleCategory,
        createdAt: new Date().toISOString(),
      });
    }
  }

  saveDb(db);

  res.status(201).json({
    message: 'Appointment successfully confirmed and persisted.',
    appointment: newAppointment,
    bookingReference,
    estimate: estimateResult,
  });
});

// List appointments for authenticated user or admin
apiRouter.get('/appointments', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  if (req.user?.role === 'ADMIN') {
    // Admin sees all appointments sorted by date descending
    const sorted = [...db.appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ appointments: sorted });
  } else {
    // Client sees only their appointments
    const clientAppointments = db.appointments
      .filter(a => a.userId === req.user?.userId || a.customerEmail === req.user?.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ appointments: clientAppointments });
  }
});

// Get single appointment by reference or ID
apiRouter.get('/appointments/:refOrId', (req, res) => {
  const { refOrId } = req.params;
  const db = getDb();
  const appointment = db.appointments.find(a => a.id === refOrId || a.bookingReference === refOrId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment record not found.' });
    return;
  }

  res.json({ appointment });
});

// Update appointment status / cancel
apiRouter.patch('/appointments/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const appointment = db.appointments.find(a => a.id === req.params.id);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found.' });
    return;
  }

  // Authorization check: User must own the booking OR be an ADMIN
  const isOwner = appointment.userId === req.user?.userId || appointment.customerEmail === req.user?.email;
  const isAdmin = req.user?.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    res.status(403).json({ error: 'Unauthorized to modify this appointment.' });
    return;
  }

  const { status, cancellationReason, slotTime, appointmentDate } = req.body;

  // Clients can only CANCEL their own appointments
  if (!isAdmin && status && status !== 'CANCELLED') {
    res.status(403).json({ error: 'Clients can only cancel appointments. Contact workshop for date/slot changes.' });
    return;
  }

  if (status) {
    appointment.status = status;
  }
  if (cancellationReason) {
    appointment.cancellationReason = String(cancellationReason);
  }
  if (isAdmin && slotTime) {
    appointment.slotTime = slotTime;
  }
  if (isAdmin && appointmentDate) {
    appointment.appointmentDate = appointmentDate;
  }

  appointment.updatedAt = new Date().toISOString();
  saveDb(db);

  if (isAdmin) {
    logAudit(req.user!, 'APPOINTMENT_MODIFIED', 'APPOINTMENT', appointment.id, `Status set to ${appointment.status}`);
  }

  res.json({
    message: 'Appointment successfully updated.',
    appointment,
  });
});

// ==========================================
// 6. CUSTOMER VEHICLES
// ==========================================

apiRouter.get('/vehicles', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const vehicles = db.vehicles.filter(v => v.userId === req.user?.userId);
  res.json({ vehicles });
});

apiRouter.post('/vehicles', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { make, model, year, registration, category, vin, mileage } = req.body;
  if (!make || !model || !year || !category) {
    res.status(400).json({ error: 'Make, model, year, and category are required.' });
    return;
  }

  const db = getDb();
  const newVeh: Vehicle = {
    id: `veh_${Date.now()}`,
    userId: req.user!.userId,
    make: String(make).trim(),
    model: String(model).trim(),
    year: Number(year),
    registration: registration ? String(registration).trim().toUpperCase() : undefined,
    category,
    vin: vin ? String(vin).trim().toUpperCase() : undefined,
    mileage: mileage ? Number(mileage) : undefined,
    createdAt: new Date().toISOString(),
  };

  db.vehicles.push(newVeh);
  saveDb(db);

  res.status(201).json({ vehicle: newVeh });
});

// ==========================================
// 7. GALLERY & MEDIA
// ==========================================

apiRouter.get('/gallery', (_req, res) => {
  const db = getDb();
  res.json({ items: db.galleryItems });
});

apiRouter.post('/gallery', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, beforeImage, afterImage, vehicleModel, description, specs } = req.body;
  if (!title || !category || !beforeImage || !afterImage) {
    res.status(400).json({ error: 'Title, category, beforeImage, and afterImage are required.' });
    return;
  }

  const db = getDb();
  const newItem: GalleryItem = {
    id: `gal_${Date.now()}`,
    title: String(title),
    category,
    beforeImage: String(beforeImage),
    afterImage: String(afterImage),
    vehicleModel: String(vehicleModel || 'Performance Vehicle'),
    description: String(description || ''),
    specs: String(specs || ''),
    completionDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };

  db.galleryItems.unshift(newItem);
  saveDb(db);
  logAudit(req.user!, 'GALLERY_ITEM_ADDED', 'GALLERY', newItem.id, `Added project: ${newItem.title}`);

  res.status(201).json({ item: newItem });
});

// ==========================================
// 8. CUSTOMER REVIEWS
// ==========================================

apiRouter.get('/reviews', (_req, res) => {
  const db = getDb();
  // Filter published reviews for public
  const reviews = db.reviews.filter(r => r.isPublished);
  res.json({ reviews });
});

apiRouter.post('/reviews', (req, res) => {
  const { authorName, vehicleBadge, rating, comment, serviceRendered } = req.body;
  if (!authorName || !comment || !rating) {
    res.status(400).json({ error: 'Name, comment, and star rating are required.' });
    return;
  }

  const db = getDb();
  const newReview: Review = {
    id: `rev_${Date.now()}`,
    authorName: String(authorName).trim(),
    vehicleBadge: vehicleBadge ? String(vehicleBadge).trim() : 'Performance Enthusiast',
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: String(comment).trim(),
    serviceRendered: serviceRendered ? String(serviceRendered).trim() : 'Precision Workshop Service',
    verifiedClient: false, // Moderated
    isPublished: true, // Published by default for demo workshop
    createdAt: new Date().toISOString().split('T')[0],
  };

  db.reviews.unshift(newReview);
  saveDb(db);

  res.status(201).json({
    message: 'Review received. Thank you for your feedback.',
    review: newReview,
  });
});

// ==========================================
// 9. CONTACT INQUIRIES
// ==========================================

apiRouter.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  const db = getDb();
  const inquiry: ContactInquiry = {
    id: `inq_${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : undefined,
    subject: subject ? String(subject).trim() : 'General Inquiry',
    message: String(message).trim(),
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  db.contactInquiries.unshift(inquiry);
  saveDb(db);

  res.status(201).json({
    message: 'Your inquiry has been received. Our master technicians will respond within 24 hours.',
    inquiryId: inquiry.id,
  });
});

apiRouter.get('/contact', requireAdmin, (_req, res) => {
  const db = getDb();
  res.json({ inquiries: db.contactInquiries });
});

// ==========================================
// 10. ADMIN DASHBOARD METRICS & AUDIT LOGS
// ==========================================

apiRouter.get('/admin/metrics', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const totalAppointments = db.appointments.length;
  const pendingAppointments = db.appointments.filter(a => a.status === 'PENDING').length;
  const activeJobs = db.appointments.filter(a => a.status === 'IN_PROGRESS' || a.status === 'CONFIRMED').length;
  const completedJobs = db.appointments.filter(a => a.status === 'COMPLETED').length;

  const totalRevenuePkr = db.appointments
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((sum, a) => sum + (a.estimatedPrice || 0), 0);

  const totalClients = db.users.filter(u => u.role === 'CLIENT').length;

  res.json({
    metrics: {
      totalAppointments,
      pendingAppointments,
      activeJobs,
      completedJobs,
      totalRevenuePkr,
      totalClients,
      totalServices: db.services.length,
      averageRating: 4.96,
      newInquiries: db.contactInquiries.filter(i => i.status === 'NEW').length,
    },
  });
});

apiRouter.get('/admin/audit-logs', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  res.json({ auditLogs: db.auditLogs });
});

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});
