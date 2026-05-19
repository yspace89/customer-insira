// components/Header.js
'use client';

import React from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { logout } from '@/lib/api';

export default function Header({ title, breadcrumbs = [], profile }) {
  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#060913]/60 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-20">
      {/* BREADCRUMB & TITLE */}
      <div className="flex flex-col">
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-0.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-amber-400/80' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* USER OPTIONS */}
      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS BELL */}
        <button className="relative w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-850 hover:border-amber-400/50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-amber-400 ring-4 ring-[#060913]"></span>
        </button>

        {/* PROFILE CHIP */}
        <div className="flex items-center gap-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-750 px-4 py-2 rounded-2xl transition-all duration-300 group cursor-pointer relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-900 font-bold overflow-hidden shadow-md">
            <User size={16} />
          </div>
          <div className="flex flex-col pr-1">
            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
              {profile?.name || 'Yahya Test Empat'}
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              Pembeli
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors" />

          {/* Simple Dropdown on hover */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg text-xs font-bold transition-all text-left"
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
