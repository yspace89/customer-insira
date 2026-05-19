// app/dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getGatherings } from '@/lib/api';
import { 
  Ticket, 
  Home, 
  Map, 
  CreditCard, 
  Shield, 
  User, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Percent, 
  ChevronRight, 
  FileText, 
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate promo slider every 5 seconds
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const events = await getGatherings();
        if (events && events.length > 0) {
          setEvent(events[0]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004b87]/20 border-t-[#004b87] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Promo Slider Campaigns
  const campaigns = [
    {
      badge: "EVENT TERBARU",
      title: "Customer Gathering Akbar 2026",
      desc: "Hadirilah acara CG eksklusif kami di Ballroom Menara Top Food untuk mendapatkan prioritas pemilihan kavling unit terbaik dan harga promo early-bird.",
      actionText: "Lihat Detail Event",
      actionLink: "#gathering-section",
      bgColor: "from-[#004b87] to-[#002544]",
      accentBg: "bg-blue-500/10"
    },
    {
      badge: "PENAWARAN TERBATAS",
      title: "Booking Fee Kavling Early Bird",
      desc: "Amankan langsung kavling peristirahatan idaman Anda secara online. Dapatkan potongan diskon khusus CG dengan langsung melakukan Booking Fee sekarang.",
      actionText: "Bayar Booking Fee",
      actionLink: "/booking-fee",
      bgColor: "from-indigo-900 to-slate-900",
      accentBg: "bg-indigo-500/10"
    },
    {
      badge: "JAMINAN LAYANAN",
      title: "Garansi 100% Proteksi Investasi",
      desc: "Insira Memorial Park menjamin hak kepemilikan mutlak dengan program asuransi pemeliharaan rumput abadi & opsi jaminan buyback terproteksi.",
      actionText: "Pelajari Buyback",
      actionLink: "/buyback",
      bgColor: "from-[#003d70] to-[#011424]",
      accentBg: "bg-blue-450/10"
    }
  ];

  // 8-Icon Service Categories (Marketplace Menu Grid)
  const services = [
    {
      label: "Daftar NUP",
      subLabel: "Mulai Pemesanan",
      href: "/nup",
      icon: <Ticket size={22} />,
      badge: "HOT",
      badgeColor: "bg-red-500 text-white"
    },
    {
      label: "Bayar Booking",
      subLabel: "Amankan Unit",
      href: "/booking-fee",
      icon: <Home size={22} />,
      badge: "PROMO",
      badgeColor: "bg-emerald-500 text-white"
    },
    {
      label: "Pilih Kavling",
      subLabel: "Peta Interaktif",
      href: "/select-unit/v2",
      icon: <Map size={22} />,
      badge: "MAP",
      badgeColor: "bg-[#004b87] text-white"
    },
    {
      label: "Bayar VA",
      subLabel: "Cicilan Tagihan",
      href: "/pembayaran",
      icon: <CreditCard size={22} />,
      badge: null
    },
    {
      label: "Unggah KTP",
      subLabel: "Verifikasi Data",
      href: "/verification",
      icon: <Shield size={22} />,
      badge: "WAJIB",
      badgeColor: "bg-amber-500 text-slate-950"
    },
    {
      label: "Makam Saya",
      subLabel: "Ahli Waris",
      href: "/makam-saya",
      icon: <User size={22} />,
      badge: null
    },
    {
      label: "Jaminan Buyback",
      subLabel: "Proteksi Aset",
      href: "/buyback",
      icon: <ShieldCheck size={22} />,
      badge: null
    },
    {
      label: "Ajukan Refund",
      subLabel: "Pengembalian",
      href: "/request-refund",
      icon: <RefreshCw size={20} />,
      badge: null
    }
  ];

  // Featured Graveyard Blocks (Product Catalog Showcase)
  const products = [
    {
      title: "Single Plot (Tipe Single)",
      tag: "Paling Populer",
      tagColor: "bg-red-50 text-red-600 border-red-100",
      desc: "Kavling makam eksklusif untuk satu jenazah dengan pemandangan taman terawat, dikelilingi jalan setapak batu alam.",
      price: "Rp 15.000.000",
      specs: ["Kapasitas: 1 Jenazah", "Ukuran: 1.5 x 2.6 m", "Free Pemeliharaan Rumput Abadi"],
      actionLink: "/nup"
    },
    {
      title: "Double Plot (Tipe Semi-Private)",
      tag: "Diskon Early Bird",
      tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      desc: "Pilihan terbaik berpasangan dengan pembatas privasi tanaman perdu hias yang asri dan tenang.",
      price: "Rp 28.500.000",
      specs: ["Kapasitas: 2 Jenazah", "Ukuran: 3.0 x 2.6 m", "Pembatas Tanaman Rimbun"],
      actionLink: "/nup"
    },
    {
      title: "Family Estate (Tipe Private)",
      tag: "Eksklusif Premium",
      tagColor: "bg-blue-50 text-[#004b87] border-blue-100",
      desc: "Kavling megah dengan pembatas tembok batu alam marmer, bangku duduk, dan area taman pribadi keluarga.",
      price: "Rp 75.000.000",
      specs: ["Kapasitas: 4 - 8 Jenazah", "Ukuran Custom Mulai 32 m²", "Privasi Tembok Batu Marmer"],
      actionLink: "/nup"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Beranda" 
          breadcrumbs={['Beranda', 'Dashboard']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* SECTION 1: PROMO CAMPAIGN CAROUSEL */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/50">
            {/* Slide Wrapper */}
            <div className="relative h-[250px] sm:h-[220px] w-full overflow-hidden">
              {campaigns.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} p-8 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-in-out ${
                    idx === currentSlide ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-full scale-95 z-0'
                  }`}
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_60%)]"></div>
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 max-w-2xl space-y-2">
                    <span className="text-[9px] font-black tracking-widest text-[#fcd34d] uppercase bg-white/10 px-2.5 py-1 rounded-full w-max">
                      {slide.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-xs text-blue-100 leading-relaxed max-w-xl font-medium">
                      {slide.desc}
                    </p>
                    
                    <div className="pt-2">
                      <Link
                        href={slide.actionLink}
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white hover:bg-blue-50 px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.97]"
                      >
                        <span>{slide.actionText}</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-10 z-20 flex gap-2">
              {campaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* SECTION 2: 8-ICON SERVICE CATEGORIES GRID */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xs sm:text-sm font-black text-[#0f294a] uppercase tracking-widest mb-6">
              Kategori Layanan Utama
            </h3>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-2">
              {services.map((srv, idx) => (
                <Link
                  key={idx}
                  href={srv.href}
                  className="flex flex-col items-center justify-start text-center group cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-2xl bg-[#f0f4ff] border border-blue-50/50 text-[#004b87] flex items-center justify-center transition-all duration-300 group-hover:bg-[#004b87] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#004b87]/15 group-hover:-translate-y-0.5">
                    {srv.icon}
                    
                    {srv.badge && (
                      <span className={`absolute -top-1.5 -right-2 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${srv.badgeColor} scale-90 border border-white shadow-sm`}>
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-bold text-[#0f294a] mt-2 group-hover:text-[#004b87] transition-colors leading-tight line-clamp-1 w-full px-1">
                    {srv.label}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5 hidden sm:block">
                    {srv.subLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* SECTION 3: TRANSACTION TRACKER TIMELINE (ORDER TRACKER) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0f294a] uppercase tracking-widest">
                  Lacak Langkah Pembelian
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Progres alur kepemilikan unit makam Anda</p>
              </div>
              <span className="text-[9px] font-black text-[#004b87] bg-[#f0f4ff] border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Akun Terverifikasi
              </span>
            </div>

            {/* Steps Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[
                { title: "1. Daftar NUP", desc: "Daftar NUP Calon Pembeli", status: "active", details: "Anda sudah terdaftar" },
                { title: "2. Bayar Booking Fee", desc: "Selesaikan Booking Unit", status: "pending", details: "Menunggu pemilihan unit" },
                { title: "3. Pilih Unit / Kapling", desc: "Tentukan Kavling Fisik", status: "pending", details: "Tahap Customer Gathering" },
                { title: "4. Lengkapi Data KTP", desc: "Verifikasi Berkas KTP", status: "pending", details: "Menunggu konfirmasi admin" }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-50 border border-slate-200 text-slate-400'
                  }`}>
                    {idx === 0 ? "✓" : idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-extrabold ${idx === 0 ? 'text-[#004b87]' : 'text-slate-800'}`}>{step.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-normal">{step.desc}</p>
                    <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      idx === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {idx === 0 ? "SELESAI" : "PENDING"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: FEATURED PRODUCT SHOWCASE (Graveyard Blocks) */}
          <div className="space-y-5">
            <div className="flex items-end justify-between ml-1">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0f294a] uppercase tracking-widest">
                  Tipe Kavling Pilihan (Etalase Produk)
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Model unit peristirahatan terbaik di Insira Memorial Park</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {products.map((prod, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Visual Card Top decoration resembling marketplace product item */}
                    <div className="h-32 w-full rounded-2xl bg-gradient-to-tr from-[#f0f4ff] to-[#e6efff] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-2 left-2">
                        <span className={`text-[8px] font-black border uppercase tracking-wider px-2 py-0.5 rounded-md ${prod.tagColor}`}>
                          {prod.tag}
                        </span>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#004b87] shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                        <Home size={28} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-[#004b87] transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                        {prod.desc}
                      </p>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {prod.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2 text-[10px] text-slate-550 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#004b87]/50" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Harga Dasar</span>
                      <span className="text-sm font-black text-[#004b87]">{prod.price}</span>
                    </div>
                    
                    <Link
                      href={prod.actionLink}
                      className="bg-[#004b87] hover:bg-[#003d70] text-white text-[9px] font-black px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-[0.96]"
                    >
                      Dapatkan NUP
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: EVENT INFORMATION (Gathering Card) */}
          {event && (
            <div id="gathering-section" className="bg-white border border-slate-200/80 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[140%] bg-indigo-500/5 rounded-full blur-[80px]"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-xl">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-150 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Event Terdekat Anda
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-800">
                    {event.title || 'CG Insira Memorial Park - Maret 2026'}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                    Pastikan kehadiran Anda di acara Customer Gathering eksklusif untuk mendapatkan informasi penawaran unit spesial dan pemilihan kavling utama.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-4 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tanggal</span>
                      <span className="text-xs text-slate-700 font-extrabold">
                        {event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '31 Mei 2026'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <Clock size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Waktu</span>
                      <span className="text-xs text-slate-700 font-extrabold">{event.time || '08:52'} WIB</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lokasi</span>
                      <span className="text-xs text-slate-700 font-extrabold truncate max-w-[160px] block">{event.location || 'Ballroom Menara Top Food'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
