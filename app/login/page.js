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
    <main className="min-h-screen flex bg-white relative overflow-hidden">
      {/* LEFT COLUMN: Login Form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 z-10 py-12">
        <div className="max-w-[420px] w-full mx-auto">
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center">
              {/* Elegant insira logo star pattern */}
              <svg className="w-9 h-9 text-[#004b87]" viewBox="0 0 60 60" fill="currentColor">
                <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" />
                <circle cx="30" cy="30" r="4" fill="white" />
              </svg>
            </div>
            <div>
              <span className="text-base font-black tracking-widest text-[#004b87] block leading-none">INSIRA</span>
              <span className="text-[7px] font-bold text-slate-400 tracking-[0.28em] uppercase block mt-1">MEMORIAL PARK</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#004b87] tracking-tight">
              Masuk
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Masuk untuk mengelola pemesanan lahan, memantau status pembayaran, dan mengakses layanan terbaru dari Insira.
            </p>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-900 font-extrabold text-[10px] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#ea4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.93 1 12 1 7.37 1 3.4 3.66 1.48 7.54l3.77 2.92C6.18 7.42 8.87 5.04 12 5.04z" />
              <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.46c-.28 1.48-1.12 2.74-2.38 3.58v2.98h3.84c2.25-2.07 3.57-5.12 3.57-8.65z" />
              <path fill="#fbbc05" d="M5.25 14.54c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29L1.48 7.04C.54 8.94 0 11.08 0 13.33s.54 4.39 1.48 6.29l3.77-2.92z" />
              <path fill="#34a853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.84-2.98c-1.07.72-2.44 1.15-4.12 1.15-3.13 0-5.82-2.38-6.75-5.42L1.48 16.75C3.4 20.63 7.37 23 12 23z" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          {/* OR SEPARATOR */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-150"></div>
            <span className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">atau</span>
            <div className="flex-1 border-t border-slate-150"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-650 animate-in fade-in zoom-in-95 duration-300">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="text-xs font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-[#004b87] uppercase tracking-widest ml-1">
                Email atau No. Whatsapp *
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f0f4ff]/80 border border-slate-200/80 rounded-2xl py-4 px-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004b87]/15 focus:border-[#004b87] transition-all text-sm font-semibold"
                placeholder="email@example.com / 628..."
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-extrabold text-[#004b87] uppercase tracking-widest">
                  Kata sandi *
                </label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f0f4ff]/80 border border-slate-200/80 rounded-2xl py-4 pl-5 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004b87]/15 focus:border-[#004b87] transition-all text-sm font-semibold"
                  placeholder="Masukan kata sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-slate-400 hover:text-[#004b87] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <a href="#" className="text-[10px] font-extrabold text-[#004b87] hover:underline transition-all uppercase tracking-widest">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#004b87] hover:bg-[#003d70] text-white font-extrabold py-4 rounded-2xl flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-[#004b87]/10 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-xs font-black uppercase tracking-widest">Masuk Sekarang</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="text-xs text-slate-500 font-semibold">Belum punya akun?</span>
              <a href="#" className="text-xs font-bold text-[#004b87] hover:underline transition-all">Daftar Sekarang</a>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Premium Glowing Promo Display */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#004b87] relative flex-col justify-center items-center p-12 z-10 overflow-hidden">
        {/* Subtle geometric tiled overlay pattern */}
        <div className="absolute inset-0 opacity-[0.065]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L45 15 L30 30 L15 15 Z M30 30 L45 45 L30 60 L15 45 Z' fill='%23ffffff' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")` }}></div>

        <div className="relative text-center max-w-[460px] mx-auto flex flex-col items-center z-20">
          <div className="mb-8">
            <svg className="w-24 h-24 text-white" viewBox="0 0 60 60" fill="currentColor">
              <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" />
              <circle cx="30" cy="30" r="5" fill="#004b87" />
            </svg>
            <div className="mt-4">
              <span className="text-2xl font-black tracking-[0.2em] text-white block leading-none">INSIRA</span>
              <span className="text-[9px] font-bold text-white/60 tracking-[0.3em] uppercase block mt-1">MEMORIAL PARK</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
            Ketika Waktu Tiba, Pastikan Tempat Peristirahatan Sudah Siap.
          </h2>
          <p className="text-white/70 mt-4.5 text-sm leading-relaxed font-semibold">
            Kelola pemesanan lahan, pantau rincian pembayaran cicilan, dan akses layanan terbaik dari Insira Memorial Park dalam satu portal terintegrasi yang aman dan eksklusif.
          </p>

          <div className="mt-12 flex gap-2.5 items-center bg-[#003d70]/60 border border-white/10 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">
              Protected Staging Environment
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 text-[10px] text-white/40 font-bold uppercase tracking-[0.25em] z-20">
          © 2026 INSIRA - MEMORIAL PARK. ALL RIGHTS RESERVED.
        </div>
      </div>
    </main>
  );
}
