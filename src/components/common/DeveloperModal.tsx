import React from 'react';
import { X, Code2, Cpu, Wrench, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#0F1318] border border-[#00F0FF]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Neon Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00F0FF] via-[#FF1E27] to-[#00F0FF]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
          aria-label="Close Developer Profile Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1A222D] to-[#0A0D11] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Terminal className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                Principal Engineer & Architect
              </span>
            </div>
            <h2 id="dev-modal-title" className="text-2xl font-heading font-black text-white mt-1">
              Developed & Designed by Ahad Ali Nisar
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              Lead Software Architect | WebGL & Full-Stack Specialist
            </p>
          </div>
        </div>

        {/* Professional Biography */}
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans border-y border-zinc-800/80 py-4 my-4">
          <p>
            <strong className="text-white font-medium">Ahad Ali Nisar</strong> is a software engineer and digital systems architect specializing in high-performance WebGL graphics, modern full-stack web applications, and resilient digital architectures.
          </p>
          <p>
            For <strong className="text-[#00F0FF]">AUTO CRAFT 3D</strong>, Ahad engineered an end-to-end precision platform bridging interactive 3D WebGL vehicle metrology with real-time workshop booking, transactional concurrency control, itemized pricing mathematics, and administrative telemetry.
          </p>
          <p>
            The project pairs procedural geometric modeling and custom physically based rendering (PBR) shaders in Three.js with an industrial-grade dark automotive aesthetic, accessible human-centered UX, and deterministic server architecture.
          </p>
        </div>

        {/* Technical Architecture Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="bg-[#141A22] border border-zinc-800/80 rounded-xl p-3">
            <Cpu className="w-4 h-4 text-[#00F0FF] mb-1.5" />
            <div className="text-[11px] font-mono text-zinc-400 uppercase">3D Engine</div>
            <div className="text-xs font-bold text-white mt-0.5">Three.js Procedural</div>
          </div>
          <div className="bg-[#141A22] border border-zinc-800/80 rounded-xl p-3">
            <Code2 className="w-4 h-4 text-[#FF1E27] mb-1.5" />
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Full-Stack</div>
            <div className="text-xs font-bold text-white mt-0.5">React + Express TS</div>
          </div>
          <div className="bg-[#141A22] border border-zinc-800/80 rounded-xl p-3">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF] mb-1.5" />
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Security</div>
            <div className="text-xs font-bold text-white mt-0.5">JWT & Role RBAC</div>
          </div>
          <div className="bg-[#141A22] border border-zinc-800/80 rounded-xl p-3">
            <Wrench className="w-4 h-4 text-[#00F0FF] mb-1.5" />
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Precision</div>
            <div className="text-xs font-bold text-white mt-0.5">PKR Exact Pricing</div>
          </div>
        </div>

        {/* Footer Credit & Close */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Crafted with engineering rigor & motorsport passion</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 to-[#00A3FF]/20 hover:from-[#00F0FF]/30 hover:to-[#00A3FF]/30 border border-[#00F0FF]/40 text-white font-medium transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
