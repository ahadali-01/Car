import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-zinc-300">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>LEGAL COMPLIANCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Effective Date: October 2026 • Auto Craft 3D Precision Performance Workshop
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed font-sans bg-[#10141B] border border-zinc-800 rounded-3xl p-6 sm:p-10">
        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            1. Information Collection and Telemetry
          </h2>
          <p>
            Auto Craft 3D collects essential contact information (name, email address, telephone number) and vehicle technical data (vehicle identification numbers, ECU calibration dumps, dynamometer power curves, and alignment measurements) solely to perform authorized diagnostic, tuning, and restoration services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            2. Diagnostic & Dyno Data Retention
          </h2>
          <p>
            ECU telemetry files and diagnostic fault logs are stored securely to maintain your vehicle’s digital maintenance passport. We do not sell or monetize vehicle proprietary maps or customer contact details to third-party marketing entities.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            3. Authentication and Session Cookies
          </h2>
          <p>
            We use secure HTTP cookies and JSON Web Tokens (JWT) strictly for session authentication and role verification (Customer and Admin access). No tracking cookies are distributed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-heading font-bold text-white uppercase mb-2">
            4. Data Subject Rights
          </h2>
          <p>
            Clients may review, export, or request deletion of their vehicle service records by contacting the Chief Engineer at <strong className="text-[#00F0FF]">service@autocraft3d.com</strong> or through the Customer Garage Portal.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-800">
          <button
            onClick={onBackHome}
            className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
          >
            Return to Workshop Home
          </button>
        </div>
      </div>
    </div>
  );
};
