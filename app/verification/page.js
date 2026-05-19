// app/verification/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, updateProfile } from '@/lib/api';
import { ShieldCheck, User, MapPin, Briefcase, FileText, Edit, X, UploadCloud, Eye, CheckCircle2 } from 'lucide-react';

export default function VerificationPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('utama'); // 'utama' or 'pendukung'
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    income: '',
    expense: '',
    province: '',
    city: '',
    district: '',
    address: '',
    maps_link: '',
    emergency_relation: '',
    emergency_name: '',
    emergency_phone: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);
        
        // Initialize form data with profile details if exist
        setFormData({
          company_name: prof.job_name || '',
          income: prof.monthly_income || '',
          expense: prof.monthly_expense || '',
          province: prof.province?.name || prof.province || '',
          city: prof.city?.name || prof.city || '',
          district: prof.district?.name || prof.district || '',
          address: prof.address || '',
          maps_link: prof.maps_link || '',
          emergency_relation: prof.emergency_relation || '',
          emergency_name: prof.emergency_name || '',
          emergency_phone: prof.emergency_phone || '',
        });
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedData = {
      ...profile,
      job_name: formData.company_name,
      monthly_income: formData.income,
      monthly_expense: formData.expense,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      address: formData.address,
      maps_link: formData.maps_link,
      emergency_relation: formData.emergency_relation,
      emergency_name: formData.emergency_name,
      emergency_phone: formData.emergency_phone,
      family_card: 'uploaded_family_card.jpg' // mock file upload
    };
    try {
      const saved = await updateProfile(updatedData);
      setProfile(saved);
    } catch (err) {
      console.error('Failed to save profile to staging API:', err);
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Verifikasi Data" 
          breadcrumbs={['Beranda', 'Verifikasi Data']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Verifikasi Berkas & Identitas
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                Lengkapi berkas identitas pribadi dan data pendukung Anda untuk kelancaran transaksi legalitas tanah makam.
              </p>
            </div>
            
            {activeTab === 'pendukung' && (
              <button 
                onClick={() => setShowEditModal(true)}
                className="gold-gradient gold-gradient-hover text-slate-950 text-xs font-black px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/5 uppercase tracking-widest transition-all hover:scale-[1.01] shrink-0"
              >
                <Edit size={14} />
                <span>Lengkapi Data</span>
              </button>
            )}
          </div>

          {/* SLIDING TABS SWITCH */}
          <div className="flex gap-4 p-1.5 bg-slate-950/60 border border-slate-900 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('utama')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'utama'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={14} />
              <span>Data Utama</span>
            </button>
            
            <button
              onClick={() => setActiveTab('pendukung')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'pendukung'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase size={14} />
              <span>Data Pendukung</span>
            </button>
          </div>

          {/* CONTENT DETAILS */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'utama' ? (
            /* TAB: UTAMA */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Identitas & Kontak */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                    <User size={16} className="text-amber-400" />
                    <span>Identitas Pribadi</span>
                  </h3>
                  
                  <div className="grid gap-4.5">
                    {[
                      { label: 'Nama Lengkap', val: profile?.name },
                      { label: 'Tanggal Lahir', val: profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                      { label: 'Nomor NIK', val: profile?.nik },
                      { label: 'Status Pernikahan', val: profile?.martial_status || '-' },
                      { label: 'Pendidikan Terakhir', val: profile?.education || '-' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1">
                        <span className="text-slate-500 font-bold">{row.label}:</span>
                        <span className="text-white font-extrabold">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400" />
                    <span>Kontak Verifikasi</span>
                  </h3>
                  
                  <div className="grid gap-4.5">
                    {[
                      { label: 'Alamat Email', val: profile?.email },
                      { label: 'No. Whatsapp', val: profile?.phone ? `+${profile.phone}` : '-' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1">
                        <span className="text-slate-500 font-bold">{row.label}:</span>
                        <span className="text-white font-extrabold">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dokumen Utama */}
              <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5 h-fit">
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                  <FileText size={16} className="text-amber-400" />
                  <span>Dokumen Utama</span>
                </h3>
                
                <div className="space-y-4">
                  {/* KTP */}
                  <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Kartu Tanda Penduduk (KTP)</span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={10} />
                          Terverifikasi
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer">
                      <Eye size={12} className="text-amber-400" />
                      <span>Lihat</span>
                    </button>
                  </div>

                  {/* KK */}
                  <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Kartu Keluarga (KK)</span>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Belum diunggah</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('pendukung');
                        setShowEditModal(true);
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-black text-slate-950 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 uppercase tracking-widest px-3.5 py-2 rounded-xl cursor-pointer"
                    >
                      <UploadCloud size={12} />
                      <span>Unggah</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB: PENDUKUNG */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pekerjaan & Kontak Darurat */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-amber-400" />
                    <span>Pekerjaan & Penghasilan</span>
                  </h3>
                  
                  <div className="grid gap-4.5">
                    {[
                      { label: 'Nama Perusahaan/Usaha', val: profile?.job_name || '-' },
                      { label: 'Penghasilan Per-Bulan', val: profile?.monthly_income || '-' },
                      { label: 'Pengeluaran Per-Bulan', val: profile?.monthly_expense || '-' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1">
                        <span className="text-slate-500 font-bold">{row.label}:</span>
                        <span className="text-white font-extrabold">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                    <User size={16} className="text-amber-400" />
                    <span>Kontak Darurat</span>
                  </h3>
                  
                  <div className="grid gap-4.5">
                    {[
                      { label: 'Hubungan Keluarga', val: profile?.emergency_relation || '-' },
                      { label: 'Nama Lengkap', val: profile?.emergency_name || '-' },
                      { label: 'Nomor Telepon/HP', val: profile?.emergency_phone ? `+${profile.emergency_phone}` : '-' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1">
                        <span className="text-slate-500 font-bold">{row.label}:</span>
                        <span className="text-white font-extrabold">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alamat Domisili & Dokumen KK */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6.5 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-amber-400" />
                    <span>Alamat Domisili</span>
                  </h3>
                  
                  <div className="grid gap-4.5">
                     {[
                       { label: 'Provinsi', val: profile?.province?.name || profile?.province || '-' },
                       { label: 'Kota / Kabupaten', val: profile?.city?.name || profile?.city || '-' },
                       { label: 'Kecamatan', val: profile?.district?.name || profile?.district || '-' },
                       { label: 'Detail Alamat', val: profile?.address || '-' },
                       { label: 'Link Google Maps', val: profile?.maps_link || '-' }
                    ].map((row, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs font-semibold py-1 gap-1">
                        <span className="text-slate-500 font-bold">{row.label}:</span>
                        <span className="text-white font-extrabold sm:text-right max-w-xs break-words">{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {profile?.family_card && (
                  <div className="glass-card rounded-3xl p-6.5 border border-slate-850 space-y-5">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                      <FileText size={16} className="text-amber-400" />
                      <span>Dokumen Terunggah</span>
                    </h3>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <FileText size={16} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Kartu Keluarga (KK)</span>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{profile.family_card}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3.5 py-2 rounded-xl cursor-pointer">
                        <Eye size={12} className="text-amber-400" />
                        <span>Lihat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDIT FORM POPUP MODAL */}
          {showEditModal && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-2xl w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Lengkapi Data Pendukung
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <form onSubmit={handleSave} className="overflow-y-auto max-h-[70vh] p-6 space-y-6 text-left">
                  {/* Pekerjaan */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">
                      1. Pekerjaan & Penghasilan
                    </h4>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nama Perusahaan / Bidang Usaha</label>
                        <input 
                          type="text"
                          value={formData.company_name}
                          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                          placeholder="cth. PT Maju Bersama / Retail"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Penghasilan Per-Bulan</label>
                        <select 
                          value={formData.income}
                          onChange={(e) => setFormData({...formData, income: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Rentang Penghasilan</option>
                          <option value="< Rp 5.000.000">&lt; Rp 5.000.000</option>
                          <option value="Rp 5.000.000 - Rp 15.000.000">Rp 5.000.000 - Rp 15.000.000</option>
                          <option value="Rp 15.000.000 - Rp 30.000.000">Rp 15.000.000 - Rp 30.000.000</option>
                          <option value="> Rp 30.000.000">&gt; Rp 30.000.000</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pengeluaran Per-Bulan</label>
                        <select 
                          value={formData.expense}
                          onChange={(e) => setFormData({...formData, expense: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Rentang Pengeluaran</option>
                          <option value="< Rp 5.000.000">&lt; Rp 5.000.000</option>
                          <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                          <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">
                      2. Alamat Domisili
                    </h4>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Provinsi</label>
                        <select 
                          value={formData.province}
                          onChange={(e) => setFormData({...formData, province: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Provinsi</option>
                          <option value="DKI Jakarta">DKI Jakarta</option>
                          <option value="Banten">Banten</option>
                          <option value="Jawa Barat">Jawa Barat</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kabupaten / Kota</label>
                        <select 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Kota</option>
                          <option value="Jakarta Selatan">Jakarta Selatan</option>
                          <option value="Tangerang Selatan">Tangerang Selatan</option>
                          <option value="Tangerang">Tangerang</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kecamatan</label>
                        <select 
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Kecamatan</option>
                          <option value="Ciputat">Ciputat</option>
                          <option value="Serpong">Serpong</option>
                          <option value="Pondok Aren">Pondok Aren</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1.5 sm:col-span-3">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Link Google Maps Alamat</label>
                        <input 
                          type="text"
                          value={formData.maps_link}
                          onChange={(e) => setFormData({...formData, maps_link: e.target.value})}
                          placeholder="https://maps.google.com/..."
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-3">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Detail Alamat Domisili</label>
                        <textarea 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Jalan, Blok, Nomor rumah, RT/RW..."
                          rows="3"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Kontak Darurat */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">
                      3. Kontak Darurat
                    </h4>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hubungan Keluarga</label>
                        <select 
                          value={formData.emergency_relation}
                          onChange={(e) => setFormData({...formData, emergency_relation: e.target.value})}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-semibold cursor-pointer"
                        >
                          <option value="">Pilih Hubungan</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Suami / Istri">Suami / Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Saudara Kandung">Saudara Kandung</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nama Lengkap Kontak</label>
                        <input 
                          type="text"
                          value={formData.emergency_name}
                          onChange={(e) => setFormData({...formData, emergency_name: e.target.value})}
                          placeholder="Nama lengkap"
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nomor Telepon / HP</label>
                        <input 
                          type="text"
                          value={formData.emergency_phone}
                          onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                          placeholder="628..."
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-400 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dokumen Pendukung */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">
                      4. Dokumen Pendukung
                    </h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kartu Keluarga (KK)</label>
                      
                      <div className="border border-dashed border-slate-800 bg-slate-950/20 hover:border-amber-400/50 p-6.5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                        <UploadCloud size={32} className="text-slate-500 group-hover:text-amber-400 transition-colors mb-2.5" />
                        <span className="text-xs font-bold text-slate-300">Klik untuk unggah atau seret berkas di sini</span>
                        <span className="text-[9px] text-slate-500 font-semibold mt-1">Pilih berkas Kartu Keluarga maksimal 5MB (JPG, PNG, JPEG)</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Buttons */}
                  <div className="pt-4 border-t border-slate-900 flex justify-end gap-3.5">
                    <button 
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-black px-6 py-3.5 rounded-2xl cursor-pointer bg-slate-950/20 transition-all uppercase tracking-widest"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black px-8 py-3.5 rounded-2xl cursor-pointer uppercase tracking-widest transition-all shadow-lg shadow-amber-500/5"
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
