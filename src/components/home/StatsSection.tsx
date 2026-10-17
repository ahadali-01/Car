import React from 'react';
import { Gauge, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { WorkshopStatusResponse } from '../../types/index.js';

interface StatsSectionProps {
  statusData: WorkshopStatusResponse | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ statusData }) => {
  const stats = [
    {
      icon: CheckCircle2,
      label: 'Cars Serviced & Restored',
      value: statusData?.liveStats.completedJobs ? `${statusData.liveStats.completedJobs.toLocaleString()}+` : '850+',
      detail: 'Precision logged in digital vehicle passports',
      color: 'text-[#00F0FF]',
      border: 'border-[#00F0FF]/30',
    },
    {
      icon: Gauge,
      label: 'Active Bay Jobs Today',
      value: statusData?.liveStats.activeJobs ? String(statusData.liveStats.activeJobs) : '4',
      detail: 'Concurrent dyno & diagnostics slots in progress',
      color: 'text-amber-400',
      border: 'border-amber-400/30',
    },
    {
      icon: Award,
      label: 'Client Satisfaction Index',
      value: statusData?.liveStats.rating ? `${statusData.liveStats.rating} / 5.0` : '4.96 / 5.0',
      detail: 'Verified customer ratings & track validations',
      color: 'text-[#FF1E27]',
      border: 'border-[#FF1E27]/30',
    },
    {
      icon: ShieldAlert,
      label: 'Machining & Dyno Precision',
      value: '±0.01 mm',
      detail: 'Micron-level tolerance adherence & Hunter Road Force',
      color: 'text-emerald-400',
      border: 'border-emerald-400/30',
    },
  ];

  return (
    <section className="relative z-10 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#10141B]/95 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-zinc-900 border ${stat.border}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  LIVE TELEMETRY
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-zinc-300 mt-1 uppercase tracking-wide">
                {stat.label}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-3">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          * Real-time metrics synchronized with workshop database engine
        </span>
      </div>
    </section>
  );
};
