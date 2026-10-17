import React from 'react';
import { Logo } from './Logo.js';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, UserCheck } from 'lucide-react';

interface FooterProps {
  onOpenDeveloperModal: () => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDeveloperModal, onNavigate }) => {
  return (
    <footer className="relative bg-[#090B0E] border-t border-zinc-800/80 text-zinc-400 text-sm overflow-hidden z-10">
      {/* Subtle top cyan line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Creator Bio */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => onNavigate('home')} className="text-left focus:outline-none">
              <Logo />
            </button>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Pakistan’s premier high-precision automotive engineering studio. Computer diagnostics, dynamometer tuning, laser chassis alignment, and concours restoration.
            </p>

            {/* Prominent Visible Creator Credit Badge */}
            <div className="pt-2">
              <button
                onClick={onOpenDeveloperModal}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#12161D] hover:bg-[#181E27] border border-[#00F0FF]/30 hover:border-[#00F0FF]/60 transition-all text-left shadow-[0_0_15px_rgba(0,240,255,0.08)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    Lead Systems Architect
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                    Developed & Designed by Ahad Ali Nisar
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold mb-4">
              Workshop
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#00F0FF] transition-colors">
                  Services Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('estimator')} className="hover:text-[#00F0FF] transition-colors">
                  Live Cost Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-[#00F0FF] transition-colors">
                  Book Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#00F0FF] transition-colors">
                  Project Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-[#00F0FF] transition-colors">
                  Client Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & About */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold mb-4">
              Engineering
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#00F0FF] transition-colors">
                  About Our Facility
                </button>
              </li>
              <li>
                <button onClick={onOpenDeveloperModal} className="hover:text-[#00F0FF] transition-colors">
                  About Developer (Ahad Ali Nisar)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-[#00F0FF] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#00F0FF] transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold mb-4">
              Contact & Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <span>Plot 84, Industrial Triangle, Sector I-9/3, Islamabad</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>+92 51 8899221 / +92 300 0000000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span>service@autocraft3d.com</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-[11px] font-mono text-zinc-400">
                <Clock className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <div>Mon - Sat: 9:00 AM – 8:00 PM PKT</div>
                  <div>Sunday: 10:00 AM – 5:00 PM PKT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Exact Visible Creator Credit */}
        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AUTO CRAFT 3D. All rights reserved.</span>
          </div>

          {/* EXACT MANDATORY CREATOR PHRASE */}
          <div className="flex items-center gap-2 text-zinc-300">
            <span>Developed & Designed by</span>
            <button
              onClick={onOpenDeveloperModal}
              className="text-[#00F0FF] font-semibold hover:underline flex items-center gap-1 focus:outline-none"
            >
              Ahad Ali Nisar
            </button>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button onClick={() => onNavigate('privacy')} className="hover:text-zinc-200 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-zinc-200 transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
