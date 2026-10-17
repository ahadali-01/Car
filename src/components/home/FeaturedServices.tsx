import React from 'react';
import { WorkshopService } from '../../types/index.js';
import { formatPKR } from '../../lib/pricing.js';
import { ArrowRight, Cpu, Wrench, Shield, Sparkles, Clock } from 'lucide-react';

interface FeaturedServicesProps {
  services: WorkshopService[];
  onSelectService: (service: WorkshopService) => void;
  onExploreAll: () => void;
  onCalculateCost: (serviceId: string) => void;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  services,
  onSelectService,
  onExploreAll,
  onCalculateCost,
}) => {
  // Show top 6 active services
  const featured = services.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENGINEERING DIVISIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
            PRECISION PERFORMANCE <span className="text-[#00F0FF]">SERVICES</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
            From factory-level CAN-bus diagnostics to dyno-proven ECU calibrations and concourse detailing.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#00F0FF] hover:text-white uppercase tracking-wider font-semibold group self-start md:self-auto"
        >
          <span>View All 11 Specialized Services</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((service) => (
          <div
            key={service.id}
            className="group relative bg-[#10141B] border border-zinc-800/80 hover:border-[#00F0FF]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.08)]"
          >
            {/* Top Badge & Duration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-700/60">
                  {service.category}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{service.durationMinutes} mins</span>
                </div>
              </div>

              <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#00F0FF] transition-colors mb-2">
                {service.name}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Feature bullet highlights */}
              <ul className="space-y-1.5 mb-6">
                {service.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] mt-1.5 shrink-0" />
                    <span className="line-clamp-1">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Pricing in PKR & Action Buttons */}
            <div className="pt-4 border-t border-zinc-800/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  BASE RATE (PKR)
                </span>
                <span className="text-lg font-heading font-black text-white">
                  {formatPKR(service.basePrice)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCalculateCost(service.id)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                  title="Estimate with add-ons and vehicle type"
                >
                  Estimate
                </button>
                <button
                  onClick={() => onSelectService(service)}
                  className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-semibold transition-colors"
                >
                  Specs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
