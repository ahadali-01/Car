import React, { useState } from 'react';
import { WorkshopService } from '../../types/index.js';
import { formatPKR } from '../../lib/pricing.js';
import { Search, Clock, CheckCircle2, Shield, ArrowRight, X, Cpu, Wrench } from 'lucide-react';

interface ServicesViewProps {
  services: WorkshopService[];
  onBookService: (serviceId: string) => void;
  onEstimateService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onBookService,
  onEstimateService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalService, setActiveModalService] = useState<WorkshopService | null>(null);

  const categories = ['ALL', 'Diagnostics', 'Performance', 'Mechanical', 'Body & Paint', 'Detailing', 'Electrical'];

  const filtered = services.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>FACTORY-CERTIFIED WORKSHOP ROSTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          WORKSHOP SERVICE <span className="text-[#00F0FF]">STATIONS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
          Select from our 11 factory-level diagnostic and engineering procedures. All work includes digital telemetry logs, calibrated Snap-On tooling, and manufacturer-grade lubricants.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-[#12161E] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search procedure, e.g. dyno, paint..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#12161E] border border-zinc-800 focus:border-[#00F0FF] text-white text-xs outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-[#10141B] border border-zinc-800 hover:border-[#00F0FF]/40 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  {service.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </div>

              <h3 className="text-xl font-heading font-black text-white group-hover:text-[#00F0FF] transition-colors mb-2">
                {service.name}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>

              {/* Supported Vehicle Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {service.supportedCategories.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-mono uppercase text-zinc-400 border border-zinc-800"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Features List */}
              <ul className="space-y-1.5 mb-6">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Price in PKR & CTAs */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                  BASE RATE
                </span>
                <span className="text-lg font-heading font-black text-white">
                  {formatPKR(service.basePrice)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                >
                  Full Specs
                </button>
                <button
                  onClick={() => onBookService(service.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-bold text-xs uppercase tracking-wider hover:opacity-95"
                >
                  Book Bay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModalService(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-[#12161E] border border-[#00F0FF]/30 rounded-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 text-[#00F0FF] text-[11px] font-mono uppercase">
                {activeModalService.category}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Duration: ~{activeModalService.durationMinutes} minutes
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mb-3">
              {activeModalService.name}
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-sans">
              {activeModalService.description}
            </p>

            <div className="bg-[#0A0D11] border border-zinc-800 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2 font-bold">
                INCLUDED METROLOGY & QUALITY CHECKS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {activeModalService.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                  BASE RATE (EXCL. TAX)
                </span>
                <span className="text-2xl font-heading font-black text-[#00F0FF]">
                  {formatPKR(activeModalService.basePrice)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const id = activeModalService.id;
                    setActiveModalService(null);
                    onEstimateService(id);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs"
                >
                  Custom Estimate
                </button>
                <button
                  onClick={() => {
                    const id = activeModalService.id;
                    setActiveModalService(null);
                    onBookService(id);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
