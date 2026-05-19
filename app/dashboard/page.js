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
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Beranda" 
          breadcrumbs={['Beranda', 'Dashboard']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/60 via-slate-950/40 to-slate-900/60 p-8 sm:p-10 shadow-2xl">
            {/* Glowing spot decorative */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/5 rounded-full blur-[100px] pulsing-glow"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] block mb-2">
                Customer Portal
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Selamat Datang, Bapak/Ibu {profile?.name || 'Yahya Test Empat'}
              </h2>
              <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed font-medium">
                Membeli lahan pemakaman adalah keputusan yang bermakna. Silakan pilih cara yang paling nyaman untuk Anda melalui alur pembelian di bawah ini.
              </p>
            </div>
          </div>

          {/* TWO PARALLEL CARDS: PATH A & PATH B */}
          <div>
            <h3 className="text-base font-extrabold text-slate-400 uppercase tracking-widest mb-5 ml-1">
              Pilih Alur Pembelian
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* PATH A: LANGSUNG PESAN */}
              <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group border-t-2 border-t-emerald-500/50">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
                      Alur A
                    </span>
                    <CheckSquare size={22} className="text-emerald-400/80" />
                  </div>
                  
                  <h4 className="text-xl font-extrabold text-white mb-3">
                    Langsung Pesan Unit Makam
                  </h4>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                    Pilihan terbaik jika Anda ingin segera mengamankan kavling peristirahatan idaman langsung di sistem.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      'Bayar Booking Fee untuk transaksi unit',
                      'Ikuti Gathering Eksklusif (CG) Insira',
                      'Pilih kavling unit fisik makam Anda'
                    ].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs text-slate-300 font-semibold">
                        <span className="w-5.5 h-5.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/booking-fee"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-500/10 text-xs uppercase tracking-widest"
                >
                  <span>Bayar Booking Fee</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* PATH B: PELAJARI MAKAM */}
              <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group border-t-2 border-t-amber-400/50">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
                      Alur B
                    </span>
                    <Layers size={22} className="text-amber-400/80" />
                  </div>
                  
                  <h4 className="text-xl font-extrabold text-white mb-3">
                    Pelajari Makam Sebelum Membayar
                  </h4>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                    Pilihan terbaik jika Anda ingin menghadiri Customer Gathering terlebih dahulu sebelum memutuskan tipe unit.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      'Beli NUP (Nomor Urut Pemesanan)',
                      'Ikuti Gathering Eksklusif (CG) Insira',
                      'Lanjutkan proses pemesanan & unit'
                    ].map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-xs text-slate-300 font-semibold">
                        <span className="w-5.5 h-5.5 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/nup"
                  className="w-full gold-gradient gold-gradient-hover text-slate-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-500/10 text-xs uppercase tracking-widest"
                >
                  <span>Dapatkan NUP</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* EVENT CARD */}
          {event && (
            <div className="purple-glow-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[140%] bg-indigo-500/5 rounded-full blur-[80px]"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-xl">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    Event Terdekat Anda
                  </span>
                  <h4 className="text-xl font-extrabold text-white">
                    {event.title || 'CG Insira Memorial Park - Maret 2026'}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                    Pastikan kehadiran Anda di acara Customer Gathering eksklusif untuk mendapatkan informasi penawaran unit spesial dan pemilihan kavling utama.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-4 shrink-0 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Tanggal</span>
                      <span className="text-xs text-white font-extrabold">
                        {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '31 Mei 2026'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0">
                      <Clock size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Waktu</span>
                      <span className="text-xs text-white font-extrabold">{event.time || '08:52'} WIB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Lokasi</span>
                      <span className="text-xs text-white font-extrabold truncate max-w-[160px] block">{event.location || 'Ballroom Menara Top Food'}</span>
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
