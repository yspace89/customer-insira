// app/buyback/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile } from '@/lib/api';
import { TrendingDown, HelpCircle } from 'lucide-react';

export default function BuybackPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24">
        <Header 
          title="Buyback Saya" 
          breadcrumbs={['Beranda', 'Buyback Saya']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8 flex flex-col justify-center">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-6 shadow-inner">
                <TrendingDown size={28} />
              </div>
              <h3 className="text-lg font-bold text-white">Belum Ada Pengajuan Buyback</h3>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed font-semibold">
                Fitur Buyback (penjualan kembali unit makam) memungkinkan Anda mengajukan pencairan unit yang telah dilunasi sesuai syarat dan ketentuan yang berlaku. Saat ini Anda belum memiliki pengajuan buyback.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
