import React, { useState } from 'react';
import { GalleryItem } from '../../types/index.js';
import { ArrowRight, Sparkles, ExternalLink, X } from 'lucide-react';

interface FeaturedProjectsProps {
  items: GalleryItem[];
  onViewAllGallery: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ items, onViewAllGallery }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Take top 3 builds
  const displayItems = items.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
            FEATURED ENGINEERING <span className="text-[#00F0FF]">PROJECTS</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            Real performance vehicle builds, concours paint restorations, and bespoke calibrations documented step-by-step.
          </p>
        </div>

        <button
          onClick={onViewAllGallery}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-[#00F0FF] hover:text-white uppercase tracking-wider font-semibold group self-start md:self-auto"
        >
          <span>Explore Complete Gallery</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative bg-[#10141B] border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-[#00F0FF]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
          >
            <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
              <img
                src={item.afterImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10141B] via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#00F0FF] border border-[#00F0FF]/30">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-1">
                  {item.vehicleModel}
                </span>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#00F0FF] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-300">
                <span className="text-[#00F0FF] text-[11px] truncate max-w-[180px]">{item.specs}</span>
                <span className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors">
                  Details <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl bg-[#10141B] border border-[#00F0FF]/30 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
              aria-label="Close Project Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-72 sm:h-96 w-full relative">
              <img
                src={selectedItem.afterImage}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 text-[#00F0FF] text-[11px] font-mono uppercase">
                  {selectedItem.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Completed {selectedItem.completionDate}
                </span>
              </div>

              <h3 className="text-2xl font-heading font-black text-white mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-xs font-mono text-[#00F0FF] mb-4">
                Vehicle: {selectedItem.vehicleModel}
              </p>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-sans">
                {selectedItem.description}
              </p>

              <div className="bg-[#141A22] border border-zinc-800 rounded-xl p-4 mb-6">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  BUILD SPECIFICATION & TELEMETRY
                </span>
                <div className="text-sm font-mono text-white font-bold">
                  {selectedItem.specs}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
