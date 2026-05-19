// components/Header.js
'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { logout } from '@/lib/api';

export default function Header({ title, breadcrumbs = [], profile }) {
  return (
    <header className="h-16 lg:h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-10 sticky top-0 z-20">
      
      {/* LEFT: LOGO FOR MOBILE / BREADCRUMBS FOR DESKTOP */}
      <div className="flex items-center">
        {/* Mobile Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-950 fill-current">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
            </svg>
          </div>
          <span className="text-sm font-black text-[#0f294a] uppercase tracking-wider">
            Insira
          </span>
        </Link>
 
        {/* Desktop Breadcrumb & Title */}
        <div className="hidden lg:flex flex-col">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-0.5">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-amber-600' : 'text-slate-400'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="text-xl font-bold text-[#0f294a] tracking-tight">{title}</h1>
        </div>
      </div>
 
      {/* RIGHT: USER OPTIONS */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* NOTIFICATIONS BELL */}
        <button className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400/50 flex items-center justify-center text-slate-500 hover:text-[#0f294a] transition-all duration-300">
          <Bell size={16} className="lg:w-4.5 lg:h-4.5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white"></span>
        </button>
 
        {/* PROFILE CHIP */}
        <div className="flex items-center gap-2 lg:gap-3 bg-slate-55/80 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 lg:px-4 lg:py-2 rounded-xl lg:rounded-2xl transition-all duration-300 group cursor-pointer relative">
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg lg:rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-900 font-bold overflow-hidden shadow-md">
            <User size={14} className="lg:w-4" />
          </div>
          <div className="hidden sm:flex flex-col pr-1">
            <span className="text-[11px] lg:text-xs font-bold text-[#0f294a] group-hover:text-amber-600 transition-colors">
              {profile?.name || 'Yahya Test Empat'}
            </span>
            <span className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Pembeli
            </span>
          </div>
          <ChevronDown size={12} className="hidden sm:block text-slate-400 group-hover:text-[#0f294a] transition-colors" />
 
          {/* Simple Dropdown on hover */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-600 hover:text-red-650 hover:bg-red-50 rounded-lg text-xs font-bold transition-all text-left"
            >
              <LogOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
