import React, { useState } from 'react';
import { GalleryItem } from '../../types/index.js';
import { BeforeAfterSlider } from '../home/BeforeAfterSlider.js';
import { Sparkles, Sliders, X, ExternalLink, Calendar, Layers } from 'lucide-react';

interface GalleryViewProps {
  items: GalleryItem[];
}

export const GalleryView: React.FC<GalleryViewProps> = ({ items }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [sliderModalItem, setSliderModalItem] = useState<GalleryItem | null>(null);

  const categories = ['ALL', 'Custom Builds', 'Restoration', 'Performance', 'Detailing', 'Diagnostics'];

  const filtered = items.filter((item) => activeCategory === 'ALL' || item.category === activeCategory);

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROVEN MOTORSPORT METROLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          PROJECT GALLERY & <span className="text-[#00F0FF]">CASE ARCHIVES</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          High-resolution documentation of bespoke aerodynamics, dyno pulls, bare-metal restorations, and paint leveling.
        </p>
      </div>

      {/* Featured Interactive Comparison Slider */}
      <div className="mb-14">
        <BeforeAfterSlider
          beforeImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
          afterImage="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
          title="FEATURED: 1990 BMW E30 M3 SPORT EVOLUTION"
          subtitle="Rotisserie bare-metal restoration, 2.5L DTM S14 race motor build, and Glasurit Brilliant Red multi-layer cure."
          beforeLabel="FACTORY PATINA (OXIDIZED)"
          afterLabel="CONCOURS ROTISSERIE FINISH"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'bg-[#12161E] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-[#10141B] border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            {/* Image Preview with Hover Overlay */}
            <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
              <img
                src={item.afterImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10141B] via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase text-[#00F0FF] border border-[#00F0FF]/30">
                  {item.category}
                </span>
              </div>

              {/* Compare Button on Image */}
              <button
                onClick={() => setSliderModalItem(item)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-zinc-700 hover:border-[#00F0FF] text-white text-xs font-mono opacity-90 hover:opacity-100 transition-opacity"
              >
                <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Before / After</span>
              </button>
            </div>

            {/* Description */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>{item.vehicleModel}</span>
                  <span className="text-zinc-400">{item.completionDate}</span>
                </div>

                <h3
                  onClick={() => setSelectedItem(item)}
                  className="text-lg font-heading font-black text-white hover:text-[#00F0FF] cursor-pointer transition-colors mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[11px] font-mono text-[#00F0FF] truncate max-w-[200px]">
                  {item.specs}
                </div>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  title="View Build Specifications"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Before / After Slider Modal */}
      {sliderModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSliderModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-[#12161E] border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSliderModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <BeforeAfterSlider
              beforeImage={sliderModalItem.beforeImage}
              afterImage={sliderModalItem.afterImage}
              title={sliderModalItem.title}
              subtitle={`Vehicle Platform: ${sliderModalItem.vehicleModel} • ${sliderModalItem.specs}`}
              beforeLabel="INITIAL INTAKE STATE"
              afterLabel="POST-CALIBRATION CONCOURS SPEC"
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-[#12161E] border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 text-[#00F0FF] text-[11px] font-mono uppercase mb-3 inline-block">
              {selectedItem.category}
            </span>

            <h2 className="text-2xl font-heading font-black text-white uppercase mb-2">
              {selectedItem.title}
            </h2>
            <div className="text-xs font-mono text-zinc-400 mb-4">
              Platform: {selectedItem.vehicleModel} | Date: {selectedItem.completionDate}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-sans">
              {selectedItem.description}
            </p>

            <div className="bg-[#0A0D11] border border-zinc-800 rounded-xl p-4 mb-6">
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block mb-1">
                ENGINEERING SPECIFICATIONS
              </span>
              <span className="text-sm font-mono text-[#00F0FF] font-bold">
                {selectedItem.specs}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  const itm = selectedItem;
                  setSelectedItem(null);
                  setSliderModalItem(itm);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Open Comparison Slider</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
