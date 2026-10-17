import React, { useState, useMemo } from 'react';
import { WorkshopService } from '../../types/index.js';
import { calculateEstimate, formatPKR, CATEGORY_MULTIPLIERS, PricingAddon } from '../../lib/pricing.js';
import { Calculator, Check, Zap, AlertCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface CostEstimatorViewProps {
  services: WorkshopService[];
  preselectedServiceId?: string;
  onProceedToBooking: (config: {
    category: 'sedan' | 'suv' | 'sports' | 'exotic' | 'truck';
    serviceIds: string[];
    isPriority: boolean;
    make: string;
    model: string;
    year: number;
  }) => void;
}

const POPULAR_MAKES = [
  'Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda', 'Nissan', 'Ford', 'Ferrari', 'McLaren'
];

const AVAILABLE_ADDONS: PricingAddon[] = [
  { id: 'add_obd', name: 'OBD Telemetry Live Freeze-Frame Snapshot', pricePkr: 3500 },
  { id: 'add_nitrogen', name: 'High-Purity Dry Nitrogen Tire Inflation', pricePkr: 2000 },
  { id: 'add_ceramic', name: 'Ceramic Glass Hydrophobic Shield (Windshield)', pricePkr: 4500 },
  { id: 'add_spark', name: 'Borescope Cylinder Wall Camera Inspection', pricePkr: 5000 },
];

export const CostEstimatorView: React.FC<CostEstimatorViewProps> = ({
  services,
  preselectedServiceId,
  onProceedToBooking,
}) => {
  const [category, setCategory] = useState<'sedan' | 'suv' | 'sports' | 'exotic' | 'truck'>('sports');
  const [make, setMake] = useState('Porsche');
  const [model, setModel] = useState('911 Carrera');
  const [year, setYear] = useState(2023);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    preselectedServiceId ? [preselectedServiceId] : [services[0]?.id || 'srv_diag']
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isPriority, setIsPriority] = useState(false);

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

  // Toggle addon selection
  const toggleAddon = (id: string) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter((a) => a !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  // Real-time calculation using pure tested module
  const estimate = useMemo(() => {
    const matchedServices = services
      .filter((s) => selectedServiceIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        basePricePkr: s.basePrice,
        durationMinutes: s.durationMinutes,
      }));

    const matchedAddons = AVAILABLE_ADDONS.filter((a) => selectedAddonIds.includes(a.id));

    return calculateEstimate({
      category,
      services: matchedServices,
      addons: matchedAddons,
      isPriority,
    });
  }, [category, selectedServiceIds, selectedAddonIds, isPriority, services]);

  const handleTransferToBooking = () => {
    onProceedToBooking({
      category,
      serviceIds: selectedServiceIds,
      isPriority,
      make,
      model,
      year,
    });
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>TRANSPARENT METRIC PRICING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          LIVE WORKSHOP <span className="text-[#00F0FF]">COST ESTIMATOR</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Configure vehicle specifications, select required procedures, and inspect itemized PKR labor rates and timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Vehicle Platform & Category */}
          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              <span>1. Vehicle Category & Specifications</span>
            </h3>

            {/* Category Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5">
              {(
                [
                  { id: 'sedan', label: 'Sedan / Coupe', mul: '1.0x' },
                  { id: 'suv', label: 'SUV / 4x4', mul: '1.25x' },
                  { id: 'sports', label: 'Sports Car', mul: '1.45x' },
                  { id: 'exotic', label: 'Supercar / Exotic', mul: '2.1x' },
                  { id: 'truck', label: 'Truck / Pickup', mul: '1.35x' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    category === cat.id
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-[#141A22] border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold font-heading uppercase">{cat.label}</div>
                  <div className="text-[10px] font-mono text-[#00F0FF] mt-1">{cat.mul} Factor</div>
                </button>
              ))}
            </div>

            {/* Make / Model / Year Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Make</label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                >
                  {POPULAR_MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. M3 Competition"
                  className="w-full px-3 py-2 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Year</label>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A22] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          </div>

          {/* 2. Select Workshop Services */}
          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              <span>2. Select Procedures (Multi-Select)</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-mono">
              Combine diagnostic sweeps, fluid service, and tuning in one scheduled slot.
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2">
              {services.map((s) => {
                const isSelected = selectedServiceIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF]/50 text-white'
                        : 'bg-[#141A22] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-[#00F0FF] border-[#00F0FF] text-[#090B0E]' : 'border-zinc-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-heading uppercase text-white">
                          {s.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {s.category} • ~{s.durationMinutes} mins
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#00F0FF]">
                        {formatPKR(s.basePrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Add-ons & Priority */}
          <div className="bg-[#10141B] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-zinc-300 font-bold tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              <span>3. Optional Engineering Add-Ons</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF]/50'
                        : 'bg-[#141A22] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white font-heading">
                        {addon.name}
                      </span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-[#00F0FF] border-[#00F0FF] text-[#090B0E]' : 'border-zinc-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[#00F0FF]">
                      +{formatPKR(addon.pricePkr)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Priority Express Lane Toggle */}
            <div
              onClick={() => setIsPriority(!isPriority)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                isPriority
                  ? 'bg-[#FF1E27]/15 border-[#FF1E27]/50 text-white'
                  : 'bg-[#141A22] border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isPriority ? 'bg-[#FF1E27] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading uppercase text-white">
                    Priority Express Lane (+20% Base)
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans">
                    Immediate dedicated master bay allocation, priority telemetry report turnaround.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPriority}
                onChange={() => {}}
                className="w-4 h-4 accent-[#FF1E27]"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Card (5 cols sticky) */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-[#10141B] border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,240,255,0.12)]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00F0FF] tracking-widest block">
                  ITEMIZED SPECIFICATION
                </span>
                <h3 className="text-xl font-heading font-black text-white uppercase mt-0.5">
                  Cost Breakdown
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>~{estimate.totalDurationMinutes} mins</span>
              </div>
            </div>

            {/* Vehicle readout */}
            <div className="py-3 border-b border-zinc-800/80 text-xs font-mono text-zinc-300 flex justify-between">
              <span className="text-zinc-400">Target Vehicle:</span>
              <span className="font-bold text-white uppercase">{year} {make} {model} ({category})</span>
            </div>

            {/* Line items */}
            <div className="py-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Base Labor ({selectedServiceIds.length} services):</span>
                <span>{formatPKR(estimate.baseServicesTotalPkr)}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Category Factor ({category.toUpperCase()} - {estimate.categoryMultiplier}x):</span>
                <span className="text-zinc-200">
                  {formatPKR(estimate.categoryAdjustedTotalPkr - estimate.baseServicesTotalPkr)}
                </span>
              </div>

              {selectedAddonIds.length > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Engineering Add-ons ({selectedAddonIds.length}):</span>
                  <span>{formatPKR(estimate.addonsTotalPkr)}</span>
                </div>
              )}

              {isPriority && (
                <div className="flex justify-between text-[#FF1E27]">
                  <span>Priority Surcharge (20%):</span>
                  <span>+{formatPKR(estimate.prioritySurchargePkr)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800/60">
                <span>Subtotal:</span>
                <span className="text-white">{formatPKR(estimate.subtotalPkr)}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Provincial Service Tax (5%):</span>
                <span>{formatPKR(estimate.taxPkr)}</span>
              </div>
            </div>

            {/* Total Grand */}
            <div className="p-4 rounded-2xl bg-[#090C10] border border-zinc-800 mt-2 mb-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    TOTAL ESTIMATE (PKR)
                  </span>
                  <div className="text-2xl sm:text-3xl font-heading font-black text-[#00F0FF] glow-cyan mt-1">
                    {estimate.formattedGrandTotal}
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-zinc-400">
                  Includes Parts, Consumables & Lab Labor
                </div>
              </div>
            </div>

            {/* Disclaimer required by prompt */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 leading-relaxed mb-6">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Non-Binding Estimate:</strong> Final quotation is locked after physical vehicle laser intake inspection and OBD live scan. Prices configurable per parts requirements.
              </span>
            </div>

            {/* Action: Proceed to Booking */}
            <button
              onClick={handleTransferToBooking}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)]"
            >
              <span>Transfer Estimate to Booking Bay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
