import React from 'react';
import { AlertTriangle, Home, Wrench } from 'lucide-react';

export const NotFoundView: React.FC<{ onBackHome: () => void; onExploreServices: () => void }> = ({
  onBackHome,
  onExploreServices,
}) => {
  return (
    <div className="py-24 sm:py-32 max-w-2xl mx-auto px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#FF1E27]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27] mx-auto mb-6 shadow-[0_0_40px_rgba(255,30,39,0.2)]">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-[#FF1E27] font-bold block mb-2">
        ERROR 404: SECTOR OFF-GRID
      </span>

      <h1 className="text-4xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight mb-4">
        PIT LANE NOT FOUND
      </h1>

      <p className="text-sm text-zinc-400 font-sans leading-relaxed mb-8 max-w-md mx-auto">
        The requested workshop bay, telemetry diagnostic route, or specification document does not exist or has been relocated to another garage bay.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onBackHome}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
        >
          <Home className="w-4 h-4" />
          <span>Return to Workshop Home</span>
        </button>
        <button
          onClick={onExploreServices}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase"
        >
          <Wrench className="w-4 h-4 text-[#00F0FF]" />
          <span>Explore Services Catalog</span>
        </button>
      </div>
    </div>
  );
};
