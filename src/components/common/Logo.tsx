import React from 'react';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ compact = false, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-3 select-none group whitespace-nowrap shrink-0 ${className}`}
      aria-label="AUTO CRAFT 3D - Precision Performance Workshop"
      role="img"
    >
      {/* SVG Icon Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>AUTO CRAFT 3D - Precision Performance Workshop</title>
          <defs>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#A0AEC0" />
              <stop offset="70%" stopColor="#4A5568" />
              <stop offset="100%" stopColor="#CBD5E0" />
            </linearGradient>

            <linearGradient id="cyanNeon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#00A3FF" />
            </linearGradient>

            <linearGradient id="racingRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF333D" />
              <stop offset="100%" stopColor="#B30008" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal mechanical gear bezel */}
          <path
            d="M50 4 L88 25 L88 75 L50 96 L12 75 L12 25 Z"
            stroke="url(#chromeGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            className="opacity-90"
          />

          {/* Mechanical gear teeth notches */}
          <path d="M50 0 L50 8" stroke="#00F0FF" strokeWidth="2.5" />
          <path d="M50 92 L50 100" stroke="#00F0FF" strokeWidth="2.5" />
          <path d="M6 30 L14 34" stroke="#00F0FF" strokeWidth="2" />
          <path d="M86 66 L94 70" stroke="#00F0FF" strokeWidth="2" />
          <path d="M6 70 L14 66" stroke="#00F0FF" strokeWidth="2" />
          <path d="M86 34 L94 30" stroke="#00F0FF" strokeWidth="2" />

          {/* Precision inner telemetry circle */}
          <circle
            cx="50"
            cy="50"
            r="34"
            stroke="#1E242C"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Stylized aerodynamic GT supercar silhouette */}
          <path
            d="M20 58 C 24 58, 28 50, 36 46 C 44 42, 54 42, 64 46 C 72 50, 76 56, 80 58 L 84 62 L 16 62 Z"
            fill="url(#chromeGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Cockpit Canopy */}
          <path
            d="M38 46 C 44 38, 56 38, 62 46 Z"
            fill="#090B0E"
            stroke="#00F0FF"
            strokeWidth="1.5"
          />

          {/* Electric Cyan Aero Splitter & LED Headlight glow */}
          <path
            d="M16 61 L 28 61 L 34 57"
            stroke="url(#cyanNeon)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />

          {/* Racing Red GT Wing / Tail Accent */}
          <path
            d="M66 56 L 82 58 L 84 52"
            stroke="url(#racingRed)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Center 3D Apex Spark */}
          <polygon
            points="50,49 53,53 50,57 47,53"
            fill="#00F0FF"
          />
        </svg>

        {/* Ambient backglow */}
        <div className="absolute inset-0 bg-[#00F0FF]/15 rounded-full blur-md -z-10 group-hover:bg-[#00F0FF]/25 transition-colors" />
      </div>

      {/* Typography */}
      {!compact && (
        <div className="flex flex-col text-left shrink-0 whitespace-nowrap">
          <div className="flex items-center gap-1.5 leading-none whitespace-nowrap">
            <span className="font-heading font-black tracking-wider text-lg md:text-xl text-white whitespace-nowrap">
              AUTO CRAFT
            </span>
            <span className="font-heading font-black tracking-wider text-lg md:text-xl text-[#00F0FF] glow-cyan whitespace-nowrap">
              3D
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-mono text-zinc-400 font-medium mt-1 whitespace-nowrap">
            Precision Performance Workshop
          </span>
        </div>
      )}
    </div>
  );
};
