// components/Sidebar.js
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Layers, 
  CheckSquare, 
  RefreshCcw, 
  HelpCircle, 
  ShieldCheck, 
  CreditCard, 
  Bookmark, 
  TrendingDown, 
  LogOut,
  User
} from 'lucide-react';
import { logout } from '@/lib/api';

const MENU_ITEMS = [
  { label: 'Beranda', path: '/dashboard', icon: Home },
  { label: 'Nomor Urut Pemesanan', path: '/nup', icon: Layers },
  { label: 'Booking Fee', path: '/booking-fee', icon: CheckSquare },
  { label: 'Request Refund', path: '/request-refund', icon: RefreshCcw },
  { label: 'Pilih Unit', path: '/select-unit/v2', icon: HelpCircle },
  { label: 'Verifikasi Data', path: '/verification', icon: ShieldCheck },
  { label: 'Pembayaran', path: '/pembayaran', icon: CreditCard },
  { label: 'Makam Saya', path: '/makam-saya', icon: Bookmark },
  { label: 'Buyback Saya', path: '/buyback', icon: TrendingDown },
];

export default function Sidebar({ profile }) {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen fixed top-0 left-0 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 p-6 hidden lg:flex flex-col z-30 justify-between">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            {/* Geometric Octagram SVG */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-900 font-bold" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-black tracking-widest text-white flex items-center">
              INSIRA
            </div>
            <div className="text-[9px] font-bold text-amber-400 tracking-[0.25em] uppercase">
              MEMORIAL PARK
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/5 text-amber-400 border-l-4 border-amber-400 shadow-md shadow-amber-500/5 pl-5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 pl-4'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
                  }`} 
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER PROFILE INFO & LOGOUT */}
      <div className="border-t border-slate-800/80 pt-6">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-amber-400" />
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-white truncate">
              {profile?.name || 'Yahya Test Empat'}
            </h4>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Customer Portal
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl text-sm font-semibold transition-all duration-300 group border border-transparent hover:border-red-900/30"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
