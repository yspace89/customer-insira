// app/dashboard/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getGatherings, createNupTransaction } from '@/lib/api';
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
  ChevronLeft,
  X,
  Layers,
  Info,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  CheckSquare,
  Bookmark,
  TrendingDown,
  Building,
  Smartphone,
  QrCode
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal States
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1: Cart & Referral, 2: Choose NUP vs Booking
  
  // Progressive Cart States
  const [activeTypes, setActiveTypes] = useState([]); // e.g. ['Double']
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Inline Checkout states
  const [cart, setCart] = useState({
    Single: 0,
    SinglePremiere: 0,
    Couple: 0,
    CouplePremiere: 0,
    Family: 0,
    SignatureFamily: 0
  });
  const [referral, setReferral] = useState('Pro8a');
  const [isPaying, setIsPaying] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [nupCode, setNupCode] = useState('');
  const [nupMethod, setNupMethod] = useState('nup'); // 'nup' (Rp 0 standard) or 'booking' (paid direct)
  const [selectedMethod, setSelectedMethod] = useState('va');
  const [selectedBank, setSelectedBank] = useState('BRI');

  // Booking fee values
  const unitPrices = {
    Single: 1000000,
    SinglePremiere: 1000000,
    Couple: 2000000,
    CouplePremiere: 3000000,
    Family: 5000000,
    SignatureFamily: 10000000
  };

  // List of all unit type options with metadata
  const allUnitTypes = [
    { id: 'Single', name: 'Single', desc: '1.5 x 2.6 m • Kapasitas 1 Jenazah', fee: 1000000 },
    { id: 'SinglePremiere', name: 'Single - Premiere', desc: '1.5 x 2.6 m • Posisi Strategis Utama', fee: 1000000 },
    { id: 'Couple', name: 'Couple', desc: '3.0 x 2.6 m • Berpasangan Tanaman Pembatas', fee: 2000000 },
    { id: 'CouplePremiere', name: 'Couple - Premiere', desc: '3.0 x 2.6 m • Akses Mudah Landscape Mewah', fee: 3000000 },
    { id: 'Family', name: 'Family', desc: 'Kapasitas 4-8 Jenazah • Tembok Batu Marmer', fee: 5000000 },
    { id: 'SignatureFamily', name: 'Signature Family', desc: 'Gazebo Eksklusif • Area Luas Lanskap Indah', fee: 10000000 }
  ];

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

  // 9-Icon Service Categories (Marketplace Menu Grid matching Sidebar)
  const services = [
    {
      label: "Beranda",
      subLabel: "Dashboard Utama",
      href: "/dashboard",
      icon: <Home size={22} />
    },
    {
      label: "Nomor Urut Pemesanan",
      subLabel: "Mulai Pemesanan",
      href: "/nup",
      icon: <Layers size={22} />,
      badge: "HOT",
      badgeColor: "bg-red-500 text-white"
    },
    {
      label: "Booking Fee",
      subLabel: "Amankan Unit",
      href: "/booking-fee",
      icon: <CheckSquare size={22} />,
      badge: "PROMO",
      badgeColor: "bg-emerald-500 text-white"
    },
    {
      label: "Request Refund",
      subLabel: "Pengembalian Dana",
      href: "/request-refund",
      icon: <RefreshCw size={22} />
    },
    {
      label: "Pilih Unit",
      subLabel: "Peta Interaktif",
      href: "/select-unit/v2",
      icon: <HelpCircle size={22} />,
      badge: "MAP",
      badgeColor: "bg-[#004b87] text-white"
    },
    {
      label: "Verifikasi Data",
      subLabel: "Unggah KTP",
      href: "/verification",
      icon: <ShieldCheck size={22} />,
      badge: "WAJIB",
      badgeColor: "bg-amber-500 text-slate-950"
    },
    {
      label: "Pembayaran",
      subLabel: "Cicilan Tagihan",
      href: "/pembayaran",
      icon: <CreditCard size={22} />
    },
    {
      label: "Makam Saya",
      subLabel: "Ahli Waris",
      href: "/makam-saya",
      icon: <Bookmark size={22} />
    },
    {
      label: "Buyback Saya",
      subLabel: "Proteksi Aset",
      href: "/buyback",
      icon: <TrendingDown size={22} />
    }
  ];

  // Featured Graveyard Blocks (Product Catalog Showcase)
  const products = [
    {
      title: "Single",
      tag: "Best Seller",
      tagColor: "bg-red-50 text-red-600 border-red-100",
      desc: "Kavling makam eksklusif untuk satu jenazah dengan pemandangan taman asri dan jalan setapak batu alam.",
      price: "Rp 19.900.000",
      rawPrice: 19900000,
      specs: [
        "Pre-Need Promo: Rp 19.900.000",
        "At-Need Price: Rp 45.100.000",
        "Angsuran: Rp 575.000 / bln",
        "Cashback: Rp 10.000.000 / 2 Unit",
        "Buyback: 3 Unit / 10 Unit"
      ],
    },
    {
      title: "Single - Premiere",
      tag: "Posisi Favorit",
      tagColor: "bg-amber-50 text-amber-600 border-amber-100",
      desc: "Kavling makam single dengan lokasi strategis dekat jalan utama dan pemandangan taman premium.",
      price: "Rp 24.900.000",
      rawPrice: 24900000,
      specs: [
        "Pre-Need Promo: Rp 24.900.000",
        "At-Need Price: Rp 50.100.000",
        "Angsuran: Rp 748.000 / bln",
        "Cashback: Rp 10.000.000 / 2 Unit",
        "Buyback: 3 Unit / 10 Unit"
      ],
    },
    {
      title: "Couple",
      tag: "Tanaman Pembatas",
      tagColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      desc: "Kavling makam berpasangan dengan pembatas tanaman perdu hias asri untuk privasi lebih tenang.",
      price: "Rp 59.900.000",
      rawPrice: 59900000,
      specs: [
        "Pre-Need Promo: Rp 59.900.000",
        "At-Need Price: Rp 125.000.000",
        "Angsuran: Rp 1.725.000 / bln",
        "Cashback: Rp 15.000.000 / 2 Unit",
        "Buyback: 1 Unit / 3 Unit"
      ],
    },
    {
      title: "Couple - Premiere",
      tag: "Akses Utama",
      tagColor: "bg-teal-50 text-teal-600 border-teal-100",
      desc: "Kavling couple eksklusif dekat pedestrian walk dengan landscape tanaman hias premium.",
      price: "Rp 84.900.000",
      rawPrice: 84900000,
      specs: [
        "Pre-Need Promo: Rp 84.900.000",
        "At-Need Price: Rp 175.000.000",
        "Angsuran: Rp 2.588.000 / bln",
        "Cashback: Rp 17.500.000 / 2 Unit",
        "Buyback: 1 Unit / 3 Unit"
      ],
    },
    {
      title: "Family",
      tag: "Eksklusif Premium",
      tagColor: "bg-blue-50 text-[#004b87] border-blue-100",
      desc: "Kavling megah keluarga berpembatas tembok batu alam marmer, bangku duduk, dan taman pribadi.",
      price: "Rp 189.000.000",
      rawPrice: 189000000,
      specs: [
        "Pre-Need Promo: Rp 189.000.000",
        "At-Need Price: Rp 325.000.000",
        "Angsuran: Rp 5.698.000 / bln",
        "Cashback: Rp 50.000.000 / 2 Unit",
        "Buyback: 1 Unit / 3 Unit"
      ],
    },
    {
      title: "Signature Family",
      tag: "Mahakarya Lanskap",
      tagColor: "bg-purple-50 text-purple-600 border-purple-100",
      desc: "Kavling keluarga premium dengan area paling luas, gazebo teduh, dan posisi terbaik di puncak bukit.",
      price: "Rp 501.000.000",
      rawPrice: 501000000,
      specs: [
        "Pre-Need Promo: Rp 501.000.000",
        "At-Need Price: Rp 825.000.000",
        "Angsuran: Rp 14.438.000 / bln",
        "Cashback: Rp 100.000.000 / 2 Unit",
        "Buyback: 1 Unit / 3 Unit"
      ],
    }
  ];;

  // Handle Buy Button Click
  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    let key = 'Single';
    if (product.title === 'Single - Premiere') key = 'SinglePremiere';
    else if (product.title === 'Single') key = 'Single';
    else if (product.title === 'Couple - Premiere') key = 'CouplePremiere';
    else if (product.title === 'Couple') key = 'Couple';
    else if (product.title === 'Signature Family') key = 'SignatureFamily';
    else if (product.title === 'Family') key = 'Family';
    
    // Set the selected unit to 1, others to 0
    setCart({
      Single: key === 'Single' ? 1 : 0,
      SinglePremiere: key === 'SinglePremiere' ? 1 : 0,
      Couple: key === 'Couple' ? 1 : 0,
      CouplePremiere: key === 'CouplePremiere' ? 1 : 0,
      Family: key === 'Family' ? 1 : 0,
      SignatureFamily: key === 'SignatureFamily' ? 1 : 0
    });
    setActiveTypes([key]);
    setShowAddMenu(false);
    setReferral('Pro8a');
    setPurchaseError('');
    setPaySuccess(false);
    setShowSimulator(false);
    setModalStep(1);
    setIsBuyModalOpen(true);
  };

  const saveSimulatedNup = (code, qty, isBooking) => {
    const newNup = {
      id: Date.now(),
      nup_code: code,
      units_count: qty,
      sales_name: referral === 'Pro8a' ? 'Yala' : 'Sales Agent',
      event_name: 'CG Insira Memorial Park - Maret 2026',
      created_at: new Date().toISOString(),
      status: 'Pembayaran Berhasil',
      has_booking_fee: isBooking
    };

    const existing = JSON.parse(localStorage.getItem('simulated_nups') || '[]');
    localStorage.setItem('simulated_nups', JSON.stringify([newNup, ...existing]));

    // Also add to booking fees localStorage if it is direct booking
    if (isBooking) {
      // Calculate total amount
      let totalAmount = 0;
      const selectedTypes = Object.keys(cart).filter(k => cart[k] > 0);
      const unitsList = selectedTypes.map(type => {
        const itemAmount = unitPrices[type] * cart[type];
        totalAmount += itemAmount;
        return {
          name: type,
          qty: cart[type],
          amount: String(unitPrices[type])
        };
      });

      const newBooking = {
        id: Date.now() + 1,
        nub: code,
        gathering: 'CG Insira Memorial Park - Maret 2026',
        created_at: new Date().toISOString(),
        unit_qty: qty,
        total: totalAmount,
        units: unitsList,
        sales: referral === 'Pro8a' ? 'Yala' : 'Sales Agent',
        is_paid: 1
      };
      
      // Load and save
      const existingFees = JSON.parse(localStorage.getItem('simulated_booking_fees') || '[]');
      localStorage.setItem('simulated_booking_fees', JSON.stringify([newBooking, ...existingFees]));
    }
  };

  const handlePurchase = async (method) => {
    setNupMethod(method);
    setIsPaying(true);
    setPurchaseError('');
    
    // Generate random invoice and NUP code
    const randInvoice = 'TRX' + Math.floor(100000000000 + Math.random() * 900000000000);
    const randNup = 'INS-0926' + Math.floor(100 + Math.random() * 900);
    setInvoiceNumber(randInvoice);
    setNupCode(randNup);

    // Sum quantities
    const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
    
    // Get first selected unit type for priority
    const selectedTypes = Object.keys(cart).filter(k => cart[k] > 0);
    const primaryType = selectedTypes[0] || 'Single';
    
    const unitTypeIds = {
      Single: 1,
      SinglePremiere: 1,
      Couple: 2,
      CouplePremiere: 2,
      Family: 3,
      SignatureFamily: 4
    };

    const dbTypeNames = {
      Single: "Single",
      SinglePremiere: "Single - Premiere",
      Couple: "Couple",
      CouplePremiere: "Couple - Premiere",
      Family: "Family",
      SignatureFamily: "Signature Family"
    };

    const primaryTypeId = unitTypeIds[primaryType];
    const primaryTypeName = dbTypeNames[primaryType] || primaryType;
    
    // Build units list
    const unitsPayload = selectedTypes.map(type => ({
      unit_type_id: unitTypeIds[type],
      name: dbTypeNames[type] || type,
      type: dbTypeNames[type] || type,
      qty: cart[type],
      quantity: cart[type],
      unit_qty: cart[type]
    }));

    const payload = {
      project_id: 3,
      project: 3,
      Project: 3,
      unit_qty: totalQty,
      referral_code: referral,
      priority_unit_type: primaryTypeName,
      unit_type_id: primaryTypeId,
      units: unitsPayload
    };

    try {
      const res = await createNupTransaction(payload);
      
      // If there's an invoice URL from staging backend, redirect immediately
      const realXenditUrl = res.data?.invoice_url || res.invoice_url || res.url;
      if (realXenditUrl && method === 'booking') {
        window.location.href = realXenditUrl;
        return;
      }

      // If it is NUP (Rp 0 free) or didn't return url, show success screen
      if (method === 'nup') {
        saveSimulatedNup(randNup, totalQty, false);
        setPaySuccess(true);
      } else {
        // paid Booking Fee simulation fallback
        setShowSimulator(true);
      }
    } catch (err) {
      // Staging error fallback
      let serverErrorMsg = '';
      try {
        const parsed = JSON.parse(err.message);
        serverErrorMsg = parsed.message || parsed.data?.errors?.[0];
      } catch (e) {}

      if (serverErrorMsg) {
        setPurchaseError(serverErrorMsg);
      } else {
        // Fallback simulation
        if (method === 'nup') {
          saveSimulatedNup(randNup, totalQty, false);
          setPaySuccess(true);
        } else {
          setShowSimulator(true);
        }
      }
    } finally {
      setIsPaying(false);
    }
  };

  const handleSimulatedPaymentComplete = () => {
    setIsPaying(true);
    setTimeout(() => {
      // Sum quantities
      const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
      saveSimulatedNup(nupCode, totalQty, nupMethod === 'booking');
      setIsPaying(false);
      setPaySuccess(true);
      setShowSimulator(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar profile={profile} />
      
      <div className="flex flex-col min-h-screen pb-24 relative">
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
            
            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
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

          {/* SECTION 3: FEATURED PRODUCT SHOWCASE (Graveyard Blocks) */}
          <div className="space-y-5">
            <div className="flex items-end justify-between ml-1">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0f294a] uppercase tracking-widest">
                  Etalase Unit Makam (Pilih Produk)
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Lihat dan pesan model unit peristirahatan terbaik di Insira Memorial Park</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                    
                    {/* TRIGGER MODAL BUTTON */}
                    <button
                      onClick={() => handleBuyClick(prod)}
                      className="bg-[#004b87] hover:bg-[#003d70] text-white text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-[0.96] shadow-md shadow-[#004b87]/20 flex items-center gap-1.5"
                    >
                      Beli
                      <ChevronRight size={14} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: TRANSACTION TRACKER TIMELINE (ORDER TRACKER) */}
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
            <div className="grid grid-cols-1 gap-6 relative">
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

      {/* --- INLINE BUY MODAL & CHECKOUT --- */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0f294a]/40 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              if (!isPaying && !showSimulator && !paySuccess) {
                setIsBuyModalOpen(false);
              }
            }}
          ></div>
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                {modalStep === 2 && !paySuccess && (
                  <button 
                    onClick={() => setModalStep(1)}
                    disabled={isPaying}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-[#004b87] flex items-center justify-center transition-all shadow-sm mr-1 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Kembali"
                  >
                    <ChevronLeft size={16} className="stroke-[3]" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-[#004b87] text-white flex items-center justify-center shadow-md">
                  {paySuccess ? <ShieldCheck size={20} /> : (modalStep === 1 ? <Home size={20} /> : <Layers size={20} />)}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0f294a] tracking-tight">
                    {paySuccess 
                      ? 'Transaksi Berhasil!' 
                      : (modalStep === 1 ? 'Keranjang Pemesanan Unit' : 'Konfirmasi & Pembayaran')}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5 uppercase tracking-wider">
                    {paySuccess 
                      ? 'Pemesanan Anda Telah Diproses' 
                      : (modalStep === 1 ? 'Langkah 1 dari 2: Sesuaikan Unit' : 'Langkah 2 dari 2: Pilih Alur Pembelian')}
                  </p>
                </div>
              </div>
              {!isPaying && (
                <button 
                  onClick={() => setIsBuyModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors focus:outline-none"
                >
                  <X size={16} className="stroke-[3]" />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              
              {/* STATE: SUCCESS */}
              {paySuccess ? (
                <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-500 mx-auto shadow-md">
                    <CheckCircle2 size={36} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-slate-800 uppercase tracking-wider">
                      {nupMethod === 'nup' ? 'Pendaftaran NUP Berhasil!' : 'Booking Fee Berhasil Dibayar!'}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md mx-auto">
                      {nupMethod === 'nup' 
                        ? 'Nomor Urut Pemesanan Anda telah diterbitkan. Silakan cek menu NUP untuk daftar antrean Anda.'
                        : 'Kavling Anda berhasil di-booking. Rincian tagihan unit telah dibuat di sistem.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-5 rounded-3xl text-left max-w-md mx-auto space-y-3.5 font-semibold text-xs text-slate-655 shadow-inner">
                    <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Nomor NUP / Kode Transaksi:</span>
                      <span className="text-slate-900 font-black">{nupCode}</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Rincian Pembelian:</span>
                      <div className="text-right space-y-1">
                        {Object.keys(cart).map(type => cart[type] > 0 && (
                          <div key={type} className="text-slate-900 font-extrabold text-[11px]">
                            {type} Plot (x{cart[type]})
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                      <span className="text-slate-400">Total Unit:</span>
                      <span className="text-slate-900 font-extrabold">{Object.values(cart).reduce((a,b)=>a+b, 0)} Unit</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-sm font-black">
                      <span className="text-slate-500 uppercase tracking-wider">Total Nominal Dibayar:</span>
                      <span className="text-[#004b87]">
                        Rp {nupMethod === 'nup' ? '0' : Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => {
                        setIsBuyModalOpen(false);
                        router.push(nupMethod === 'nup' ? '/nup' : '/booking-fee');
                      }}
                      className="w-full max-w-xs bg-[#004b87] hover:bg-[#003d70] text-white text-xs font-black py-4.5 rounded-2xl uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[#004b87]/20 flex items-center justify-center gap-2"
                    >
                      <span>{nupMethod === 'nup' ? 'Lihat Antrean NUP Saya' : 'Lihat Riwayat Booking'}</span>
                      <ArrowRight size={14} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ) : modalStep === 1 ? (
                /* STEP 1: MULTI-UNIT SELECTION & REFERRAL */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-black text-[#0f294a]">Pilih Kombinasi Unit Makam Anda</h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                      Secara bisnis, Anda diperbolehkan memesan beberapa unit dengan tipe yang berbeda dalam satu transaksi NUP yang sama.
                    </p>
                  </div>

                  {/* Shopping Cart List */}
                  <div className="space-y-4 pt-2">
                    {allUnitTypes.filter(item => activeTypes.includes(item.id)).map(item => (
                      <div key={item.id} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all relative group/card">
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black text-slate-800">{item.name}</h5>
                            {activeTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTypes(activeTypes.filter(id => id !== item.id));
                                  setCart(prev => ({ ...prev, [item.id]: 0 }));
                                }}
                                className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 border border-red-100 hover:bg-red-100 transition-all"
                                title="Hapus dari keranjang"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                          <span className="text-[10px] font-black text-[#004b87] mt-1 inline-block">
                            Booking Fee: Rp {item.fee.toLocaleString('id-ID')} / unit
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                          <button
                            type="button"
                            onClick={() => setCart(prev => ({ ...prev, [item.id]: Math.max(1, prev[item.id] - 1) }))}
                            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-[#004b87] flex items-center justify-center text-base font-black transition-all cursor-pointer active:scale-90"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-extrabold text-[#0f294a]">
                            {cart[item.id]}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCart(prev => ({ ...prev, [item.id]: prev[item.id] + 1 }))}
                            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-[#004b87] flex items-center justify-center text-base font-black transition-all cursor-pointer active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add other unit types button */}
                  {allUnitTypes.filter(item => !activeTypes.includes(item.id)).length > 0 && (
                    <div className="max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-[#004b87] text-slate-500 hover:text-[#004b87] rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all"
                      >
                        <span>+ Tambah Tipe Unit Lain</span>
                        <ChevronDown size={14} className={`transform transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
                      </button>

                      {showAddMenu && (
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 mt-2 shadow-lg space-y-1.5 z-20 relative animate-fade-in">
                          {allUnitTypes.filter(item => !activeTypes.includes(item.id)).map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setActiveTypes([...activeTypes, item.id]);
                                setCart(prev => ({ ...prev, [item.id]: 1 }));
                                setShowAddMenu(false);
                              }}
                              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#f0f4ff] transition-colors flex items-center justify-between text-xs font-extrabold text-slate-800"
                            >
                              <span>{item.name}</span>
                              <span className="text-[#004b87] font-black">Rp {item.fee.toLocaleString('id-ID')}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Referral Code Field */}
                  <div className="space-y-2 max-w-md mx-auto pt-2">
                    <label className="text-[10px] text-slate-500 font-black block uppercase tracking-wider">
                      Kode Referral Sales Agent <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      placeholder="Masukkan kode referral agent..."
                      className="w-full bg-[#f0f4ff]/80 border border-slate-200 rounded-2xl py-3.5 px-4 text-xs text-slate-900 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-[#004b87]/15 focus:border-[#004b87] transition-all font-semibold shadow-inner"
                    />
                  </div>

                  {/* Summary & Estimasi Total */}
                  <div className="border-t border-slate-100 pt-5 max-w-md mx-auto space-y-3 text-xs font-semibold text-slate-500">
                    <div className="flex justify-between">
                      <span>Total Jumlah Unit:</span>
                      <span className="text-slate-800 font-extrabold">
                        {Object.values(cart).reduce((a,b)=>a+b, 0)} Unit
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#0f294a] border-t border-slate-100 pt-3">
                      <span>Total Tagihan Booking Fee:</span>
                      <span className="text-[#004b87]">
                        Rp {Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Continue Action */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setModalStep(2)}
                      disabled={Object.values(cart).reduce((a,b)=>a+b, 0) === 0 || !referral.trim()}
                      className="w-full max-w-md bg-[#004b87] hover:bg-[#003d70] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-black py-4.5 rounded-2xl uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[#004b87]/20 flex items-center justify-center gap-2"
                    >
                      <span>Lanjut ke Opsi Pembayaran</span>
                      <ArrowRight size={14} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: CHOOSE PATHWAYS OR PAY INLINE */
                <div className="space-y-6 animate-fade-in relative">
                  
                  {isPaying && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-4 border-[#004b87]/20 border-t-[#004b87] rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-[#0f294a] uppercase tracking-wider animate-pulse">Memproses Transaksi...</span>
                    </div>
                  )}

                  {purchaseError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-start gap-3">
                      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                      <div className="text-[11px] font-semibold leading-normal">{purchaseError}</div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4.5 text-center max-w-md mx-auto space-y-1">
                    <p className="text-xs text-slate-700 font-bold leading-normal">
                      Pemesanan Aktif: <span className="text-[#004b87] font-black">{Object.keys(cart).map(t => cart[t] > 0 ? `${t} Plot (x${cart[t]})` : '').filter(Boolean).join(', ')}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Total Booking Fee: <span className="text-[#004b87] font-extrabold">Rp {Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">Kode Referral: {referral}</p>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold text-center max-w-md mx-auto leading-relaxed">
                    Silakan pilih alur transaksi yang paling sesuai dengan kebutuhan Anda saat ini.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* OPTION 1: BELI NUP DULU */}
                    <div 
                      className="bg-white border-2 border-slate-200 hover:border-[#004b87] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-lg hover:shadow-[#004b87]/10 relative overflow-hidden cursor-pointer" 
                      onClick={() => handlePurchase('nup')}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#f0f4ff] rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                      
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] text-[#004b87] flex items-center justify-center mb-5 group-hover:bg-[#004b87] group-hover:text-white transition-colors duration-300">
                          <Ticket size={24} />
                        </div>
                        <div className="mb-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#004b87] bg-[#f0f4ff] px-2.5 py-1 rounded-md mb-3 inline-block">
                            Alur Standar (Gratis NUP)
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-800 mb-2 leading-tight">
                          Beli NUP (Nomor Urut Pemesanan)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-6">
                          Dapatkan nomor urut antrean prioritas untuk memilih kavling fisik terbaik saat Customer Gathering diselenggarakan secara online/offline.
                        </p>
                      </div>
                      
                      <div className="w-full flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs font-bold text-[#004b87] group-hover:underline">Beli NUP (Rp 0)</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#004b87] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRight size={12} className="stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    {/* OPTION 2: LANGSUNG BOOKING FEE */}
                    <div 
                      className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/10 relative overflow-hidden cursor-pointer" 
                      onClick={() => handlePurchase('booking')}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                      
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                          <Layers size={24} />
                        </div>
                        <div className="mb-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block border border-emerald-100">
                            Alur Cepat (Direct Booking)
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-800 mb-2 leading-tight">
                          Langsung Booking Fee
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-6">
                          Pesan langsung unit kavling ini ke sistem pembayaran sekarang untuk mengamankan nomor unit secara definitif.
                        </p>
                      </div>
                      
                      <div className="w-full flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs font-bold text-emerald-600 group-hover:underline">Bayar Booking Fee</span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRight size={12} className="stroke-[3]" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            {!paySuccess && (
              <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                <span className="text-[10px] font-semibold text-slate-400">
                  Butuh bantuan dengan alur ini? <a href="#" className="text-[#004b87] hover:underline font-bold">Hubungi Sales Agent</a>
                </span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- DYNAMIC XENDIT PAYMENT SIMULATOR MODAL OVERLAY --- */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] overflow-y-auto flex items-center justify-center p-4">
          
          {/* Main simulator container */}
          <div className="bg-[#f4f7f9] text-[#1a202c] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            
            {/* Top Warning simulated header */}
            <div className="bg-[#f04438] text-white py-2 px-4.5 text-center text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5">
              <ShieldAlert size={14} />
              <span>You are in Test Mode and any transactions made are simulated and not real.</span>
            </div>

            {/* Simulated Xendit Navbar */}
            <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-sm">
                  I
                </div>
                <span className="font-extrabold text-[#1a202c] tracking-tight">Insira Memorial Park</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">English</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Standard Xendit Checkout Grid */}
            <div className="grid md:grid-cols-12 text-[#1a202c]">
              
              {/* Left side: Payment Methods */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                
                {/* PAY BEFORE EXPIRATION */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">PAY BEFORE MAY 25, 2026 AT 22:16</span>
                  <h2 className="text-3xl font-black text-[#1a202c] tracking-tight">
                    IDR {Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYMENT METHOD</h3>
                  
                  {/* Bank Transfer selector */}
                  <div 
                    onClick={() => setSelectedMethod('va')}
                    className={`border rounded-2xl p-4.5 flex flex-col gap-3 transition-all cursor-pointer ${
                      selectedMethod === 'va' 
                        ? 'border-blue-600 bg-blue-50/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 font-extrabold text-xs text-[#1a202c]">
                        <Building size={16} className="text-slate-400 shrink-0" />
                        <span>Bank Transfer</span>
                      </div>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>

                    {selectedMethod === 'va' && (
                      <div className="flex gap-2.5 pt-2 animate-in fade-in duration-300">
                        {['BCA', 'BNI', 'BRI'].map(bank => (
                          <button
                            key={bank}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBank(bank);
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                              selectedBank === bank
                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                : 'border-slate-200 text-slate-500 hover:text-slate-700 bg-white'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Card */}
                  <div 
                    onClick={() => setSelectedMethod('card')}
                    className={`border rounded-2xl p-4.5 flex items-center justify-between transition-all cursor-pointer ${
                      selectedMethod === 'card' 
                        ? 'border-blue-600 bg-blue-50/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-extrabold text-xs text-[#1a202c]">
                      <CreditCard size={16} className="text-slate-400 shrink-0" />
                      <span>Credit / Debit Card</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-extrabold">Visa / Master</span>
                  </div>

                  {/* E-Wallet */}
                  <div 
                    onClick={() => setSelectedMethod('ewallet')}
                    className={`border rounded-2xl p-4.5 flex items-center justify-between transition-all cursor-pointer ${
                      selectedMethod === 'ewallet' 
                        ? 'border-blue-600 bg-blue-50/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-extrabold text-xs text-[#1a202c]">
                      <Smartphone size={16} className="text-slate-400 shrink-0" />
                      <span>E-Wallet</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-extrabold">OVO, DANA</span>
                  </div>

                  {/* QR Payments */}
                  <div 
                    onClick={() => setSelectedMethod('qr')}
                    className={`border rounded-2xl p-4.5 flex items-center justify-between transition-all cursor-pointer ${
                      selectedMethod === 'qr' 
                        ? 'border-blue-600 bg-blue-50/10' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-extrabold text-xs text-[#1a202c]">
                      <QrCode size={16} className="text-slate-400 shrink-0" />
                      <span>QR Payments</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-extrabold">QRIS</span>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowSimulator(false);
                      setIsPaying(false);
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatedPaymentComplete}
                    disabled={isPaying}
                    className="flex-grow-[2] bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Pay Now (Simulate)</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right side: Order Summary */}
              <div className="md:col-span-5 bg-white border-l border-slate-200 p-6 sm:p-8 space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">ORDER SUMMARY</h3>
                
                <div className="space-y-4 font-semibold text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Invoice</span>
                    <strong className="text-sm text-[#1a202c] font-black font-mono tracking-wider">TRX-SIM-{nupCode}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Description</span>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-semibold">
                      Pembayaran Booking Fee NUP {nupCode}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3.5">
                    {Object.keys(cart).map(type => cart[type] > 0 && (
                      <div key={type} className="flex justify-between items-start">
                        <div>
                          <span className="text-slate-800 font-black block">
                            {type === 'SinglePremiere' ? 'Single - Premiere' : type === 'CouplePremiere' ? 'Couple - Premiere' : type === 'SignatureFamily' ? 'Signature Family' : type}
                          </span>
                          <span className="text-[10.5px] text-slate-400 font-extrabold">{cart[type]} × IDR {unitPrices[type].toLocaleString('id-ID')}</span>
                        </div>
                        <span className="text-[#1a202c] font-extrabold font-mono">IDR {(unitPrices[type] * cart[type]).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                      <span className="text-slate-400 font-bold">Subtotal</span>
                      <span className="text-slate-700 font-extrabold font-mono">
                        IDR {Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 text-sm font-black">
                      <span className="text-[#1a202c] uppercase tracking-wider">Total Amount Due</span>
                      <span className="text-blue-600 font-mono">
                        IDR {Object.keys(cart).reduce((total, type) => total + (unitPrices[type] * cart[type]), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
