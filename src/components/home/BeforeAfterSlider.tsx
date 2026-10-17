import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles, ShieldCheck } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  afterImage = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  beforeLabel = 'UNRESTORED (OXIDIZED CLEARCOAT & STONE CHIPS)',
  afterLabel = 'CONCOURS 9H CERAMIC RESTORATION',
  title = 'PRECISION RESTORATION & LEVELING METROLOGY',
  subtitle = 'Drag the slider to examine bare-metal paint restoration and laser paint-leveling results.',
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="w-full bg-[#090B0E] border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 my-8">
      <div className="max-w-4xl mx-auto mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Concours Finishing Lab</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight uppercase">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 mt-2">
          {subtitle}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-zinc-700/80 shadow-2xl"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Base full width) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* BEFORE IMAGE (Clipped to slider percentage) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
            loading="lazy"
          />
        </div>

        {/* Vertical Divider Line with Cyan Neon Glow */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0D0F12] border-2 border-[#00F0FF] shadow-[0_0_20px_#00F0FF] flex items-center justify-center text-white">
            <Sliders className="w-4 h-4 text-[#00F0FF] rotate-90" />
          </div>
        </div>

        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700 text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-[#00F0FF]/20 backdrop-blur-md border border-[#00F0FF]/40 text-[11px] font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
            {afterLabel}
          </span>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-400">
            ↔ Drag divider to inspect paint depth & clarity
          </div>
        </div>
      </div>
    </div>
  );
};
