// app/makam-saya/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getOwnedUnits, updateUnitAllocation, getUnitDetail } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Edit2, ShieldAlert, Sparkles, X, Heart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OwnedGraveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [profile, setProfile] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [allocationName, setAllocationName] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        // Use direct endpoint /customer/units/[id] (real staging endpoint)
        const found = await getUnitDetail(id);
        setUnit(found);
        if (found) {
          // Use memorial_allocations[0].name (real staging schema)
          const currentName = found.memorial_allocations?.[0]?.name || '';
          setAllocationName(currentName);
        }
      } catch (err) {
        console.error('Failed to load owned grave details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSaveAllocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use ppjb_contract_unit_id (e.g. 2319), not unit.id (e.g. 810)
      const ppjbUnitId = unit?.ppjb_contract_unit_id || id;
      await updateUnitAllocation(ppjbUnitId, allocationName);
      // Update local state using memorial_allocations schema
      setUnit(prev => ({
        ...prev,
        memorial_allocations: [{ name: allocationName, address: '-' }]
      }));
    } catch (err) {
      console.error('Failed to update grave details allocation on staging:', err);
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col justify-center items-center text-center p-6 pb-24">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-white">Detail Lahan Tidak Ditemukan</h3>
        <button 
          onClick={() => router.push('/makam-saya')}
          className="mt-4 bg-slate-900 border border-slate-800 text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24">
        <Header 
          title={`Detail Unit: ${unit.unit_name || unit.name || 'Single - ' + (unit.block || '-') + ' - ' + (unit.unit_no || unit.unit_number || '-')}`} 
          breadcrumbs={['Beranda', 'Makam Saya', 'Detail']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* BACK ACTION */}
          <button 
            onClick={() => router.push('/makam-saya')}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Halaman Makam Saya</span>
          </button>

          {/* UNIT CARD & INFO DISPLAY */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              
              {/* Core Lahan Info */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Spesifikasi Kavling Lahan</span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Blok Kavling</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">{unit.block || '-'}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Nomor Kavling</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">No. {unit.unit_no || unit.unit_number || unit.number || '-'}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Tipe Kavling</span>
                    <span className="text-xs text-blue-400 font-extrabold mt-1.5 bg-blue-500/10 border border-blue-900/30 px-2.5 py-1 rounded-xl inline-block">
                      Single Plot
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Peruntukan Calon Penghuni</span>
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950/40 to-slate-950/60 border border-slate-900 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400">
                        <Heart size={16} className="text-red-400/80" />
                      </div>
                      <div>
                        {(() => {
                          const allocName = unit.memorial_allocations?.[0]?.name;
                          return !allocName ? (
                            <span className="text-xs font-bold text-slate-500">- Belum Dialokasikan Ke Siapapun -</span>
                          ) : (
                            <>
                              <span className="text-xs font-black text-white block">Liang 1: {allocName}</span>
                              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                <ShieldCheck size={10} />
                                Sudah Dialokasikan
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3.5 py-2.5 rounded-xl cursor-pointer"
                    >
                      <Edit2 size={12} className="text-amber-400" />
                      <span>Ubah</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5 h-fit">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3">
                Aksi & Administrasi
              </h3>
              
              <div className="grid gap-3">
                <Link
                  href="/pembayaran/257"
                  className="w-full border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-black py-3.5 rounded-2xl cursor-pointer bg-slate-950/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Clock size={14} className="text-amber-400" />
                  <span>Riwayat Cicilan</span>
                </Link>
              </div>
            </div>
          </div>

          {/* EDIT MODAL */}
          {showEditModal && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-md w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Ubah Calon Penghuni
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveAllocation} className="p-6 space-y-5 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Liang 1 (Calon Penghuni)</label>
                    <input 
                      type="text"
                      value={allocationName}
                      onChange={(e) => setAllocationName(e.target.value)}
                      placeholder="Masukkan nama calon penghuni..."
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                    />
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-3 border-t border-slate-900 flex justify-end gap-3 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer bg-slate-950/20 transition-all uppercase tracking-widest"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black px-6 py-3 rounded-2xl cursor-pointer uppercase tracking-widest transition-all shadow-lg shadow-amber-500/5"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
