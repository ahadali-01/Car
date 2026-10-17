import React, { useState, useEffect } from 'react';
import { User, Appointment, WorkshopService, ContactInquiry, AuditLog } from '../../types/index.js';
import { api } from '../../services/api.js';
import { formatPKR } from '../../lib/pricing.js';
import { Shield, Users, Calendar, DollarSign, Clock, Search, Filter, CheckCircle2, AlertTriangle, Eye, Wrench, RefreshCw, MessageSquare, ShieldCheck, X } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'inquiries' | 'audit'>('appointments');
  const [metrics, setMetrics] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // Edit service modal state
  const [editingService, setEditingService] = useState<WorkshopService | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);
  const [editSaving, setEditSaving] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [metricsRes, aptsRes, srvsRes, inqRes, auditRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAppointments(),
        api.getServices(),
        api.getContactInquiries(),
        api.getAuditLogs(),
      ]);
      setMetrics(metricsRes);
      setAppointments(aptsRes || []);
      setServices(srvsRes || []);
      setInquiries(inqRes || []);
      setAuditLogs(auditRes || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch admin telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      await api.updateAppointmentStatus(id, { status: newStatus });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setEditSaving(true);
    try {
      await api.updateService(editingService.id, {
        basePrice: editPrice,
        durationMinutes: editDuration,
      });
      setEditingService(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save service.');
    } finally {
      setEditSaving(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#FF1E27]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF1E27]">
              OPERATIONS COMMAND & WORKSHOP DISPATCH
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Master Workshop Admin Panel
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Superuser: {currentUser.name} ({currentUser.email})
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono uppercase transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#FF1E27]/15 border border-[#FF1E27]/40 text-xs font-mono text-[#FF1E27]">
          {errorMsg}
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Total Revenue (PKR)</span>
              <DollarSign className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div className="text-2xl font-heading font-black text-white">
              {formatPKR(metrics.totalRevenuePkr)}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">Confirmed & Active Jobs</div>
          </div>

          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Active Bay Jobs</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-heading font-black text-amber-400">
              {metrics.activeJobs}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1">Undergoing calibration</div>
          </div>

          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-zinc-400">Pending Bookings</span>
              <Clock className="w-4 h-4 text-[#FF1E27]" />
            </div>
            <div className="text-2xl font-heading font-black text-white">
              {metrics.pendingAppointments}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1">Awaiting technician assignment</div>
          </div>

          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-zinc-400">New Inquiries</span>
              <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div className="text-2xl font-heading font-black text-white">
              {metrics.newInquiries}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1">Customer messages logged</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
            activeTab === 'appointments'
              ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
              : 'bg-[#141A22] text-zinc-400 hover:text-white'
          }`}
        >
          Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
            activeTab === 'services'
              ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
              : 'bg-[#141A22] text-zinc-400 hover:text-white'
          }`}
        >
          Pricing & Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
            activeTab === 'inquiries'
              ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
              : 'bg-[#141A22] text-zinc-400 hover:text-white'
          }`}
        >
          Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
            activeTab === 'audit'
              ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
              : 'bg-[#141A22] text-zinc-400 hover:text-white'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS TABLE */}
      {activeTab === 'appointments' && (
        <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference, customer, vehicle make..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none font-mono focus:border-[#00F0FF]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141A22] text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Date / Slot</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-zinc-800/30">
                    <td className="p-3 font-bold text-[#00F0FF]">{apt.bookingReference}</td>
                    <td className="p-3">
                      <div className="text-white font-bold">{apt.customerName}</div>
                      <div className="text-[10px] text-zinc-400">{apt.customerPhone}</div>
                    </td>
                    <td className="p-3 uppercase">
                      <span className="text-white">{apt.vehicleYear} {apt.vehicleMake} {apt.vehicleModel}</span>
                      <span className="block text-[10px] text-zinc-400">{apt.vehicleCategory}</span>
                    </td>
                    <td className="p-3">
                      <div>{apt.appointmentDate}</div>
                      <div className="text-emerald-400">{apt.slotTime}</div>
                    </td>
                    <td className="p-3 font-bold text-white">{formatPKR(apt.estimatedPrice)}</td>
                    <td className="p-3">
                      <select
                        value={apt.status}
                        onChange={(e) => handleUpdateStatus(apt.id, e.target.value as any)}
                        className="px-2 py-1 rounded bg-[#0A0D11] border border-zinc-700 text-xs font-mono font-bold text-white outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedApt(apt)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES & PRICING CRUD */}
      {activeTab === 'services' && (
        <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-6">
            Workshop Services & Pricing Configuration
          </h3>

          <div className="space-y-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-[#141A22] border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-heading font-bold text-sm uppercase">{s.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-[#00F0FF]">{s.category}</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mt-1">
                    Duration: ~{s.durationMinutes} mins • Supported: {s.supportedCategories.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-zinc-400">Base Price (PKR)</div>
                    <div className="text-base font-heading font-bold text-white">{formatPKR(s.basePrice)}</div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingService(s);
                      setEditPrice(s.basePrice);
                      setEditDuration(s.durationMinutes);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/25 text-xs font-mono uppercase"
                  >
                    Edit Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-6">
            Direct Customer Intake Inquiries
          </h3>

          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-zinc-400">
              No inquiries logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-[#141A22] border border-zinc-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="text-white font-bold">{inq.name} ({inq.email})</div>
                    <div className="text-zinc-400">{inq.createdAt.split('T')[0]}</div>
                  </div>
                  <div className="text-xs font-mono text-[#00F0FF] mb-1">Subject: {inq.subject}</div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{inq.message}</p>
                  {inq.phone && <div className="text-[11px] font-mono text-zinc-400 mt-2">Phone: {inq.phone}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-6">
            Administrative Security Audit Trail
          </h3>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-[#141A22] border border-zinc-800/80 rounded-xl p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[#00F0FF] font-bold mr-2">[{log.action}]</span>
                  <span className="text-white">{log.details}</span>
                </div>
                <div className="text-[11px] text-zinc-400 whitespace-nowrap">
                  Admin: {log.adminEmail} • {log.timestamp.replace('T', ' ').substring(0, 19)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-[#12161E] border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-heading font-black text-white uppercase mb-2">
              Update {editingService.name}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mb-6">
              Changes update live calculations across the cost estimator and booking wizard.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Base Price in PKR *
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  step="5"
                  value={editDuration}
                  onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF] font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
                >
                  {editSaving ? 'Persisting...' : 'Save Service Rate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Inspection Modal */}
      {selectedApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedApt(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl bg-[#12161E] border border-zinc-700 rounded-3xl p-6 sm:p-8 text-xs font-mono shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApt(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-heading font-black text-white uppercase mb-4">
              Booking Telemetry #{selectedApt.bookingReference}
            </h3>

            <div className="bg-[#0A0D11] border border-zinc-800 rounded-2xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-zinc-400">
                <span>Customer:</span>
                <span className="text-white font-bold">{selectedApt.customerName} ({selectedApt.customerEmail})</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phone:</span>
                <span className="text-white">{selectedApt.customerPhone}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Vehicle:</span>
                <span className="text-white uppercase font-bold">{selectedApt.vehicleYear} {selectedApt.vehicleMake} {selectedApt.vehicleModel}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Scheduled:</span>
                <span className="text-emerald-400">{selectedApt.appointmentDate} @ {selectedApt.slotTime}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Amount:</span>
                <span className="text-[#00F0FF] font-bold">{formatPKR(selectedApt.estimatedPrice)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Status:</span>
                <span className="text-white font-bold">{selectedApt.status}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-zinc-400 uppercase mb-1 font-bold">Procedures:</div>
              <div className="text-white">{selectedApt.serviceNames.join(', ')}</div>
            </div>

            {selectedApt.notes && (
              <div className="mb-6">
                <div className="text-zinc-400 uppercase mb-1 font-bold">Customer Notes:</div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 italic">
                  "{selectedApt.notes}"
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
