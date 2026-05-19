// app/select-unit/v2/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getUnitSelectionList } from '@/lib/api';
import { AlertTriangle, Plus, ChevronRight, CheckSquare, Layers, HelpCircle, X, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SelectUnitPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bisa'); // 'bisa' or 'belum'
  const [unitsData, setUnitsData] = useState({ bisa_memilih: [], belum_bisa_memilih: [] });

  // Modal states
  const [selectedUnitsList, setSelectedUnitsList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const data = await getUnitSelectionList();
        setUnitsData(data);
      } catch (err) {
        console.error('Failed to load unit selection:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenUnitsList = (otherUnits) => {
    setSelectedUnitsList(otherUnits);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24">
        <Header 
          title="Pilih Unit" 
          breadcrumbs={['Beranda', 'Pilih Unit']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* HEADER SECTION */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Pemilihan Unit Lahan
            </h2>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Pilih dan amankan kapling fisik makam yang sudah Anda bayarkan uang mukanya.
            </p>
          </div>

          {/* SLIDING TABS SWITCH */}
          <div className="flex gap-4 p-1.5 bg-slate-950/60 border border-slate-900 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('bisa')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'bisa'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Bisa Memilih</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'bisa' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {unitsData.bisa_memilih.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('belum')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'belum'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Belum Bisa Memilih</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'belum' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
              }`}>
                {unitsData.belum_bisa_memilih.length}
              </span>
            </button>
          </div>

          {/* CONTENT GRID */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'bisa' ? (
            /* TAB: BISA MEMILIH */
            unitsData.bisa_memilih.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
                <HelpCircle size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Tidak Ada Unit Tersedia</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Belum ada NUP yang siap untuk pemilihan unit fisik saat ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {unitsData.bisa_memilih.map((unit) => (
                  <div 
                    key={unit.id}
                    className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between gap-6 relative group hover:border-amber-400/30"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black text-white tracking-wider bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
                          {unit.transaction_code}
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <AlertTriangle size={10} />
                          {unit.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Unit Utama Terpilih</span>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-950/40 to-indigo-950/20 border border-blue-900/30 text-blue-400 text-xs font-extrabold px-3 py-1.5 rounded-xl">
                          <Sparkles size={12} className="text-amber-400" />
                          <span>{unit.unit_type}</span>
                        </div>

                        {unit.other_units?.length > 0 && (
                          <div className="pt-1">
                            <button
                              onClick={() => handleOpenUnitsList(unit.other_units)}
                              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider underline cursor-pointer"
                            >
                              +{unit.other_units.length} Unit Lainnya
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex flex-col gap-2 shrink-0">
                      {unit.unit_type === '-' || !unit.unit_type ? (
                        <button disabled className="w-full bg-slate-900 text-slate-500 text-xs font-black py-3.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-not-allowed uppercase tracking-widest transition-all">
                          Pilih Skema Bayar
                        </button>
                      ) : (
                        <Link 
                          href={`/skema-transaksi/v2/${unit.transaction_code}`}
                          className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black py-3.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                          Pilih Skema Bayar
                        </Link>
                      )}
                      <Link 
                        href={`/select-unit/edit/${unit.transaction_code}`}
                        className="w-full border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-black py-3.5 rounded-2xl flex items-center justify-center cursor-pointer bg-slate-950/20 transition-all uppercase tracking-widest"
                      >
                        Edit Unit Fisik
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* TAB: BELUM BISA MEMILIH */
            unitsData.belum_bisa_memilih.length === 0 ? (
              <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-800/80">
                <HelpCircle size={48} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Tidak Ada Pembatasan</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Semua transaksi Anda sudah memenuhi syarat pemilihan unit.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {unitsData.belum_bisa_memilih.map((unit) => (
                  <div 
                    key={unit.id}
                    className="glass-card rounded-3xl p-6 border border-red-500/20 bg-red-950/5 flex flex-col justify-between gap-6 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-white tracking-wider bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
                          {unit.transaction_code}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Belum Siap
                        </span>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Syarat Belum Terpenuhi:</span>
                        
                        <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-900">
                          {unit.conditions.map((cond, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-red-400">
                              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{cond}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 shrink-0">
                      <Link
                        href="/booking-fee"
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black py-3.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-amber-500/5"
                      >
                        Selesaikan Booking Fee
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* UNIT TERPILIH LAINNYA MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-md w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Unit Terpilih Lainnya
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Daftar Kavling Tambahan</span>
                  
                  <div className="grid gap-3 pt-1">
                    {selectedUnitsList.map((unitName, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 bg-gradient-to-r from-blue-950/20 to-indigo-950/10 border border-blue-900/20 text-blue-400 text-xs font-extrabold p-3.5 rounded-2xl"
                      >
                        <Sparkles size={14} className="text-amber-400 shrink-0" />
                        <span>{unitName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-950/40 border-t border-slate-900">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest cursor-pointer border border-slate-800 transition-colors"
                  >
                    Tutup Detail
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
