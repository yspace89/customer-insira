// app/nup/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getNup } from '@/lib/api';
import { Search, ChevronRight, Layers, User, Calendar, Award, CheckCircle2, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function NupPage() {
  const [profile, setProfile] = useState(null);
  const [nupData, setNupData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const data = await getNup(page, 3, search);
        setNupData(data);
      } catch (err) {
        console.error('Failed to load NUP data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page, search]);

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24">
        <Header 
          title="Nomor Urut Pemesanan" 
          breadcrumbs={['Beranda', 'Nomor Urut Pemesanan']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
          {/* NUP BANNER CARD */}
          <div className="bg-[#004b87] border border-[#003d70] rounded-3xl p-6.5 sm:p-8 flex flex-col gap-4.5 shadow-xl relative overflow-hidden text-white">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2.5">
              <Ticket className="text-white" size={20} />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                NUP (Nomor Urut Pemesanan)
              </h2>
            </div>
            
            <p className="text-xs text-blue-100 leading-relaxed font-semibold max-w-3xl">
              NUP adalah nomor antrian pemesanan yang membantu Anda mendapatkan giliran secara adil saat memilih unit makam di Insira Memorial Park. Dapatkan NUP Anda hari ini untuk mengamankan lokasi kavling makam terbaik untuk keluarga tercinta.
            </p>
            
            <Link
              href="/buy-nup?menu=nup"
              className="bg-white hover:bg-blue-50 text-[#004b87] text-xs font-black px-6.5 py-3.5 rounded-2xl cursor-pointer w-fit uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-white/5 flex items-center gap-2"
            >
              <Ticket size={14} />
              <span>Beli NUP Sekarang</span>
            </Link>
          </div>

          {/* LIST TITLE & SEARCH BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-2">
                <span>Daftar NUP</span>
              </h3>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
              {/* Search */}
              <div className="relative group w-72">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#004b87] transition-colors" />
                <input
                  type="text"
                  placeholder="Cari transaksi NUP..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#004b87]/10 focus:border-[#004b87] transition-all font-semibold glow-input"
                />
              </div>
              
              {/* Beli NUP CTA */}
              <Link 
                href="/buy-nup?menu=nup"
                className="bg-[#004b87] hover:bg-[#003d70] text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-2 shadow-lg shadow-[#004b87]/5 uppercase tracking-widest transition-all hover:scale-[1.01]"
              >
                <Ticket size={14} />
                <span>Beli NUP Baru</span>
              </Link>
            </div>
          </div>

          {/* LIST OF CARDS */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#004b87]/20 border-t-[#004b87] rounded-full animate-spin"></div>
            </div>
          ) : (nupData?.items || []).length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
              <Layers size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">Belum Ada NUP</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Anda belum memiliki Nomor Urut Pemesanan aktif. Silakan dapatkan NUP untuk memulai perjalanan Anda.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {(nupData?.items || []).map((nup) => (
                <div 
                  key={nup.id} 
                  className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 border-l-4 border-l-[#004b87] relative overflow-hidden"
                >
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-black text-white tracking-wider bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                        NUP: {nup.nup_code}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                        <CheckCircle2 size={12} />
                        {nup.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Banyak Unit</span>
                        <span className="text-xs text-white font-extrabold">{nup.units_count} Lahan</span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Sales Agent</span>
                        <span className="text-xs text-white font-extrabold">{nup.sales_name || '-'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Gathering Event</span>
                        <span className="text-xs text-white font-extrabold truncate max-w-[120px] block" title={nup.event_name}>{nup.event_name || '-'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Tanggal Pembelian</span>
                        <span className="text-xs text-white font-extrabold">
                          {nup.created_at ? new Date(nup.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center lg:justify-end">
                    {!nup.has_booking_fee ? (
                      <Link
                        href="/booking-fee"
                        className="w-full lg:w-auto bg-[#004b87] hover:bg-[#003d70] text-white text-xs font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg shadow-[#004b87]/10 uppercase tracking-widest"
                      >
                        <span>Lanjutkan ke Booking Fee</span>
                        <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border border-slate-800 bg-slate-950/40 px-4.5 py-3 rounded-2xl">
                        Sudah Diproses Booking Fee
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && nupData.total > 3 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 ml-1">
              <span className="text-xs text-slate-500 font-semibold">
                Menampilkan {nupData.items?.length || 0} dari {nupData.total} transaksi NUP
              </span>
              
              <div className="flex items-center gap-1.5">
                {[...Array(Math.ceil(nupData.total / 3))].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 border cursor-pointer ${
                      page === idx + 1
                        ? 'custom-tab-active border-transparent'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white bg-slate-950/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
