import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { getWorkshopOperationalStatus } from '../../lib/pricing.js';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Compass, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const opStatus = getWorkshopOperationalStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.submitContact({
        name,
        email,
        phone,
        subject,
        message,
      });

      setStatusMessage({ type: 'success', text: res.message });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to submit message.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>DIRECT INTAKE DESK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          CONTACT & <span className="text-[#00F0FF]">WORKSHOP LOCATION</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Connect directly with our Chief Engineer or visit our cleanroom facility in Islamabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <h2 className="text-xl font-heading font-black text-white uppercase mb-2">
            Send an Engineering Inquiry
          </h2>
          <p className="text-xs font-mono text-zinc-400 mb-6">
            Inquiries are routed directly to the workshop floor for technical assessment.
          </p>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs font-mono ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400'
                  : 'bg-[#FF1E27]/15 border border-[#FF1E27]/40 text-[#FF1E27]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daniyal Aslam"
                className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. daniyal@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Dyno tuning inquiry for Toyota Supra MK5"
                className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                Message / Vehicle Specifics *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe modifications, diagnostic issues, or desired performance targets..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting to Workshop...' : 'Send Inquiry Message'}</span>
            </button>
          </form>
        </div>

        {/* Location & Operating Hours Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Operational Status Card */}
          <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                LIVE OPERATIONAL STATUS
              </span>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                  opStatus.isOpen
                    ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${opStatus.isOpen ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                <span>{opStatus.statusText}</span>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-300 space-y-1">
              <div>Current Timezone: <strong className="text-white">{opStatus.timezone}</strong></div>
              <div>Schedule: <strong className="text-[#00F0FF]">{opStatus.nextChange}</strong></div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold font-heading">Auto Craft 3D Facility</div>
                  <div className="text-zinc-400">Plot 84, Industrial Triangle, Sector I-9/3, Islamabad, Pakistan</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="text-zinc-300 font-mono">+92 51 8899221 / +92 300 0000000</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="text-zinc-300 font-mono">service@autocraft3d.com</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div className="text-zinc-400 font-mono">
                  <div>Mon - Sat: 9:00 AM – 8:00 PM PKT</div>
                  <div>Sunday: 10:00 AM – 5:00 PM PKT (Emergency Diagnostics)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="bg-[#10141B] border border-zinc-800 rounded-3xl p-6 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                PRECISION WORKSHOP COORDINATES
              </span>
              <span className="text-[10px] font-mono text-[#00F0FF]">33.6698° N, 73.0543° E</span>
            </div>

            {/* Stylized Dark Blueprint Vector Map */}
            <div className="relative h-48 w-full rounded-2xl bg-[#090C10] border border-zinc-800 overflow-hidden flex items-center justify-center group">
              {/* Grid Roads */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* Road lines */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-zinc-800/80 -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-zinc-800/80" />
              <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-zinc-800/60" />

              {/* Marker pin for Workshop */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#00F0FF] border-2 border-white shadow-[0_0_25px_#00F0FF] flex items-center justify-center text-black font-black text-xs animate-bounce">
                  3D
                </div>
                <div className="mt-1 px-3 py-1 rounded-md bg-black/90 border border-[#00F0FF]/40 text-[10px] font-mono text-white font-bold whitespace-nowrap shadow-md">
                  AUTO CRAFT 3D INTAKE BAY
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Security Gated Access • Valet Parking</span>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#00F0FF] hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
