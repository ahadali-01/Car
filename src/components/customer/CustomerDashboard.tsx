import React, { useState, useEffect } from 'react';
import { User, Appointment, Vehicle } from '../../types/index.js';
import { api } from '../../services/api.js';
import { formatPKR } from '../../lib/pricing.js';
import { Car, Calendar, Clock, Wrench, AlertCircle, CheckCircle2, XCircle, Plus, Eye, X } from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: User;
  onBookNewSlot: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ currentUser, onBookNewSlot }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New vehicle modal state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState(2023);
  const [newReg, setNewReg] = useState('');
  const [newCat, setNewCat] = useState<'sedan' | 'suv' | 'sports' | 'exotic' | 'truck'>('sports');
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Cancel dialog
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptsRes, vehsRes] = await Promise.all([
        api.getAppointments(),
        api.apiRequest<{ vehicles: Vehicle[] }>('/api/vehicles').catch(() => ({ vehicles: [] })),
      ]);
      setAppointments(aptsRes || []);
      setVehicles(vehsRes.vehicles || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch customer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMake.trim() || !newModel.trim()) return;
    setSavingVehicle(true);
    try {
      await api.apiRequest('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify({
          make: newMake,
          model: newModel,
          year: newYear,
          registration: newReg,
          category: newCat,
        }),
      });
      setShowAddVehicle(false);
      setNewMake('');
      setNewModel('');
      setNewReg('');
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save vehicle.');
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelModalApt) return;
    setCancelling(true);
    try {
      await api.updateAppointmentStatus(cancelModalApt.id, {
        status: 'CANCELLED',
        cancellationReason: cancelReason || 'Customer requested cancellation via portal',
      });
      setCancelModalApt(null);
      setCancelReason('');
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  const upcomingApts = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING' || a.status === 'IN_PROGRESS');
  const pastApts = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-400 text-[10px] font-mono">CONFIRMED</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] font-mono">BAY ACTIVE</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-mono">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono">{status}</span>;
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF]">
              CUSTOMER GARAGE TELEMETRY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Account: {currentUser.email} • Driver Portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddVehicle(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Add Vehicle</span>
          </button>
          <button
            onClick={onBookNewSlot}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Workshop Bay</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#FF1E27]/15 border border-[#FF1E27]/40 text-xs font-mono text-[#FF1E27]">
          {errorMsg}
        </div>
      )}

      {/* Grid: Saved Vehicles & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Saved Vehicles (4 cols) */}
        <div className="lg:col-span-4 bg-[#10141B] border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-[#00F0FF]" />
              <span>Registered Garage</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              {vehicles.length} Vehicle(s)
            </span>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-zinc-400">
              No registered vehicles in your garage yet. Book an appointment to register automatically.
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#141A22] border border-zinc-800/80 rounded-2xl p-4 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-heading font-bold text-white uppercase">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-[#00F0FF]">
                      {v.category}
                    </span>
                  </div>
                  {v.registration && (
                    <div className="text-xs font-mono text-zinc-400">
                      Plate: <span className="text-zinc-200">{v.registration}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments (8 cols) */}
        <div className="lg:col-span-8 bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00F0FF]" />
              <span>Upcoming Scheduled Bay Reservations ({upcomingApts.length})</span>
            </h3>
          </div>

          {upcomingApts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <div className="text-sm font-heading text-zinc-300">No active bookings scheduled.</div>
              <p className="text-xs text-zinc-400 font-mono mt-1 mb-4">
                Reserve your calibration or diagnostic slot today.
              </p>
              <button
                onClick={onBookNewSlot}
                className="px-4 py-2 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingApts.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-[#141A22] border border-zinc-800/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#00F0FF]">
                        {apt.bookingReference}
                      </span>
                      {getStatusBadge(apt.status)}
                    </div>
                    <h4 className="text-base font-heading font-bold text-white uppercase">
                      {apt.vehicleYear} {apt.vehicleMake} {apt.vehicleModel}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                      <span className="text-emerald-400">Date: {apt.appointmentDate} @ {apt.slotTime}</span>
                      <span>•</span>
                      <span>{apt.serviceNames.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800 justify-between sm:justify-end">
                    <div className="text-right sm:mr-2">
                      <div className="text-[10px] font-mono uppercase text-zinc-400">Est. Quote</div>
                      <div className="text-sm font-mono font-bold text-white">{formatPKR(apt.estimatedPrice)}</div>
                    </div>

                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      title="Inspect Specification"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                      <button
                        onClick={() => setCancelModalApt(apt)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#FF1E27] text-zinc-400 hover:text-[#FF1E27] text-xs font-mono transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Service Records */}
      <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-zinc-400" />
          <span>Past Service History & Digital Passports ({pastApts.length})</span>
        </h3>

        {pastApts.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-zinc-400">
            No past appointment logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141A22] text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Services</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {pastApts.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-800/30">
                    <td className="p-3 font-bold text-[#00F0FF]">{a.bookingReference}</td>
                    <td className="p-3">{a.appointmentDate}</td>
                    <td className="p-3 uppercase text-white">{a.vehicleMake} {a.vehicleModel}</td>
                    <td className="p-3 truncate max-w-[200px]">{a.serviceNames.join(', ')}</td>
                    <td className="p-3 text-white font-bold">{formatPKR(a.estimatedPrice)}</td>
                    <td className="p-3">{getStatusBadge(a.status)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedAppointment(a)}
                        className="text-xs text-[#00F0FF] hover:underline"
                      >
                        View Passport
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAppointment(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-[#12161E] border border-zinc-700 rounded-3xl p-6 sm:p-8 text-xs font-mono shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#00F0FF] text-sm font-bold">{selectedAppointment.bookingReference}</span>
              {getStatusBadge(selectedAppointment.status)}
            </div>

            <h3 className="text-xl font-heading font-black text-white uppercase mb-4">
              Workshop Bay Dossier & Passport
            </h3>

            <div className="bg-[#0A0D11] border border-zinc-800 rounded-2xl p-4 space-y-2 mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Vehicle:</span>
                <span className="text-white font-bold uppercase">{selectedAppointment.vehicleYear} {selectedAppointment.vehicleMake} {selectedAppointment.vehicleModel} ({selectedAppointment.vehicleCategory})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Registration Plate:</span>
                <span className="text-zinc-200">{selectedAppointment.vehicleRegistration || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Scheduled Time:</span>
                <span className="text-emerald-400 font-bold">{selectedAppointment.appointmentDate} at {selectedAppointment.slotTime} PKT</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Duration:</span>
                <span className="text-zinc-200">~{selectedAppointment.estimatedDuration} minutes</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800">
                <span>Total Itemized Rate:</span>
                <span className="text-[#00F0FF] font-bold text-sm">{formatPKR(selectedAppointment.estimatedPrice)}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-zinc-400 uppercase mb-1 font-bold">Procedures Performed / Booked:</div>
              <ul className="space-y-1 text-zinc-300">
                {selectedAppointment.serviceNames.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedAppointment.notes && (
              <div className="mb-6">
                <div className="text-zinc-400 uppercase mb-1 font-bold">Driver Telemetry Notes:</div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 italic">
                  "{selectedAppointment.notes}"
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#12161E] border border-[#FF1E27]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-heading font-black text-white uppercase mb-2">
              Cancel Appointment {cancelModalApt.bookingReference}?
            </h3>
            <p className="text-xs text-zinc-400 font-sans mb-4">
              Canceling will release the workshop bay slot back to other drivers.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, track weekend postponed..."
                className="w-full px-3 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#FF1E27] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono"
              >
                Keep Booking
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelAppointment}
                className="px-5 py-2 rounded-xl bg-[#FF1E27] hover:bg-red-700 text-white text-xs font-bold uppercase"
              >
                {cancelling ? 'Releasing Bay...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#12161E] border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowAddVehicle(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-heading font-black text-white uppercase mb-4">
              Register Vehicle to Garage
            </h3>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Make *</label>
                <input
                  type="text"
                  required
                  value={newMake}
                  onChange={(e) => setNewMake(e.target.value)}
                  placeholder="e.g. Porsche, BMW"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="e.g. 911 Turbo S"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Year</label>
                  <input
                    type="number"
                    min="1970"
                    max="2026"
                    value={newYear}
                    onChange={(e) => setNewYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="sports">Sports</option>
                    <option value="exotic">Exotic</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Plate Number</label>
                <input
                  type="text"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  placeholder="e.g. ICT-911"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
                >
                  {savingVehicle ? 'Saving...' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
