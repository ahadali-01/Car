import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { User } from '../../types/index.js';
import { X, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await api.register(name, email, password, phone);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreFill = (role: 'admin' | 'client') => {
    if (role === 'admin') {
      setEmail('admin@autocraft3d.com');
      setPassword('AdminPass123!');
      setMode('login');
    } else {
      setEmail('client@autocraft3d.com');
      setPassword('ClientPass123!');
      setMode('login');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#10141B] border border-[#00F0FF]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
          aria-label="Close Authentication Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF]">
              SECURE TELEMETRY GATEWAY
            </span>
          </div>
          <h2 className="text-2xl font-heading font-black text-white uppercase">
            {mode === 'login' ? 'Customer & Admin Sign In' : 'Create Driver Account'}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-zinc-900 p-1 mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors ${
              mode === 'login'
                ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors ${
              mode === 'signup'
                ? 'bg-[#00F0FF] text-[#090B0E] font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Credentials */}
        <div className="mb-5 p-3 rounded-xl bg-[#141A22] border border-zinc-800">
          <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
            <span>Quick Demo Credentials:</span>
            <span className="text-emerald-400">Pre-Configured</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePreFill('client')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-[#00F0FF] border border-zinc-700 text-center transition-colors"
            >
              Client (Farhan T.)
            </button>
            <button
              type="button"
              onClick={() => handlePreFill('admin')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-[#FF1E27] border border-zinc-700 text-center transition-colors"
            >
              Master Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#FF1E27]/15 border border-[#FF1E27]/40 text-xs font-mono text-[#FF1E27]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Malik"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. client@autocraft3d.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-xs outline-none focus:border-[#00F0FF]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
