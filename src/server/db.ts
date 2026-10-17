import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'CLIENT' | 'ADMIN';
  phone?: string;
  createdAt: string;
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
  slotTime: string; // e.g. "10:00 AM"
  estimatedPrice: number; // in PKR
  estimatedDuration: number; // in minutes
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
  rating: number; // 1 to 5
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

export interface DatabaseSchema {
  users: User[];
  vehicles: Vehicle[];
  services: WorkshopService[];
  appointments: Appointment[];
  reviews: Review[];
  galleryItems: GalleryItem[];
  contactInquiries: ContactInquiry[];
  auditLogs: AuditLog[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'workshop_db.json');

// Memory cache of the database
let dbData: DatabaseSchema | null = null;

function ensureDataDir(): void {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateInitialData(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync('AdminPass123!', 10);
  const clientPasswordHash = bcrypt.hashSync('ClientPass123!', 10);

  const initialUsers: User[] = [
    {
      id: 'usr_admin_01',
      name: 'Workshop Master Admin',
      email: 'admin@autocraft3d.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+92 300 1234567',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'usr_client_01',
      name: 'Farhan Tariq',
      email: 'client@autocraft3d.com',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      phone: '+92 321 9876543',
      createdAt: new Date('2026-02-15').toISOString(),
    },
  ];

  const initialVehicles: Vehicle[] = [
    {
      id: 'veh_01',
      userId: 'usr_client_01',
      make: 'Porsche',
      model: '911 GT3 (992)',
      year: 2023,
      registration: 'ICT-GT3-992',
      category: 'sports',
      vin: 'WP0AF2A97NS298112',
      mileage: 14200,
      createdAt: new Date('2026-02-16').toISOString(),
    },
    {
      id: 'veh_02',
      userId: 'usr_client_01',
      make: 'Toyota',
      model: 'Land Cruiser LC300 GR Sport',
      year: 2024,
      registration: 'LHR-LC-300',
      category: 'suv',
      vin: 'JTMHX01J804018293',
      mileage: 22000,
      createdAt: new Date('2026-03-01').toISOString(),
    },
  ];

  const initialServices: WorkshopService[] = [
    {
      id: 'srv_diag',
      name: 'OEM Computer Diagnostics & Telemetry',
      slug: 'computer-diagnostics',
      category: 'Diagnostics',
      description: 'Factory-level CAN-bus telemetry, oscilloscope actuator testing, and deep fault code isolation.',
      basePrice: 6500,
      durationMinutes: 60,
      active: true,
      features: ['Full CAN-Bus sensor sweep', 'Live oscilloscope signal analysis', 'Actuator bi-directional testing', 'ECU fault log archival & printed report'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_dyno',
      name: 'Dyno ECU Tuning & Performance Mapping',
      slug: 'engine-tuning',
      category: 'Performance',
      description: 'Chassis dynamometer tuning with AFR wideband logging, ignition advance, and custom torque mapping.',
      basePrice: 45000,
      durationMinutes: 180,
      active: true,
      features: ['AWD Chassis Dynamometer pull', 'Custom Stage 1 / Stage 2 calibration', 'AFR & Ignition timing optimization', 'Torque vectoring & anti-lag refinement'],
      supportedCategories: ['sports', 'exotic', 'sedan', 'suv'],
    },
    {
      id: 'srv_paint',
      name: 'Precision Dent Repair & Custom Paint',
      slug: 'dent-repair-custom-painting',
      category: 'Body & Paint',
      description: 'Spectrophotometer digital color matching, climate-controlled down-draft curing, and flawless multi-layer clear coats.',
      basePrice: 38000,
      durationMinutes: 360,
      active: true,
      features: ['Paintless Dent Removal (PDR)', 'Computerized Glasurit spectrophotometer color match', 'Down-draft baking booth cure', 'Multi-layer ceramic clear coat'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_detail',
      name: 'Signature Detailing & Paint Correction',
      slug: 'detailing-and-restoration',
      category: 'Detailing',
      description: 'Rotary multi-stage paint leveling to remove orange peel and swirl marks, followed by 9H quartz ceramic protection.',
      basePrice: 28000,
      durationMinutes: 300,
      active: true,
      features: ['3-Stage rotary paint leveling', '9H Quartz ceramic coating applied', 'Full interior leather conditioning & steam sanitize', 'Chassis deep wash & protectant'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_susp',
      name: 'Track Suspension & Steering Geometry',
      slug: 'suspension-and-steering',
      category: 'Mechanical',
      description: 'Laser corner-weight ride-height balancing, active damper calibration, and suspension bushing deflection testing.',
      basePrice: 18500,
      durationMinutes: 120,
      active: true,
      features: ['Corner weighting & ride-height balancing', 'Bushing & ball-joint deflection test', 'Coilover damping rate setup', 'Active damper electronically calibrated'],
      supportedCategories: ['sports', 'exotic', 'sedan', 'suv'],
    },
    {
      id: 'srv_oil',
      name: 'Precision Oil & Synthetic Filter Flush',
      slug: 'oil-and-filter-service',
      category: 'Mechanical',
      description: 'Motul 300V / Liqui Moly Ester Core synthetic fluid service with sump magnetic inspection and 24-point check.',
      basePrice: 12000,
      durationMinutes: 45,
      active: true,
      features: ['Liqui Moly / Motul 300V Ester Core Synthetic', 'OEM micro-pore filter replacement', 'Sump magnetic plug inspection', '24-point undercarriage inspection'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_brake',
      name: 'High-Performance Brake System Overhaul',
      slug: 'brake-inspection-overhaul',
      category: 'Mechanical',
      description: 'Micro-measurement of rotors, high-friction ceramic pad installation, ultrasonic caliper clean, and Motul RBF660 pressure bleed.',
      basePrice: 22000,
      durationMinutes: 90,
      active: true,
      features: ['Brembo / AP Racing rotor micro-measure', 'Ceramic compound pad installation', 'Motul RBF660 high-temp pressure bleed', 'Caliper piston ultrasonic clean'],
      supportedCategories: ['sports', 'exotic', 'sedan', 'suv'],
    },
    {
      id: 'srv_ac',
      name: 'Climate System & Heat Exchanger Service',
      slug: 'ac-climate-service',
      category: 'Electrical',
      description: 'Automated refrigerant evacuation and digital scale recharge, fluorescent UV dye leak check, and cabin sterilization.',
      basePrice: 14000,
      durationMinutes: 60,
      active: true,
      features: ['R134a / R1234yf automated evac & recharge', 'UV fluorescent leak detection scan', 'Ozone cabin sterilization cycle', 'Evaporator core antimicrobial flush'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_align',
      name: 'Laser 3D Wheel Alignment & Road Force',
      slug: 'wheel-alignment-road-force',
      category: 'Mechanical',
      description: 'Hunter HawkEye Elite 4-wheel optical alignment with factory race camber/toe targets and Road Force balancing.',
      basePrice: 8500,
      durationMinutes: 50,
      active: true,
      features: ['Hunter HawkEye Elite 4-wheel laser setup', 'Toe, camber, and caster to factory race specs', 'Road Force wheel balance', 'Steering angle sensor recalibration'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_battery',
      name: 'High-Voltage & 12V Electrical Analysis',
      slug: 'battery-and-electrical-service',
      category: 'Electrical',
      description: 'Full electrical system sweep, alternator ripple diode test, parasitic battery draw analysis, and terminal service.',
      basePrice: 9500,
      durationMinutes: 60,
      active: true,
      features: ['Alternator ripple waveform capture', 'Parasitic draw drain tracing', 'Lithium / AGM conductance load test', 'High-current ground terminal cleaning'],
      supportedCategories: ['sedan', 'suv', 'sports', 'exotic', 'truck'],
    },
    {
      id: 'srv_mods',
      name: 'Bespoke Performance Modifications',
      slug: 'custom-performance-modifications',
      category: 'Performance',
      description: 'Custom titanium valved exhaust fabrication, high-flow cold air intake plumbing, and aerodynamic carbon fiber splitter fitment.',
      basePrice: 65000,
      durationMinutes: 480,
      active: true,
      features: ['Titanium valved exhaust fabrication', 'Cold air carbon intake integration', 'Methanol injection system plumbing', 'Custom aero carbon splitter & wing mount'],
      supportedCategories: ['sports', 'exotic', 'sedan'],
    },
  ];

  const initialAppointments: Appointment[] = [
    {
      id: 'apt_01',
      bookingReference: 'AC3D-2026-9481',
      userId: 'usr_client_01',
      customerName: 'Farhan Tariq',
      customerEmail: 'client@autocraft3d.com',
      customerPhone: '+92 321 9876543',
      vehicleMake: 'Porsche',
      vehicleModel: '911 GT3 (992)',
      vehicleYear: 2023,
      vehicleCategory: 'sports',
      vehicleRegistration: 'ICT-GT3-992',
      serviceIds: ['srv_dyno', 'srv_brake'],
      serviceNames: ['Dyno ECU Tuning & Performance Mapping', 'High-Performance Brake System Overhaul'],
      notes: 'Please run telemetry pull before installing Stage 2 map. Install RBF660 brake fluid.',
      appointmentDate: '2026-10-22',
      slotTime: '10:00 AM',
      estimatedPrice: 97150,
      estimatedDuration: 270,
      isPriority: true,
      status: 'CONFIRMED',
      createdAt: new Date('2026-10-14T09:30:00Z').toISOString(),
      updatedAt: new Date('2026-10-14T10:00:00Z').toISOString(),
    },
    {
      id: 'apt_02',
      bookingReference: 'AC3D-2026-8812',
      userId: 'usr_client_01',
      customerName: 'Farhan Tariq',
      customerEmail: 'client@autocraft3d.com',
      customerPhone: '+92 321 9876543',
      vehicleMake: 'Toyota',
      vehicleModel: 'Land Cruiser LC300 GR Sport',
      vehicleYear: 2024,
      vehicleCategory: 'suv',
      vehicleRegistration: 'LHR-LC-300',
      serviceIds: ['srv_oil', 'srv_align'],
      serviceNames: ['Precision Oil & Synthetic Filter Flush', 'Laser 3D Wheel Alignment & Road Force'],
      notes: 'Routine 20,000 km scheduled inspection and filter swap.',
      appointmentDate: '2026-09-18',
      slotTime: '02:00 PM',
      estimatedPrice: 25625,
      estimatedDuration: 95,
      isPriority: false,
      status: 'COMPLETED',
      createdAt: new Date('2026-09-10T11:00:00Z').toISOString(),
      updatedAt: new Date('2026-09-18T16:00:00Z').toISOString(),
    },
    {
      id: 'apt_03',
      bookingReference: 'AC3D-2026-7319',
      userId: 'usr_demo_02',
      customerName: 'Zainab Ahmed',
      customerEmail: 'zainab.a@example.com',
      customerPhone: '+92 333 5551234',
      vehicleMake: 'BMW',
      vehicleModel: 'M4 Competition (G82)',
      vehicleYear: 2022,
      vehicleCategory: 'sports',
      vehicleRegistration: 'ISB-M4-77',
      serviceIds: ['srv_detail', 'srv_diag'],
      serviceNames: ['Signature Detailing & Paint Correction', 'OEM Computer Diagnostics & Telemetry'],
      notes: 'Check throttle actuator fault code stored after track weekend.',
      appointmentDate: '2026-10-20',
      slotTime: '11:30 AM',
      estimatedPrice: 50025,
      estimatedDuration: 360,
      isPriority: false,
      status: 'PENDING',
      createdAt: new Date('2026-10-15T14:15:00Z').toISOString(),
      updatedAt: new Date('2026-10-15T14:15:00Z').toISOString(),
    },
  ];

  const initialReviews: Review[] = [
    {
      id: 'rev_01',
      authorName: 'Bilal Kasuri',
      vehicleBadge: 'Mercedes-AMG GT R',
      rating: 5,
      comment: 'The dyno telemetry and titanium exhaust tuning conducted here is unmatched in Pakistan. Engine response is razor-sharp and the 3D diagnostics pinpointed a boost leak two other shops missed. Outstanding technical caliber.',
      serviceRendered: 'Dyno ECU Tuning & Performance Mapping',
      verifiedClient: true,
      isPublished: true,
      createdAt: '2026-08-14',
    },
    {
      id: 'rev_02',
      authorName: 'Dr. Sameer Siddiqui',
      vehicleBadge: 'Porsche Cayman 718 GTS',
      rating: 5,
      comment: 'Brought in my 718 for brake overhaul and track geometry alignment. The Hunter Road Force setup eliminated all high-speed shimmy. Cleanest workshop floor I have ever witnessed.',
      serviceRendered: 'Laser 3D Wheel Alignment & Brake Service',
      verifiedClient: true,
      isPublished: true,
      createdAt: '2026-09-02',
    },
    {
      id: 'rev_03',
      authorName: 'Hamza Khan',
      vehicleBadge: 'Nissan GT-R R35 Nismo',
      rating: 5,
      comment: 'Full 3-stage paint correction and ceramic clear coat after 6 years of oxidation. The finish looks deeper than factory paint. Transparent pricing with zero surprise charges.',
      serviceRendered: 'Signature Detailing & Paint Correction',
      verifiedClient: true,
      isPublished: true,
      createdAt: '2026-09-28',
    },
    {
      id: 'rev_04',
      authorName: 'Farhan Tariq',
      vehicleBadge: 'Porsche 911 GT3 (992)',
      rating: 5,
      comment: 'Ahad Ali Nisar and the engineering team understand motorsport tolerance and telemetry. The customer dashboard makes tracking every service report effortless.',
      serviceRendered: 'OEM Computer Diagnostics',
      verifiedClient: true,
      isPublished: true,
      createdAt: '2026-10-05',
    },
  ];

  const initialGalleryItems: GalleryItem[] = [
    {
      id: 'gal_01',
      title: 'Porsche 911 Turbo S Aerodynamic Rebuild',
      category: 'Custom Builds',
      beforeImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      vehicleModel: 'Porsche 911 Turbo S (992)',
      description: 'Carbon fiber aerokit installation, intercooler upgrade, and custom valved Inconel exhaust fitment with dyno validation.',
      specs: '720 BHP | 900 Nm | 0-100 km/h: 2.5s',
      completionDate: 'October 2026',
    },
    {
      id: 'gal_02',
      title: 'BMW E30 M3 Classic Restoration',
      category: 'Restoration',
      beforeImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      vehicleModel: 'BMW M3 E30 Sport Evolution',
      description: 'Rotisserie bare-metal chassis restoration, S14 engine rebuild to 2.5L DTM spec, Glasurit Brilliant Red factory repaint.',
      specs: 'S14B25 NA Engine | Getrag 265 Dogleg | BBS RS 16"',
      completionDate: 'September 2026',
    },
    {
      id: 'gal_03',
      title: 'McLaren 720S Stage 2 Calibration',
      category: 'Performance',
      beforeImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
      vehicleModel: 'McLaren 720S Coupe',
      description: 'High-flow catless downpipes, custom map for 100-octane fuel, active suspension recalibration.',
      specs: '840 WHP | Monocage II Carbon | Titanium Exhaust',
      completionDate: 'August 2026',
    },
    {
      id: 'gal_04',
      title: 'Aston Martin DB11 Paint Correction',
      category: 'Detailing',
      beforeImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      vehicleModel: 'Aston Martin DB11 V12',
      description: 'Multi-stage wet-sanding orange peel removal followed by double-layer 9H ceramic coating and glass hydrophobic sealant.',
      specs: 'Onyx Black Pearl | 9H Ceramic Matrix Shield',
      completionDate: 'July 2026',
    },
  ];

  const initialContactInquiries: ContactInquiry[] = [
    {
      id: 'inq_01',
      name: 'Omer Farooq',
      email: 'omer.f@example.com',
      phone: '+92 300 4448888',
      subject: 'Inquiry regarding Track Spec Rollcage Installation',
      message: 'Hello, looking for a FIA-spec half cage fabrication for my Toyota GR Yaris. Can we book a consultation slot?',
      status: 'NEW',
      createdAt: new Date('2026-10-15T08:00:00Z').toISOString(),
    },
  ];

  const initialAuditLogs: AuditLog[] = [
    {
      id: 'aud_01',
      adminId: 'usr_admin_01',
      adminEmail: 'admin@autocraft3d.com',
      action: 'SYSTEM_INITIALIZED',
      targetType: 'SYSTEM',
      targetId: 'SYS_01',
      details: 'Auto Craft 3D Precision Performance Workshop initialized with demo dataset.',
      timestamp: new Date('2026-10-01T00:00:00Z').toISOString(),
    },
  ];

  return {
    users: initialUsers,
    vehicles: initialVehicles,
    services: initialServices,
    appointments: initialAppointments,
    reviews: initialReviews,
    galleryItems: initialGalleryItems,
    contactInquiries: initialContactInquiries,
    auditLogs: initialAuditLogs,
  };
}

export function getDb(): DatabaseSchema {
  if (dbData) {
    return dbData;
  }

  ensureDataDir();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      dbData = JSON.parse(raw);
      return dbData!;
    } catch (e) {
      console.warn('Could not parse database file, re-seeding demo database...', e);
    }
  }

  dbData = generateInitialData();
  saveDb(dbData);
  return dbData;
}

export function saveDb(data: DatabaseSchema): void {
  ensureDataDir();
  dbData = data;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

/**
 * Resets database to default demo state (Admin feature)
 */
export function resetDbToDemo(): DatabaseSchema {
  dbData = generateInitialData();
  saveDb(dbData);
  return dbData;
}
