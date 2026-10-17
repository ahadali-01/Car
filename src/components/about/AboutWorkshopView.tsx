import React from 'react';
import { ShieldCheck, Cpu, Target, Award, Wrench, Users, CheckCircle2 } from 'lucide-react';

interface AboutWorkshopViewProps {
  onOpenDeveloperModal: () => void;
  onBookTour: () => void;
}

export const AboutWorkshopView: React.FC<AboutWorkshopViewProps> = ({ onOpenDeveloperModal, onBookTour }) => {
  const equipment = [
    {
      title: 'Hunter HawkEye Elite 3D Alignment',
      spec: '4-camera optical high-definition imaging measuring toe, camber, and thrust angle within 0.01° tolerance.',
    },
    {
      title: 'Mainline Pro AWD Dyno Cell',
      spec: 'Up to 2,400 WHP capacity with twin retarders, wideband AFR, exhaust gas temp (EGT), and boost logging.',
    },
    {
      title: 'Glasurit Climate-Controlled Down-Draft Booth',
      spec: 'Filtered positive-pressure baking chamber with computerized spectrophotometer OEM paint tint matching.',
    },
    {
      title: 'Snap-On Digital Metrology & Cleanroom',
      spec: 'ISO-calibrated torque wrenches with angular displacement tracking for engine block and cylinder head torquing.',
    },
  ];

  const engineers = [
    {
      name: 'Engr. Zohaib Abbasi',
      role: 'Chief Powertrain & Dyno Tuner',
      creds: '14+ years in standalone ECU mapping (Motec, Syvecs, Bosch Motorsport).',
    },
    {
      name: 'Tariq Mehmood',
      role: 'Master Coachbuilder & Paint Specialist',
      creds: 'Former Glasurit Certified Finish Master; specialist in multi-stage pearl and ceramic clears.',
    },
    {
      name: 'Kashif Raza',
      role: 'Senior Diagnostic Systems Engineer',
      creds: 'Certified in Porsche PIWIS III, BMW ISTA/P, and CAN-FD high-speed oscilloscope telemetry.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Target className="w-3.5 h-3.5" />
          <span>FACILITY ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
          ABOUT AUTO CRAFT 3D <span className="text-[#00F0FF]">WORKSHOP</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
          Established to bring motorsport-tier calibration, absolute transparency, and micron-level precision to exotic, sports, and luxury vehicles in Islamabad.
        </p>
      </div>

      {/* Facility Overview Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#10141B] border border-zinc-800 p-8 sm:p-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase mb-4">
              Where Motorsport Engineering Meets Cleanroom Discipline
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
              Auto Craft 3D was conceived as an antidote to traditional guesswork mechanics. Operating from a dedicated 12,000 sq ft climate-controlled facility in Sector I-9/3 Industrial Area, every bay is engineered around cleanroom floor finishes, overhead high-CRI lighting, and isolated exhaust evacuation ducts.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-6">
              From our dynamometer telemetry control room to the laser suspension alignment pit, every tool is calibrated against international metrology standards.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onBookTour}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
              >
                Schedule Vehicle Intake
              </button>
              <button
                onClick={onOpenDeveloperModal}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs"
              >
                About Developer (Ahad Ali Nisar)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-5">
              <div className="text-3xl font-heading font-black text-[#00F0FF]">12,000</div>
              <div className="text-xs font-mono uppercase text-zinc-400 mt-1">Sq Ft Cleanroom Facility</div>
            </div>
            <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-5">
              <div className="text-3xl font-heading font-black text-emerald-400">0.01 mm</div>
              <div className="text-xs font-mono uppercase text-zinc-400 mt-1">Laser Metrology Accuracy</div>
            </div>
            <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-5">
              <div className="text-3xl font-heading font-black text-[#FF1E27]">2,400 WHP</div>
              <div className="text-xs font-mono uppercase text-zinc-400 mt-1">AWD Dyno Capacity</div>
            </div>
            <div className="bg-[#141A22] border border-zinc-800 rounded-2xl p-5">
              <div className="text-3xl font-heading font-black text-white">100%</div>
              <div className="text-xs font-mono uppercase text-zinc-400 mt-1">Digital Telemetry Passports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Precision Machinery Roster */}
      <div className="mb-16">
        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight mb-6">
          CERTIFIED CALIBRATION EQUIPMENT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipment.map((eq, i) => (
            <div key={i} className="bg-[#10141B] border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                <h4 className="text-base font-heading font-bold text-white uppercase">{eq.title}</h4>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed pl-6">
                {eq.spec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Staff */}
      <div>
        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight mb-6">
          CHIEF WORKSHOP ENGINEERS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engineers.map((eng, i) => (
            <div key={i} className="bg-[#10141B] border border-zinc-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#00F0FF] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-bold text-white uppercase">{eng.name}</h4>
              <div className="text-xs font-mono text-[#00F0FF] mt-0.5 mb-2">{eng.role}</div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">{eng.creds}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
