import React from 'react';
import { Search, Calculator, Wrench, CheckCircle } from 'lucide-react';

export const ProcessTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Digital Intake & Telemetry Scan',
      desc: 'Vehicle arrives at the clean intake bay. Master technician runs an OEM scan, live oscilloscope telemetry, and laser chassis geometry check.',
    },
    {
      num: '02',
      icon: Calculator,
      title: 'Itemized Transparent Scope',
      desc: 'You receive an exact digital breakdown with component part numbers, labor minutes, and fixed PKR pricing before any wrench is turned.',
    },
    {
      num: '03',
      icon: Wrench,
      title: 'Master Calibration & Craftsmanship',
      desc: 'Certified engineers execute work inside climate-controlled cleanrooms utilizing snap-on calibrated digital tools and factory manuals.',
    },
    {
      num: '04',
      icon: CheckCircle,
      title: 'Road Force & Dyno Sign-Off',
      desc: 'Final high-speed stability testing, Hunter Road Force wheel balancing, and dyno pull verification before issuing your digital passport.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <span>SYSTEMATIC WORKFLOW</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
          THE 4-STAGE PRECISION PROCESS
        </h2>
        <p className="text-zinc-400 text-sm mt-2">
          How every vehicle is inspected, engineered, and certified inside our facility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connecting line on desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00F0FF]/20 via-[#FF1E27]/20 to-[#00F0FF]/20 -z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative z-10 bg-[#10141B] border border-zinc-800 hover:border-[#00F0FF]/40 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-heading font-black text-[#00F0FF]/40">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-[#00F0FF]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-heading font-bold text-white mb-2 uppercase">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Protocol ISO-Certified</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
