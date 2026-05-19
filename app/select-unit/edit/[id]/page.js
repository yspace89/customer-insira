'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, savePhysicalUnitSelection, getAvailableUnits } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, AlertCircle, RefreshCcw } from 'lucide-react';

export default function EditUnitFisikPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; // NUP Code or transaction code

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedBlock, setSelectedBlock] = useState('A01');
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Mock data for available blocks and units
  const blocks = ['A01', 'A17', 'B12', 'B05'];
  
  // Simulated available units from GET /customer/available
  const generateUnits = (blockName) => {
    return Array.from({ length: 12 }).map((_, i) => {
      const isSold = Math.random() > 0.7; // 30% chance sold
      return {
        id: `${blockName}-${i + 1}`,
        block: blockName,
        no: i + 1,
        type: i % 3 === 0 ? 'Family' : 'Single',
        status: isSold ? 'sold' : 'available'
      };
    });
  };

  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);
        
        // Fetch real available units from staging
        const apiUnits = await getAvailableUnits(id);
        console.log("Real available units from staging:", apiUnits);
        
        if (apiUnits && apiUnits.length > 0) {
          const mapped = apiUnits.map(u => ({
            id: u.id,
            block: u.block_name || u.block || selectedBlock,
            no: u.unit_number || u.number || u.unit_no || 1,
            type: u.unit_type || u.type || 'Single',
            status: u.status === 'Available' || u.status === 'available' ? 'available' : 'sold'
          }));
          setUnits(mapped);
        } else {
          setUnits(generateUnits(selectedBlock));
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setUnits(generateUnits(selectedBlock));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedBlock]);

  const handleSave = async () => {
    if (!selectedUnitId) return;
    
    setSubmitting(true);
    try {
      const chosenUnit = units.find(u => u.id === selectedUnitId);
      if (chosenUnit) {
        localStorage.setItem(`chosen_unit_${id}`, JSON.stringify({
          name: `Blok ${chosenUnit.block} - Unit ${chosenUnit.no} (${chosenUnit.type === 'Family' ? 'Signature Family' : 'Single'})`,
          block: chosenUnit.block,
          no: chosenUnit.no,
          type: chosenUnit.type
        }));
      }

      // Robust payload to prevent Laravel/Kotahati validator errors
      const payload = {
        nub: id,
        nup_code: id,
        project_id: 3,
        project: 3,
        Project: 3,
        unit_ids: [Number(selectedUnitId) || selectedUnitId],
        unit_id: Number(selectedUnitId) || selectedUnitId
      };
      
      await savePhysicalUnitSelection(payload);
      
      // Navigate to scheme payment page after successfully saving
      router.push(`/skema-transaksi/v2/${id}`);
    } catch (err) {
      console.error('Error saving unit:', err);
      alert(`Gagal menyimpan unit ke staging: ${err.message || err}. Melanjutkan ke skema transaksi menggunakan simulasi aman.`);
      router.push(`/skema-transaksi/v2/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

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
          title="Pemilihan Unit Fisik" 
          breadcrumbs={['Beranda', 'Pilih Unit', 'Peta Kavling']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          <button 
            onClick={() => router.push('/select-unit/v2')}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Pemilihan NUP</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map/Grid Section */}
            <div className="lg:col-span-2 flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Denah Kavling</h2>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
                    Tersedia
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="w-3 h-3 rounded-full bg-slate-800/50 border border-slate-700/50"></span>
                    Terjual
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500"></span>
                    Dipilih
                  </div>
                </div>
              </div>

              {/* Block Tabs */}
              <div className="flex gap-2 border-b border-slate-900 pb-4">
                {blocks.map(block => (
                  <button
                    key={block}
                    onClick={() => {
                      setSelectedBlock(block);
                      setSelectedUnitId(null);
                    }}
                    className={`px-5 py-2.5 text-xs font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                      selectedBlock === block 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/50' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    Blok {block}
                  </button>
                ))}
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {units.map((unit) => {
                  const isSelected = selectedUnitId === unit.id;
                  const isAvailable = unit.status === 'available';

                  return (
                    <button
                      key={unit.id}
                      disabled={!isAvailable}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`
                        aspect-square rounded-2xl flex flex-col items-center justify-center p-3 relative transition-all
                        ${!isAvailable 
                          ? 'bg-slate-900/50 border border-slate-800 opacity-50 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-amber-500/10 border-2 border-amber-500 shadow-lg shadow-amber-500/20 transform scale-105'
                            : 'bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 cursor-pointer'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                          <Check size={12} className="text-slate-950 font-bold" />
                        </div>
                      )}
                      <span className={`text-lg font-black ${isSelected ? 'text-amber-400' : 'text-slate-300'}`}>
                        {unit.no}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                        {unit.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection Summary Panel */}
            <div className="w-full lg:w-[350px] shrink-0">
              <div className="glass-card p-6 rounded-3xl border border-slate-800 sticky top-10 flex flex-col h-full min-h-[400px]">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 border-b border-slate-900 pb-4">
                  Rincian Pilihan
                </h3>
                
                <div className="flex-1">
                  {!selectedUnitId ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4 py-10">
                      <AlertCircle size={40} className="text-slate-700" />
                      <p className="text-xs font-semibold leading-relaxed">
                        Silakan klik salah satu kavling yang <span className="text-emerald-400 font-bold">Tersedia</span> pada denah di sebelah kiri.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">Kavling Terpilih</span>
                        <span className="text-2xl font-black text-amber-400">{selectedBlock} - {units.find(u => u.id === selectedUnitId)?.no}</span>
                        <span className="text-xs font-bold text-slate-400 mt-2 bg-slate-900 px-3 py-1 rounded-full">
                          Tipe: {units.find(u => u.id === selectedUnitId)?.type}
                        </span>
                      </div>
                      
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-200/70 font-semibold leading-relaxed">
                          Dengan menyimpan pilihan ini, kapling makam akan diamankan sementara untuk Anda. Anda tidak bisa mengubah unit setelah proses dilanjutkan ke skema bayar.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-900 mt-auto">
                  <button
                    disabled={!selectedUnitId || submitting}
                    onClick={handleSave}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all
                      ${!selectedUnitId || submitting
                        ? 'bg-slate-900 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95'
                      }
                    `}
                  >
                    {submitting ? (
                      <>
                        <RefreshCcw size={16} className="animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Unit Fisik'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
