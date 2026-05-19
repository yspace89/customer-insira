// app/login/page.js
'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Direct call to staging API
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan periksa kembali email & password Anda.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex selection:bg-amber-500/30 bg-[#040712] relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[140px] pulsing-glow"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[140px] pulsing-glow"></div>

      {/* LEFT COLUMN: Login Form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 z-10 py-12">
        <div className="max-w-[420px] w-full mx-auto">
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <span className="text-base font-black tracking-widest text-white">INSIRA</span>
              <span className="text-[8px] font-bold text-amber-400 tracking-[0.25em] uppercase block">MEMORIAL PARK</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Masuk untuk memantau status pemesanan, pembayaran, dan informasi unit makam keluarga Anda.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="text-xs font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                Email atau No. Whatsapp *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <Mail size={16} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-4 pl-12.5 pr-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all text-sm font-medium glow-input"
                  placeholder="email@example.com / 628..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Kata Sandi *
                </label>
                <a href="#" className="text-[10px] font-extrabold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <Lock size={16} strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-4 pl-12.5 pr-12 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all text-sm font-medium glow-input"
                  placeholder="Masukan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gold-gradient gold-gradient-hover text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-extrabold uppercase tracking-widest">Masuk Sekarang</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="text-xs text-slate-500 font-semibold">Belum punya akun?</span>
              <a href="#" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">Daftar Sekarang</a>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Premium Glowing Promo Display */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#060a16] relative flex-col justify-center items-center p-12 border-l border-slate-900 z-10">
        {/* Intricate decorative circle */}
        <div className="absolute w-[450px] h-[450px] rounded-full border border-slate-800/40 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-amber-400/10 flex items-center justify-center pulsing-glow"></div>
        </div>

        <div className="relative text-center max-w-[460px] mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mb-8 shadow-inner">
            <Sparkles size={28} className="text-amber-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
            Ketika Waktu Tiba, Pastikan Tempat Peristirahatan Sudah Siap.
          </h2>
          <p className="text-slate-400 mt-4.5 text-sm leading-relaxed font-medium">
            Kelola pemesanan lahan, pantau rincian pembayaran cicilan, dan akses layanan terbaik dari Insira Memorial Park dalam satu portal terintegrasi yang aman dan eksklusif.
          </p>

          <div className="mt-12 flex gap-1 items-center bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Protected Staging Environment
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.25em]">
          © 2026 INSIRA - MEMORIAL PARK. ALL RIGHTS RESERVED.
        </div>
      </div>
    </main>
  );
}
