import React from 'react';
import { Zap, Calendar, PhoneCall } from 'lucide-react';

interface PerformanceBannerProps {
  onBookNow: () => void;
  onContact: () => void;
}

export const PerformanceBanner: React.FC<PerformanceBannerProps> = ({ onBookNow, onContact }) => {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121620] via-[#1A2230] to-[#0D1016] border border-[#00F0FF]/30 p-8 sm:p-12 lg:p-16 shadow-[0_0_50px_rgba(0,240,255,0.12)]">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF1E27]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF] uppercase mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>TRACK SEASON PREPARATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight">
            DEMAND MORE FROM <span className="text-[#00F0FF]">YOUR ENGINE.</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 mt-4 leading-relaxed font-sans">
            Whether preparing for track day telemetry or looking for concourse-level restoration, our master technicians calibrate your vehicle to exacting tolerances.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onBookNow}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:opacity-95 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Workshop Slot</span>
            </button>
            <button
              onClick={onContact}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#141A22] hover:bg-[#1E2633] border border-zinc-700 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#00F0FF]" />
              <span>Consult Chief Engineer</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
