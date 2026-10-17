import React from 'react';
import { Target, Gauge, Cpu, CheckSquare, ShieldCheck, Zap } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Micron-Level Metrology',
      desc: 'We utilize Hunter HawkEye Elite optical laser alignment and digital torque calibrators down to 0.01 mm tolerance.',
    },
    {
      icon: Gauge,
      title: 'Chassis Dynamometer Validation',
      desc: 'All engine mapping is verified through real-time AFR wideband telemetry, knock threshold monitoring, and manifold pressure sweeps.',
    },
    {
      icon: Cpu,
      title: 'OEM Diagnostic Protocols',
      desc: 'Direct factory interface equipment for Porsche PIWIS III, BMW ISTA/D, Mercedes Xentry, and Ross-Tech VCDS.',
    },
    {
      icon: ShieldCheck,
      title: 'Digital Vehicle Passports',
      desc: 'Every torque spec, diagnostic graph, and fluid batch number is cryptographically logged in your customer dashboard.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#0A0D11] border-y border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono text-[#FF1E27] uppercase mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>THE AUTO CRAFT 3D STANDARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
            WHY MOTORSPORT PURISTS TRUST US
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            No guesswork. No makeshift solutions. Pure automotive engineering calibrated for extreme performance and longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#12161E] border border-zinc-800/90 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00F0FF]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 flex items-center justify-center text-[#00F0FF] mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
