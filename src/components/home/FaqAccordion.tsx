import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does your live pricing estimator calculate rates in PKR?',
      a: 'Rates are calculated strictly using integer PKR arithmetic based on factory service books. We factor in your vehicle category (Sedan 1.0x, SUV 1.25x, Sports 1.45x, Exotic 2.1x), baseline labor minutes, proprietary lubricants (Motul/Liqui Moly), and optional express lane surcharges. You receive a guaranteed itemized breakdown before checkout.',
    },
    {
      q: 'Do you work on exotic supercars and European imports?',
      a: 'Yes. Our facility is engineered specifically for Porsche, BMW M, Mercedes-AMG, Audi RS, and Japanese performance platforms (GT-R, Supra, Type R). We maintain active OEM diagnostic licenses (PIWIS III, ISTA, Xentry) and down-draft paint facilities for exotic multi-layer finishes.',
    },
    {
      q: 'How do you prevent double-booking of workshop bays?',
      a: 'Our smart scheduler enforces server-side concurrency locks and atomic database checks. Each time slot has a strict 2-bay capacity limit. When you submit your booking, availability is re-verified instantly on the server before issuing your unique reference (e.g. AC3D-2026-XXXX).',
    },
    {
      q: 'What is included in the digital vehicle passport?',
      a: 'Every completed appointment generates a permanent cryptographic log containing: chassis laser alignment before/after measurements, dyno horsepower and torque curves, torque-wrench verification logs, OBD-II freeze-frame captures, and high-definition photos of all replaced components.',
    },
    {
      q: 'Can I reschedule or cancel my appointment?',
      a: 'Yes. Registered clients can manage upcoming appointments directly through their Customer Garage Dashboard. You can request a cancellation with a single click, and our intake team will synchronize your service schedule.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
          WORKSHOP PROTOCOLS & ANSWERS
        </h2>
        <p className="text-zinc-400 text-sm mt-2">
          Everything you need to know about our engineering standards, pricing, and scheduling.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#10141B] border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-heading font-bold text-white uppercase">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#00F0FF] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-zinc-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
