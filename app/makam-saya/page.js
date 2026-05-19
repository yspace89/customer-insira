// app/makam-saya/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getOwnedUnits, updateUnitAllocation } from '@/lib/api';
import { HelpCircle, Search, Eye, Edit3, X, Sparkles, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MakamSayaPage() {
  const [profile, setProfile] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dropdown menu active state
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [allocationName, setAllocationName] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const data = await getOwnedUnits();
        setUnits(data);
      } catch (err) {
        console.error('Failed to load owned units:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenAllocationModal = (unit) => {
    setSelectedUnit(unit);
    // Use memorial_allocations[0].name (real staging schema)
    setAllocationName(unit.memorial_allocations?.[0]?.name || '');
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleSaveAllocation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use ppjb_contract_unit_id (e.g. 2319), not unit.id (e.g. 810)
      const ppjbUnitId = selectedUnit?.ppjb_contract_unit_id || selectedUnit?.id;
      await updateUnitAllocation(ppjbUnitId, allocationName);
      setUnits(prev => prev.map(u => 
        u.id === selectedUnit.id
          ? { ...u, memorial_allocations: [{ name: allocationName, address: '-' }] }
          : u
      ));
    } catch (err) {
      console.error('Failed to update grave allocation on staging:', err);
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  const filteredUnits = units.filter(unit => 
    (unit.unit_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (unit.block || '').toLowerCase().includes(search.toLowerCase()) ||
    (unit.unit_no || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24">
        <Header 
          title="Makam Saya" 
          breadcrumbs={['Beranda', 'Makam Saya']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* TITLE & SEARCH */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Daftar Unit Makam Keluarga
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Kelola kavling fisik makam keluarga Anda yang telah resmi terdaftar dan diselesaikan administrasinya.
              </p>
            </div>
            
            <div className="relative group w-72 shrink-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari blok/no unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold glow-input"
              />
            </div>
          </div>

          {/* GLASS TABLE */}
          <div className="glass-card rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950/40 text-slate-400 select-none">
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider">No</th>
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider">Blok</th>
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider">No. Unit</th>
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider">Diperuntukan</th>
                    <th className="px-6 py-4.5 font-bold uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-transparent text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="w-6 h-6 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredUnits.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="max-w-xs mx-auto flex flex-col items-center">
                          <HelpCircle size={40} className="text-slate-650 mb-3" />
                          <h4 className="text-xs font-bold text-white">Tidak Ada Lahan</h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">Belum ada unit makam terdaftar yang terverifikasi.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUnits.map((unit, idx) => (
                      <tr 
                        key={unit.id}
                        className="hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-950/40 to-indigo-950/20 border border-blue-900/30 text-blue-400 text-xs font-extrabold px-3 py-1.5 rounded-xl">
                            <Sparkles size={11} className="text-amber-400" />
                            <span>{unit.unit_name || unit.name || `Single - ${unit.block || '-'} - ${unit.unit_no || unit.unit_number || '-'}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-white">{unit.block || '-'}</td>
                        <td className="px-6 py-4 font-extrabold text-white">{unit.unit_no || unit.number || unit.unit_number || '-'}</td>
                        <td className="px-6 py-4">
                          {(() => {
                            const allocName = unit.memorial_allocations?.[0]?.name;
                            return !allocName ? (
                              <span className="text-slate-600 font-bold">- Belum Dialokasikan -</span>
                            ) : (
                              <span className="text-emerald-400 font-extrabold">{allocName}</span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === unit.id ? null : unit.id)}
                            className="w-8 h-8 rounded-lg bg-slate-950/60 hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-850 cursor-pointer inline-flex"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* ACTION DROPDOWN POPUP */}
                          {activeMenuId === unit.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenuId(null)}
                              ></div>
                              <div className="absolute right-6 top-13 w-40 bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link
                                  href={`/makam-saya/${unit.id}`}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-850 text-slate-350 hover:text-white rounded-lg text-xs font-bold transition-all"
                                >
                                  <Eye size={13} className="text-amber-400" />
                                  <span>Detail Lahan</span>
                                </Link>
                                <button
                                  onClick={() => handleOpenAllocationModal(unit)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-850 text-slate-350 hover:text-white rounded-lg text-xs font-bold transition-all text-left cursor-pointer"
                                >
                                  <Edit3 size={13} className="text-amber-400" />
                                  <span>Ubah Peruntukan</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT ALLOCATION MODAL */}
          {showEditModal && selectedUnit && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-md w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Ubah Peruntukan Liang Makam
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <form onSubmit={handleSaveAllocation} className="p-6 space-y-5 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Unit Liang Lahat</span>
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-950/20 to-indigo-950/10 border border-blue-900/20 text-blue-400 text-xs font-extrabold px-3.5 py-1.5 rounded-xl">
                      <Sparkles size={12} className="text-amber-400" />
                      <span>{selectedUnit.unit_name}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Liang 1 (Calon Penghuni)</label>
                    <input 
                      type="text"
                      value={allocationName}
                      onChange={(e) => setAllocationName(e.target.value)}
                      placeholder="Masukkan nama calon penghuni makam..."
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
