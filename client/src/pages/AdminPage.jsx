import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import { api } from '../utils/api';

const AUTH_STORAGE_KEY = 'zaib_admin_session_auth';

export default function AdminPage() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passcode) return;

    setVerifying(true);
    setErrorMsg('');

    try {
      // Direct client check & server-side verification
      if (passcode === 'Paki@123') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        setPasscode('');
        return;
      }

      // Try server verify endpoint as well
      const res = await api.verifyAdminPasscode(passcode);
      if (res.success) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        setPasscode('');
      } else {
        setErrorMsg(res.error || 'Incorrect master passcode. Access to Atelier Portal denied.');
      }
    } catch {
      setErrorMsg('Incorrect master passcode. Access to Atelier Portal denied.');
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    navigate('/');
  };

  // If authenticated, render full Admin Atelier
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-950">
        <AdminDashboard
          onClose={() => navigate('/')}
          onSelectPost={(slug) => navigate(`/blog/${slug}`)}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Security Passcode Lock Screen
  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Subtle gold atmospheric ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#121215] border border-gold-500/40 p-8 sm:p-10 shadow-2xl relative z-10 animate-fadeIn">
        
        {/* Monogram / Favicon Brand Icon */}
        <div className="text-center mb-6">
          <div className="inline-block relative">
            <img
              src="/favicon.png"
              alt="ZAIB ATTIRE"
              className="w-16 h-16 rounded-full border border-gold-500/50 p-2 bg-luxury-950 mx-auto shadow-xl object-contain"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold-500 text-luxury-950 flex items-center justify-center shadow-md">
              <Lock size={12} />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-bold block mb-1">
              RESTRICTED EDITORIAL VAULT
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ZAIB ATTIRE Portal
            </h2>
            <p className="text-xs text-luxury-400 mt-1 font-light">
              Master atelier passcode required to access editorial controls.
            </p>
          </div>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleUnlock} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert size={15} className="text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-luxury font-bold text-luxury-300 mb-1.5">
              Atelier Master Passcode
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/70">
                <KeyRound size={15} />
              </div>
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter master passcode..."
                className="w-full pl-10 pr-10 py-3 bg-[#18181d] border border-luxury-700 text-sm text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500 focus:bg-[#1f1f26] transition font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-white transition"
                title={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={verifying || !passcode}
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock size={13} />
            <span>{verifying ? 'Authenticating...' : 'Unlock Atelier Dashboard'}</span>
          </button>
        </form>

        {/* Back to Home Link */}
        <div className="mt-6 pt-6 border-t border-luxury-800 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-luxury-400 hover:text-gold-400 transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Return to Public Journal</span>
          </button>
        </div>

      </div>

      <div className="mt-8 text-center text-[10px] text-luxury-600 uppercase tracking-widest">
        ZAIB ATTIRE JOURNAL • SECURE EDITORIAL ATELIER
      </div>

    </div>
  );
}
