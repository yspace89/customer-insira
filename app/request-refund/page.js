// app/request-refund/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile } from '@/lib/api';
import { Search, RefreshCcw, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function RequestRefundPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState('no');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Data Request Refund" 
          breadcrumbs={['Beranda', 'Request Refund']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* HEADER AND SEARCH BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Pengajuan Refund Anda
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Pantau pengajuan pengembalian dana (refund) untuk pemesanan NUP Anda yang dibatalkan.
              </p>
            </div>
            
            <div className="relative group w-72 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari refund..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold glow-input"
              />
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
            {/* Columns headers */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 select-none">
                    {[
                      { key: 'no', label: 'No' },
                      { key: 'nup', label: 'NUP' },
                      { key: 'nominal', label: 'Nominal' },
                      { key: 'status', label: 'Status' },
                      { key: 'alasan', label: 'Alasan Ditolak' }
                    ].map((col) => (
                      <th 
                        key={col.key} 
                        onClick={() => handleSort(col.key)}
                        className="px-6 py-4.5 font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-900/60 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.label}</span>
                          <ArrowUpDown size={12} className="text-slate-500" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state Row */}
                  <tr className="border-b border-slate-900 bg-transparent">
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="max-w-xs mx-auto flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
                          <Inbox size={20} />
                        </div>
                        <h4 className="text-sm font-bold text-white">Tidak Ada Data</h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                          Belum ada data request refund yang tercatat pada sistem kami.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PAGINATION PANEL */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-900 bg-slate-950/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Menampilkan</span>
                <select 
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-850 text-white text-xs font-bold rounded-xl px-2 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-slate-500 font-semibold">dari 0 baris</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled 
                  className="w-9 h-9 rounded-xl border border-slate-850 flex items-center justify-center text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  disabled 
                  className="w-9 h-9 rounded-xl border border-slate-850 flex items-center justify-center text-slate-600 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
