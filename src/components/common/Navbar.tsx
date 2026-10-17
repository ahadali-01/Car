import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.js';
import { User, OperationalStatus } from '../../types/index.js';
import { getWorkshopOperationalStatus } from '../../lib/pricing.js';
import { Menu, X, User as UserIcon, Calendar, Wrench, Shield, LogOut, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDeveloperModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenDeveloperModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [opStatus, setOpStatus] = useState<OperationalStatus>(getWorkshopOperationalStatus());

  useEffect(() => {
    // Check status every minute
    const timer = setInterval(() => {
      setOpStatus(getWorkshopOperationalStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'estimator', label: 'Cost Estimator' },
    { id: 'booking', label: 'Book Slot' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'Facility' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0F12]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleLinkClick('home')}
              className="focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded-lg p-1 shrink-0 whitespace-nowrap"
            >
              <Logo />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 glow-cyan'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Status Pill & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Operational Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono uppercase tracking-wider ${
                opStatus.isOpen
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
              }`}
              title={opStatus.nextChange}
            >
              <span
                className={`w-2 h-2 rounded-full ${opStatus.isOpen ? 'bg-emerald-400' : 'bg-zinc-500'}`}
              />
              <span className="font-bold">{opStatus.isOpen ? 'BAY ACTIVE' : 'WORKSHOP CLOSED'}</span>
            </div>

            {/* Auth Button or User Badge */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141A22] border border-zinc-700 hover:border-[#00F0FF]/50 text-xs font-mono text-zinc-200 transition-colors"
                >
                  {currentUser.role === 'ADMIN' ? (
                    <Shield className="w-3.5 h-3.5 text-[#FF1E27]" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-[#00F0FF]" />
                  )}
                  <span className="font-semibold truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                  {currentUser.role === 'ADMIN' && (
                    <span className="px-1.5 py-0.2 bg-[#FF1E27]/20 text-[#FF1E27] text-[9px] rounded font-bold">
                      ADMIN
                    </span>
                  )}
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141A22] hover:bg-[#1A222C] border border-zinc-700 hover:border-[#00F0FF]/50 text-xs font-bold font-heading uppercase tracking-wider text-white transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Book Now Primary Button */}
            <button
              onClick={() => handleLinkClick('booking')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Bay</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0A0C0F] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          {/* Status badge in mobile */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-800/80 text-xs font-mono">
            <span className="text-zinc-400">Workshop Status:</span>
            <span className={opStatus.isOpen ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
              {opStatus.statusText}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                  currentView === item.id
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                    : 'bg-[#12161E] text-zinc-300'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleLinkClick(currentUser.role === 'ADMIN' ? 'admin' : 'dashboard')}
                  className="w-full py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider"
                >
                  {currentUser.role === 'ADMIN' ? 'Admin Dashboard' : 'Customer Garage Dashboard'}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#141A22] border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider"
              >
                Sign In to Customer Portal
              </button>
            )}

            <button
              onClick={() => handleLinkClick('booking')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
            >
              Book Workshop Slot Now
            </button>

            <button
              onClick={() => {
                onOpenDeveloperModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-[11px] font-mono text-zinc-400 hover:text-[#00F0FF]"
            >
              Developed & Designed by Ahad Ali Nisar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
