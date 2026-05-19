// app/booking-fee/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getBookingFees } from '@/lib/api';
import { AlertCircle, Calendar, RefreshCcw, CheckCircle2, Search, X, Layers, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BookingFeePage() {
  const [profile, setProfile] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [selectedFee, setSelectedFee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const data = await getBookingFees();
        setFees(data);
      } catch (err) {
        console.error('Failed to load Booking Fee data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingPaymentsCount = fees.filter(f => (f.status || '') === 'Menunggu Pembayaran').length;

  const filteredFees = fees.filter(fee => 
    (fee.transaction_code || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetails = (fee) => {
    setSelectedFee(fee);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Booking Fee" 
          breadcrumbs={['Beranda', 'Booking Fee']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* PENDING PAYMENT WARNING BANNER */}
          {pendingPaymentsCount > 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-amber-950/20 p-4.5 flex items-center justify-between shadow-lg shadow-amber-500/5 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {pendingPaymentsCount} Transaksi Belum Terselesaikan
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Segera selesaikan pembayaran booking fee Anda untuk mengamankan antrean pemilihan unit.
                  </p>
                </div>
              </div>
              <Link 
                href="/pembayaran"
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* PAGE TITLE & SEARCH */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Daftar Transaksi Booking Fee
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Lacak riwayat transaksi uang muka (booking fee) yang telah Anda daftarkan.
              </p>
            </div>
            
            <div className="relative group w-72 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari no. transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold glow-input"
              />
            </div>
          </div>

          {/* LIST OF CARDS */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
              <Layers size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">Belum Ada Transaksi</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Anda tidak memiliki transaksi booking fee yang terdaftar.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredFees.map((fee) => (
                <div 
                  key={fee.id} 
                  className={`glass-card rounded-3xl p-6 border-t-4 flex flex-col justify-between gap-6 relative overflow-hidden ${
                    fee.status === 'Menunggu Pembayaran' 
                      ? 'border-t-amber-500' 
                      : 'border-t-emerald-500'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-xs font-black text-white tracking-wider bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
                        {fee.transaction_code}
                      </span>
                      
                      {fee.status === 'Menunggu Pembayaran' ? (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                          <RefreshCcw size={10} className="animate-spin duration-1000" />
                          Menunggu Pembayaran
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                          <CheckCircle2 size={10} />
                          Berhasil Dibayar
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4.5 pt-2">
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Tipe Unit</span>
                        <span className="text-xs text-white font-extrabold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                          {fee.unit_type || '-'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Sales Agent</span>
                        <span className="text-xs text-white font-extrabold">{fee.sales_name || '-'}</span>
                      </div>

                      <div>
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Gathering Event</span>
                        <span className="text-xs text-white font-extrabold truncate block max-w-[150px]">{fee.event_name || '-'}</span>
                      </div>

                      <div>
                        <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Tanggal Beli</span>
                        <span className="text-xs text-white font-extrabold">
                          {fee.created_at ? new Date(fee.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-900/50 flex gap-3 shrink-0">
                    {fee.status === 'Menunggu Pembayaran' ? (
                      <Link
                        href="/pembayaran"
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/5 uppercase tracking-widest transition-all active:scale-[0.98]"
                      >
                        <span>Bayar Booking Fee</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenDetails(fee)}
                          className="flex-1 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-black py-3 rounded-2xl cursor-pointer bg-slate-950/20 transition-all uppercase tracking-widest text-center"
                        >
                          Lihat Rincian
                        </button>
                        <Link
                          href="/select-unit/v2"
                          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black py-3 rounded-2xl flex items-center justify-center cursor-pointer transition-all uppercase tracking-widest text-center shadow-lg shadow-amber-500/5 active:scale-[0.98]"
                        >
                          Pilih Unit
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS MODAL */}
          {showModal && selectedFee && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-md w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Rincian Tipe Unit Terpilih
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-2xl">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">No. Transaksi</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">{selectedFee.transaction_code}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold py-1">
                      <span className="text-slate-400">Tipe Unit Terpilih:</span>
                      <span className="text-white font-extrabold">{selectedFee.unit_type || 'Single'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold py-1">
                      <span className="text-slate-400">Banyak Unit:</span>
                      <span className="text-white font-extrabold">{selectedFee.unit_qty || 0} Lahan</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold py-1">
                      <span className="text-slate-400">Harga Per Unit:</span>
                      <span className="text-white font-extrabold">
                        {selectedFee.units && selectedFee.units.length > 0
                          ? `Rp ${Number(selectedFee.units[0].amount).toLocaleString('id-ID')}`
                          : 'Rp 1.000.000'}
                      </span>
                    </div>
                    
                    <div className="h-px bg-slate-900 my-2"></div>

                    <div className="flex items-center justify-between text-xs font-bold pt-1">
                      <span className="text-slate-300">Total Pembayaran Booking Fee:</span>
                      <span className="text-amber-400 text-sm font-black">
                        Rp {(selectedFee.total || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-950/40 border-t border-slate-900">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest cursor-pointer border border-slate-800 transition-colors"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
