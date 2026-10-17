import React, { useState, useEffect } from 'react';
import { WorkshopService, User } from '../../types/index.js';
import { api } from '../../services/api.js';
import { formatPKR } from '../../lib/pricing.js';
import { Calendar, Clock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Wrench, Shield, Car, User as UserIcon } from 'lucide-react';

interface BookingWizardProps {
  services: WorkshopService[];
  currentUser: User | null;
  initialConfig?: {
    category: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
    serviceIds: string[];
    isPriority: boolean;
    make: string;
    model: string;
    year: number;
  } | null;
  onBookingComplete: (bookingRef: string) => void;
  onViewDashboard: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  services,
  currentUser,
  initialConfig,
  onBookingComplete,
  onViewDashboard,
}) => {
  const [step, setStep] = useState(1);

  // Step 1: Customer details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+92 300 1234567');

  // Step 2: Vehicle details
  const [vehicleMake, setVehicleMake] = useState(initialConfig?.make || 'Porsche');
  const [vehicleModel, setVehicleModel] = useState(initialConfig?.model || '911 GT3');
  const [vehicleYear, setVehicleYear] = useState(initialConfig?.year || 2023);
  const [vehicleCategory, setVehicleCategory] = useState<'sedan' | 'suv' | 'sports' | 'exotic' | 'truck'>(
    initialConfig?.category || 'sports'
  );
  const [vehicleRegistration, setVehicleRegistration] = useState('ICT-GT3-992');

  // Step 3: Services & notes
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    initialConfig?.serviceIds || [services[0]?.id || 'srv_diag']
  );
  const [notes, setNotes] = useState('');
  const [isPriority, setIsPriority] = useState(initialConfig?.isPriority || false);

  // Step 4: Date & Slot
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [appointmentDate, setAppointmentDate] = useState(defaultDateStr);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; remainingBays: number }[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timezoneInfo, setTimezoneInfo] = useState('Asia/Karachi (PKT UTC+5)');

  // Step 5: Submission & Result
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<any>(null);

  // Sync user if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Fetch slot availability when appointmentDate changes
  useEffect(() => {
    if (!appointmentDate) return;
    setLoadingSlots(true);
    setErrorMsg('');
    api.getSlotAvailability(appointmentDate)
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setTimezoneInfo(data.timezone || 'Asia/Karachi (PKT UTC+5)');
        // Auto-select first available slot if current selected is invalid
        const firstAvailable = data.slots.find((s) => s.available);
        if (firstAvailable && (!selectedSlotTime || !data.slots.find((s) => s.time === selectedSlotTime && s.available))) {
          setSelectedSlotTime(firstAvailable.time);
        }
      })
      .catch((err) => {
        setErrorMsg('Failed to check slot availability: ' + err.message);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [appointmentDate]);

  // Toggle service selection
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((s) => s !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Step validation
  const validateStep = (s: number): boolean => {
    setErrorMsg('');
    if (s === 1) {
      if (!customerName.trim()) {
        setErrorMsg('Customer name is required.');
        return false;
      }
      if (!customerEmail.trim() || !customerEmail.includes('@')) {
        setErrorMsg('A valid email address is required for booking confirmation.');
        return false;
      }
      if (!customerPhone.trim() || customerPhone.length < 8) {
        setErrorMsg('Contact telephone number is required.');
        return false;
      }
      return true;
    }
    if (s === 2) {
      if (!vehicleMake.trim() || !vehicleModel.trim()) {
        setErrorMsg('Vehicle make and model are required.');
        return false;
      }
      return true;
    }
    if (s === 3) {
      if (selectedServiceIds.length === 0) {
        setErrorMsg('Please select at least one workshop service.');
        return false;
      }
      return true;
    }
    if (s === 4) {
      if (!appointmentDate) {
        setErrorMsg('Please select a valid booking date.');
        return false;
      }
      if (!selectedSlotTime) {
        setErrorMsg('Please select an available workshop time slot.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Submit appointment to server
  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleCategory,
        vehicleRegistration,
        serviceIds: selectedServiceIds,
        notes,
        appointmentDate,
        slotTime: selectedSlotTime,
        isPriority,
        userId: currentUser?.id,
      };

      const result = await api.createAppointment(payload);
      setSuccessResult(result);
      onBookingComplete(result.bookingReference);
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please choose an alternate slot.');
    } finally {
      setSubmitting(false);
    }
  };

  // Selected services objects
  const chosenServices = services.filter((s) => selectedServiceIds.includes(s.id));

  // Quick total estimate
  const estimatedSubtotal = chosenServices.reduce((sum, s) => sum + s.basePrice, 0);

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>REAL-TIME SCHEDULING SYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          SMART APPOINTMENT <span className="text-[#00F0FF]">BOOKING</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Reserve calibrated workshop bay capacity with atomic double-booking prevention.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {successResult ? (
        <div className="bg-[#10141B] border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
            APPOINTMENT CONFIRMED & PERSISTED
          </span>

          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mb-2">
            Bay Reservation Secured
          </h2>

          <div className="inline-block px-5 py-2.5 rounded-2xl bg-zinc-900 border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-lg font-bold tracking-wider my-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            Reference: {successResult.bookingReference}
          </div>

          <p className="text-sm text-zinc-300 max-w-lg mx-auto mb-8 font-sans leading-relaxed">
            A confirmation dispatch has been logged for <strong className="text-white">{successResult.appointment.customerEmail}</strong>. Our service manager will verify pre-intake telemetry before your slot.
          </p>

          <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-6 max-w-lg mx-auto text-left text-xs font-mono space-y-2 mb-8">
            <div className="flex justify-between text-zinc-400">
              <span>Date & Time Slot:</span>
              <span className="text-white font-bold">{successResult.appointment.appointmentDate} at {successResult.appointment.slotTime} ({timezoneInfo})</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Vehicle:</span>
              <span className="text-white font-bold">{successResult.appointment.vehicleYear} {successResult.appointment.vehicleMake} {successResult.appointment.vehicleModel}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Procedures:</span>
              <span className="text-white font-bold">{successResult.appointment.serviceNames.join(', ')}</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800">
              <span>Estimated Quote:</span>
              <span className="text-[#00F0FF] font-bold text-sm">{formatPKR(successResult.appointment.estimatedPrice)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onViewDashboard}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
            >
              Go to Customer Garage Dashboard
            </button>
            <button
              onClick={() => {
                setSuccessResult(null);
                setStep(1);
              }}
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        /* WIZARD CARD */
        <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {['Contact', 'Vehicle', 'Services', 'Date & Bay', 'Review'].map((label, i) => {
                const stepNum = i + 1;
                const isComplete = step > stepNum;
                const isCurrent = step === stepNum;
                return (
                  <div key={label} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isComplete
                          ? 'bg-emerald-500 text-black'
                          : isCurrent
                          ? 'bg-[#00F0FF] text-[#090B0E] ring-4 ring-[#00F0FF]/20 shadow-[0_0_15px_#00F0FF]'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isComplete ? '✓' : stepNum}
                    </div>
                    <span className="text-[10px] font-mono uppercase mt-1 text-zinc-400 hidden sm:block">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00F0FF] to-[#00A3FF] h-full transition-all duration-300"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#FF1E27]/15 border border-[#FF1E27]/40 flex items-start gap-3 text-xs font-mono text-[#FF1E27] animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* STEP 1: CUSTOMER DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase mb-4">
                <UserIcon className="w-4 h-4 text-[#00F0FF]" />
                <span>Step 1: Driver & Contact Information</span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Farhan Tariq"
                  className="w-full px-4 py-3 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. farhan@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-4 py-3 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {!currentUser && (
                <div className="p-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-[11px] font-mono text-zinc-300">
                  Tip: You can book as a guest or sign in to save your vehicles and view live telemetry history.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: VEHICLE SPECS */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase mb-4">
                <Car className="w-4 h-4 text-[#00F0FF]" />
                <span>Step 2: Vehicle Specifications</span>
              </div>

              {/* Category picker */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Platform Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(
                    [
                      { id: 'sedan', label: 'Sedan / Coupe' },
                      { id: 'suv', label: 'SUV / 4x4' },
                      { id: 'sports', label: 'Sports Car' },
                      { id: 'exotic', label: 'Supercar' },
                      { id: 'truck', label: 'Truck / Pickup' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setVehicleCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-xs font-mono uppercase transition-colors ${
                        vehicleCategory === cat.id
                          ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white font-bold'
                          : 'bg-[#141A22] border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    placeholder="e.g. Porsche, BMW, Toyota"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. 911 GT3 (992)"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Model Year *</label>
                  <input
                    type="number"
                    min="1970"
                    max="2026"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  License Registration (Optional)
                </label>
                <input
                  type="text"
                  value={vehicleRegistration}
                  onChange={(e) => setVehicleRegistration(e.target.value)}
                  placeholder="e.g. ICT-GT3-992"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SERVICE SELECTION & ISSUE NOTES */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase mb-2">
                <Wrench className="w-4 h-4 text-[#00F0FF]" />
                <span>Step 3: Required Engineering Procedures</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {services.map((s) => {
                  const isChecked = selectedServiceIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#00F0FF]/10 border-[#00F0FF]/60 text-white'
                          : 'bg-[#141A22] border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#00F0FF] border-[#00F0FF] text-black' : 'border-zinc-700'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-black" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase font-heading">
                            {s.name}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400">
                            ~{s.durationMinutes} min • {s.category}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#00F0FF]">
                        {formatPKR(s.basePrice)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Observed Symptoms / Special Requests
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail any specific OBD fault codes, high-speed vibrations, track prep requirements..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="priority-check"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="w-4 h-4 accent-[#FF1E27]"
                />
                <label htmlFor="priority-check" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  Request Priority Express Bay Allocation (+20% surcharge)
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: DATE & REAL TIME SLOT SELECTION */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase">
                  <Clock className="w-4 h-4 text-[#00F0FF]" />
                  <span>Step 4: Select Workshop Bay & Time Slot</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Timezone: <span className="text-[#00F0FF] font-semibold">{timezoneInfo}</span>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Choose Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF] font-mono"
                />
              </div>

              {/* Real-time Slots Grid */}
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Available Bay Slots for {appointmentDate}
                </label>

                {loadingSlots ? (
                  <div className="p-8 text-center text-xs font-mono text-[#00F0FF] animate-pulse">
                    Querying workshop bay telemetry and concurrency locks...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-xs font-mono text-zinc-400">
                    No available bays for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlotTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlotTime(slot.time)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            !slot.available
                              ? 'bg-zinc-900/50 border-zinc-800 opacity-40 cursor-not-allowed text-zinc-500'
                              : isSelected
                              ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                              : 'bg-[#141A22] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div className="text-xs font-bold font-mono">{slot.time}</div>
                          <div className="text-[10px] font-mono mt-1">
                            {slot.available ? (
                              <span className="text-emerald-400">{slot.remainingBays} Bay(s) Open</span>
                            ) : (
                              <span className="text-zinc-500">Fully Booked</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW & CONFIRM */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase mb-2">
                <Shield className="w-4 h-4 text-[#00F0FF]" />
                <span>Step 5: Review & Confirm Bay Reservation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
                  <div className="text-[#00F0FF] uppercase font-bold mb-2">Customer & Slot</div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Driver:</span>
                    <span className="text-white">{customerName}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Contact:</span>
                    <span className="text-white">{customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Scheduled Slot:</span>
                    <span className="text-emerald-400 font-bold">{appointmentDate} @ {selectedSlotTime}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Timezone:</span>
                    <span className="text-zinc-300">{timezoneInfo}</span>
                  </div>
                </div>

                <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
                  <div className="text-[#00F0FF] uppercase font-bold mb-2">Vehicle Platform</div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Model:</span>
                    <span className="text-white font-bold">{vehicleYear} {vehicleMake} {vehicleModel}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Category:</span>
                    <span className="text-zinc-200 uppercase">{vehicleCategory}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Registration:</span>
                    <span className="text-zinc-200">{vehicleRegistration || 'Not Provided'}</span>
                  </div>
                  {isPriority && (
                    <div className="text-[#FF1E27] font-bold">
                      ★ Express Priority Lane Enabled
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Services List */}
              <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-4">
                <div className="text-xs font-mono uppercase text-zinc-400 mb-2">
                  Selected Procedures ({chosenServices.length}):
                </div>
                <div className="space-y-1.5">
                  {chosenServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs font-mono text-zinc-300">
                      <span>• {s.name} (~{s.durationMinutes} min)</span>
                      <span className="text-[#00F0FF]">{formatPKR(s.basePrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                Notice: Submitting will lock the workshop bay and generate your official Auto Craft 3D booking reference. You can cancel or reschedule through your dashboard at any time.
              </div>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono uppercase transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitBooking}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs sm:text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-50"
              >
                {submitting ? (
                  <span>Securing Bay Concurrency Lock...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Persist Appointment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
