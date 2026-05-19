// app/pembayaran/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getPayments } from '@/lib/api';
import { CreditCard, Search, ArrowRight, ShieldCheck, ShieldAlert, Award, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function PembayaranPage() {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const data = await getPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payments data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPayments = payments.filter(pay => 
    (pay.transaction_code || '').toLowerCase().includes(search.toLowerCase())
  );

  const pastDuePaymentsCount = payments.filter(pay => (pay.status || '').includes('Jatuh Tempo')).length;

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Pembayaran" 
          breadcrumbs={['Beranda', 'Pembayaran']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* PAST DUE WARNING ALERT */}
          {pastDuePaymentsCount > 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/20 via-red-900/10 to-red-950/20 p-4.5 flex items-center justify-between shadow-lg shadow-red-500/5 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {pastDuePaymentsCount} Tagihan Mengalami Keterlambatan
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Terdapat cicilan angsuran yang telah melewati batas jatuh tempo. Selesaikan sekarang untuk menghindari denda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE ACTIONS AND TITLE */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Daftar Tagihan & Cicilan
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Pantau tagihan aktif, tenor cicilan, sisa tagihan pelunasan, serta riwayat pembayaran Anda.
              </p>
            </div>
            
            <div className="relative group w-72 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari no. transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold glow-input"
              />
            </div>
          </div>

          {/* LIST GRID */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
              <CreditCard size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">Belum Ada Pembayaran</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Tidak ada data penagihan atau cicilan aktif yang terdaftar untuk akun Anda.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPayments.map((pay) => {
                const isPaid = pay.status === 'Tagihan Lunas';
                return (
                  <div 
                    key={pay.id}
                    className={`glass-card rounded-3xl p-6.5 border-t-4 flex flex-col justify-between gap-6 relative overflow-hidden ${
                      isPaid ? 'border-t-emerald-500' : 'border-t-red-500'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-xs font-black text-white tracking-wider bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
                          {pay.transaction_code}
                        </span>
                        
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            <ShieldCheck size={10} />
                            Tagihan Lunas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            <ShieldAlert size={10} />
                            1 Tagihan Jatuh Tempo
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-slate-900/40">
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Jumlah Unit</span>
                          <span className="text-xs text-white font-extrabold">{pay.units_count || 0} Lahan</span>
                        </div>
                        
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Tenor Angsuran</span>
                          <span className="text-xs text-white font-extrabold">{pay.tenor_months || 0} Bulan</span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Total Tagihan</span>
                          <span className={`text-xs font-black ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {(pay.total_bill || 0) === 0 ? 'Rp 0 (Lunas)' : `Rp ${(pay.total_bill || 0).toLocaleString('id-ID')}`}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Prosesi Terbeli</span>
                          <span className="text-xs text-white font-extrabold truncate block max-w-[150px]">{pay.procession_packages || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Select */}
                    <div className="shrink-0 pt-2 border-t border-slate-900">
                      <Link 
                        href={`/pembayaran/${pay.id}`}
                        className={`w-full font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                          isPaid 
                            ? 'border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white bg-slate-950/20'
                            : 'gold-gradient gold-gradient-hover text-slate-950 shadow-lg shadow-amber-500/5 font-black'
                        }`}
                      >
                        <span>Selengkapnya</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
