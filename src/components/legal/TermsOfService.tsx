import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const TermsOfService: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-300">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>WORKSHOP AGREEMENT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
          Terms of Service & Engineering Warranty
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Effective Date: October 2026 • Auto Craft 3D Precision Performance Workshop
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed font-sans bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-10">
        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            1. Estimates vs. Binding Quotations
          </h2>
          <p>
            Calculations generated via the Auto Craft 3D Live Cost Estimator serve as itemized estimates based on standard factory labor times and component rates. A final legally binding repair order is executed only after on-site laser intake inspection and initial electronic diagnostic scan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            2. High-Performance Dyno & ECU Tuning Disclaimer
          </h2>
          <p>
            Dyno pulls and aftermarket ECU modifications are intended for sanctioned track competition or closed-course motorsport use. The owner confirms that engine mechanical integrity, cooling, and octane quality meet recommended tolerances prior to full throttle mapping runs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            3. Bay Scheduling & Concurrency Locks
          </h2>
          <p>
            Appointments reserve dedicated technician hours and equipment bay allocation. Clients requesting rescheduling or cancellation must do so at least 12 hours prior to the scheduled slot to avoid bay reservation forfeiture.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            4. Workmanship Guarantee
          </h2>
          <p>
            Mechanical assemblies, brake overhauls, and laser chassis geometry alignments performed by Auto Craft 3D carry a 12-month or 15,000 km warranty against craftsmanship defect, provided the vehicle is operated under manufacturer fluid guidelines.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-800">
          <button
            onClick={onBackHome}
            className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
          >
            Return to Workshop Home
          </button>
        </div>
      </div>
    </div>
  );
};
