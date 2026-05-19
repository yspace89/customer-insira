'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomBar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Don't show bottom bar on login page or home page
  if (pathname === '/login' || pathname === '/') return null;

  // Helper to check if a path is active
  const isActive = (path) => pathname === path;

  // Direct bottom bar menu items (excluding center FAB)
  const directItems = [
    {
      label: 'Beranda',
      href: '/dashboard',
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-5.5 h-5.5 transition-all duration-300 ${active ? 'text-[#004b87] scale-110' : 'text-slate-400'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      label: 'Booking',
      href: '/booking-fee',
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-5.5 h-5.5 transition-all duration-300 ${active ? 'text-[#004b87] scale-110' : 'text-slate-400'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3m-3-6h10.5m-13.5 9h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
        </svg>
      )
    },
    {
      label: 'Pilih Unit',
      href: '/select-unit/v2',
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-5.5 h-5.5 transition-all duration-300 ${active ? 'text-[#004b87] scale-110' : 'text-slate-400'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-7.616-.445l.98-2.94a1.5 1.5 0 011.424-1.027h1.008a1.5 1.5 0 011.424 1.027l.98 2.94m-5.816 0h5.816m-5.816 0A1.5 1.5 0 007.5 10.5v7.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5m0 0H9.042m0 0L7.5 10.5" />
        </svg>
      )
    },
    {
      label: 'Bayar',
      href: '/pembayaran',
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-5.5 h-5.5 transition-all duration-300 ${active ? 'text-[#004b87] scale-110' : 'text-slate-400'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25-9h16.5a1.5 1.5 0 011.5 1.5V17.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z" />
        </svg>
      )
    }
  ];

  // Secondary drawer menu items
  const drawerItems = [
    {
      label: 'Nomor Urut Pemesanan (NUP)',
      href: '/nup',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#004b87]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Request Refund',
      href: '/request-refund',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#004b87]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Verifikasi Data',
      href: '/verification',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#004b87]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      label: 'Makam Saya',
      href: '/makam-saya',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#004b87]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      label: 'Buyback Saya',
      href: '/buyback',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#004b87]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Main Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-16 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-40 flex justify-around items-center px-4 pb-safe shadow-2xl">
        
        {/* Left two items */}
        <div className="flex w-2/5 justify-around">
          {directItems.slice(0, 2).map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center py-1 group">
                <div className="relative">
                  {item.icon(active)}
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#004b87] rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${active ? 'text-[#0f294a] font-bold' : 'text-slate-500 group-hover:text-[#0f294a]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center Floating Action Button (FAB) */}
        <div className="relative flex justify-center items-center w-1/5">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`absolute -top-7 w-14 h-14 rounded-full bg-[#004b87] text-white flex items-center justify-center shadow-lg shadow-[#004b87]/15 active:scale-90 transition-all duration-200 border-4 border-white focus:outline-none z-50 ${isDrawerOpen ? 'rotate-45' : ''}`}
            aria-label="Menu Lainnya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-[10px] absolute top-8 font-semibold text-slate-500">
            Lainnya
          </span>
        </div>

        {/* Right two items */}
        <div className="flex w-2/5 justify-around">
          {directItems.slice(2, 4).map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center py-1 group">
                <div className="relative">
                  {item.icon(active)}
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#004b87] rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${active ? 'text-[#0f294a] font-bold' : 'text-slate-500 group-hover:text-[#0f294a]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-[#0f294a]/30 backdrop-blur-sm z-45 animate-fade-in"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer Modal Panel */}
      {isDrawerOpen && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-200 rounded-t-2xl z-50 p-6 pb-10 animate-slide-up flex flex-col shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Top Swipe Bar */}
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />

          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0f294a]">
                Menu Layanan Insira
              </h3>
              <p className="text-xs text-slate-500">
                Pilih menu di bawah untuk transaksi lengkap Anda
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Vertical Menu Items */}
          <div className="flex flex-col gap-3">
            {drawerItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${active ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg transition-colors duration-300 ${active ? 'bg-[#004b87]/10' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${active ? 'text-[#004b87] font-bold' : 'text-slate-600 group-hover:text-[#0f294a]'}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Chevron Right indicator */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={`w-4 h-4 transition-all duration-300 ${active ? 'text-[#004b87] translate-x-0.5' : 'text-slate-400 group-hover:text-[#0f294a] group-hover:translate-x-0.5'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
          
          {/* Footer Branding inside Drawer */}
          <div className="mt-8 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-450 font-bold">
              Insira Customer Portal v2.0
            </span>
          </div>
        </div>
      )}
    </>
  );
}
