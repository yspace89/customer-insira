// app/dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getGatherings } from '@/lib/api';
import { Calendar, Clock, MapPin, ArrowRight, ShieldCheck, HelpCircle, Layers, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const events = await getGatherings();
        if (events && events.length > 0) {
          setEvent(events[0]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004b87]/20 border-t-[#004b87] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Beranda" 
          breadcrumbs={['Beranda', 'Dashboard']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-3xl border border-[#003d70] bg-gradient-to-r from-[#004b87] to-[#002544] p-8 sm:p-10 shadow-xl">
            {/* Elegant decorative curve lines overlay instead of gold pulsing glow */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_60%)]"></div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-[0.2em] block mb-2">
                Customer Portal
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Selamat Datang, Bapak/Ibu {profile?.name || 'Yahya Test Empat'}
              </h2>
              <p className="text-blue-100 mt-3 text-sm sm:text-base leading-relaxed font-medium">
                Membeli lahan pemakaman adalah keputusan yang bermakna. Silakan pilih cara yang paling nyaman untuk Anda melalui alur pembelian di bawah ini.
              </p>
            </div>
          </div>

          {/* QUICK ACCESS ACTIONS (MOBILE FIRST SLIDER) */}
          <div className="space-y-4">
            <h3 className="text-xs lg:text-sm font-extrabold text-slate-450 uppercase tracking-[0.2em] ml-1">
              Akses Cepat Layanan
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-4 sm:mx-0 sm:px-0 scrollbar-none">
              
              {/* Card 1: Bayar Tagihan */}
              <Link 
                href="/pembayaran"
                className="flex items-center gap-4 bg-white border border-slate-200/85 hover:border-[#004b87]/30 hover:bg-slate-50/80 p-4 rounded-2xl min-w-[250px] max-w-[290px] flex-1 shrink-0 group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25-9h16.5a1.5 1.5 0 011.5 1.5V17.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f294a] group-hover:text-[#004b87] transition-colors">Bayar Tagihan</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Selesaikan cicilan VA Anda</p>
                </div>
              </Link>

              {/* Card 2: Pilih Kapling */}
              <Link 
                href="/select-unit/v2"
                className="flex items-center gap-4 bg-white border border-slate-200/85 hover:border-[#004b87]/30 hover:bg-slate-50/80 p-4 rounded-2xl min-w-[250px] max-w-[290px] flex-1 shrink-0 group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-7.616-.445l.98-2.94a1.5 1.5 0 011.424-1.027h1.008a1.5 1.5 0 011.424 1.027l.98 2.94m-5.816 0h5.816m-5.816 0A1.5 1.5 0 007.5 10.5v7.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5m0 0H9.042m0 0L7.5 10.5" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f294a] group-hover:text-[#004b87] transition-colors">Pilih Kapling</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pilih kavling unit fisik makam</p>
                </div>
              </Link>

              {/* Card 3: Lengkapi KTP */}
              <Link 
                href="/verification"
                className="flex items-center gap-4 bg-white border border-slate-200/85 hover:border-[#004b87]/30 hover:bg-slate-50/80 p-4 rounded-2xl min-w-[250px] max-w-[290px] flex-1 shrink-0 group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f294a] group-hover:text-[#004b87] transition-colors">Lengkapi KTP</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Unggah berkas KTP & data diri</p>
                </div>
              </Link>

              {/* Card 4: Makam Saya */}
              <Link 
                href="/makam-saya"
                className="flex items-center gap-4 bg-white border border-slate-200/85 hover:border-[#004b87]/30 hover:bg-slate-50/80 p-4 rounded-2xl min-w-[250px] max-w-[290px] flex-1 shrink-0 group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-[#004b87] group-hover:bg-[#004b87] group-hover:text-white transition-all duration-300 shadow-inner shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0f294a] group-hover:text-[#004b87] transition-colors">Makam Saya</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Atur nama peruntukan makam</p>
                </div>
              </Link>

            </div>
          </div>

          {/* TWO PARALLEL CARDS: PATH A & PATH B */}
          <div>
            <h3 className="text-base font-extrabold text-[#0f294a] uppercase tracking-widest mb-5 ml-1">
              Pilih Alur Pembelian
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* PATH A: LANGSUNG PESAN */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between relative group border-t-4 border-t-emerald-500 shadow-md hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/50">
                      Alur A
                    </span>
                    <CheckSquare size={22} className="text-emerald-500/80" />
                  </div>
                  
                  <h4 className="text-xl font-extrabold text-slate-800 mb-3">
                    Langsung Pesan Unit Makam
                  </h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                    Pilihan terbaik jika Anda ingin segera mengamankan kavling peristirahatan idaman langsung di sistem.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      'Bayar Booking Fee untuk transaksi unit',
                      'Ikuti Gathering Eksklusif (CG) Insira',
                      'Pilih kavling unit fisik makam Anda'
                    ].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs text-slate-600 font-semibold">
                        <span className="w-5.5 h-5.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/booking-fee"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-600/10 text-xs uppercase tracking-widest"
                >
                  <span>Bayar Booking Fee</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* PATH B: PELAJARI MAKAM */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between relative group border-t-4 border-t-[#004b87] shadow-md hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#004b87] bg-[#f0f4ff] px-3.5 py-1.5 rounded-full border border-blue-100">
                      Alur B
                    </span>
                    <Layers size={22} className="text-[#004b87]/80" />
                  </div>
                  
                  <h4 className="text-xl font-extrabold text-slate-800 mb-3">
                    Pelajari Makam Sebelum Membayar
                  </h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                    Pilihan terbaik jika Anda ingin menghadiri Customer Gathering terlebih dahulu sebelum memutuskan tipe unit.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      'Beli NUP (Nomor Urut Pemesanan)',
                      'Ikuti Gathering Eksklusif (CG) Insira',
                      'Lanjutkan proses pemesanan & unit'
                    ].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs text-slate-600 font-semibold">
                        <span className="w-5.5 h-5.5 rounded-lg bg-[#f0f4ff] border border-blue-100 flex items-center justify-center text-[#004b87] shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/nup"
                  className="w-full bg-[#004b87] hover:bg-[#003d70] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-[#004b87]/10 text-xs uppercase tracking-widest"
                >
                  <span>Dapatkan NUP</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* EVENT CARD */}
          {event && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[140%] bg-indigo-500/5 rounded-full blur-[80px]"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-xl">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Event Terdekat Anda
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">
                    {event.title || 'CG Insira Memorial Park - Maret 2026'}
                  </h4>
                  <p className="text-slate-550 text-xs leading-relaxed font-semibold">
                    Pastikan kehadiran Anda di acara Customer Gathering eksklusif untuk mendapatkan informasi penawaran unit spesial dan pemilihan kavling utama.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-4 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tanggal</span>
                      <span className="text-xs text-slate-700 font-extrabold">
                        {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '31 Mei 2026'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <Clock size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Waktu</span>
                      <span className="text-xs text-slate-700 font-extrabold">{event.time || '08:52'} WIB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lokasi</span>
                      <span className="text-xs text-slate-700 font-extrabold truncate max-w-[160px] block">{event.location || 'Ballroom Menara Top Food'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
