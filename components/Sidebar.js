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
    <aside className="w-80 h-screen fixed top-0 left-0 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col z-30 justify-between">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-[#004b87] flex items-center justify-center shadow-lg shadow-[#004b87]/15">
            {/* Geometric Custom Gold Star SVG inside white circle or direct */}
            <svg className="w-6 h-6 text-[#fabc0c]" viewBox="0 0 60 60" fill="currentColor">
              <path d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z" />
              <circle cx="30" cy="30" r="4" fill="white" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-black tracking-widest text-[#004b87] flex items-center">
              INSIRA
            </div>
            <div className="text-[9px] font-bold text-[#fabc0c] tracking-[0.25em] uppercase">
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
                    ? 'bg-[#004b87]/10 text-[#004b87] border-l-4 border-[#004b87] shadow-sm pl-5'
                    : 'text-slate-500 hover:text-[#004b87] hover:bg-slate-50 pl-4'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-[#004b87]' : 'text-slate-400 group-hover:text-[#004b87]'
                  }`} 
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER PROFILE INFO & LOGOUT */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-[#004b87]" />
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold text-[#004b87] truncate">
              {profile?.name || 'Yahya Test Empat'}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Customer Portal
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all duration-300 group border border-transparent hover:border-red-200"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
