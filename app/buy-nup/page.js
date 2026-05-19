// app/buy-nup/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, createNupTransaction } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  Ticket, 
  Check, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle2, 
  ChevronDown, 
  Info,
  CreditCard,
  Building,
  Smartphone,
  QrCode,
  Calendar,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function BuyNupPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [unitType, setUnitType] = useState('Single'); // 'Single', 'Double', 'Family', 'Royal'
  const [quantity, setQuantity] = useState(1);
  const [referral, setReferral] = useState('Pro8a');

  // Checkout states
  const [showSimulator, setShowSimulator] = useState(false);
  const [showRealSuccess, setShowRealSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('va'); // 'va', 'card', 'ewallet', 'qr'
  const [selectedBank, setSelectedBank] = useState('BCA'); // 'BCA', 'BNI', 'BRI'
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Dynamic invoice and NUP code generation
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [nupCode, setNupCode] = useState('');

  // Unit pricing (Booking fee values)
  const unitPrices = {
    Single: 1000000,
    Double: 2000000,
    Family: 5000000,
    Royal: 10000000
  };

  const bookingFeeAmount = unitPrices[unitType] * quantity;

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

    // Generate random invoice and NUP code
    const randInvoice = 'TRX' + Math.floor(100000000000 + Math.random() * 900000000000);
    const randNup = 'INS-0926' + Math.floor(100 + Math.random() * 900);
    setInvoiceNumber(randInvoice);
    setNupCode(randNup);
  }, []);

  const handlePurchase = async () => {
    if (!unitType || !referral) return;
    
    setIsPaying(true);
    setPurchaseError('');
    try {
      // Map unit type string to database ID
      const unitTypeIds = {
        Single: 1,
        Double: 2,
        Family: 3,
        Royal: 4
      };
      
      const unitTypeId = unitTypeIds[unitType] || 1;

      // Robust payload to prevent Laravel/Kotahati backend validator errors
      const payload = {
        project_id: 3,
        project: 3,
        Project: 3,
        unit_qty: quantity,
        referral_code: referral,
        priority_unit_type: unitType,
        unit_type_id: unitTypeId,
        units: [
          {
            unit_type_id: unitTypeId,
            name: unitType,
            type: unitType,
            qty: quantity,
            quantity: quantity,
            unit_qty: quantity
          }
        ]
      };
      
      const res = await createNupTransaction(payload);
      
      // If the staging server returns the actual Xendit checkout URL, redirect immediately!
      const realXenditUrl = res.data?.invoice_url || res.invoice_url || res.url;
      if (realXenditUrl) {
        window.location.href = realXenditUrl;
        return;
      }
      
      // Since it succeeded with no Xendit URL (NUP is Rp 0 free), show real success popup
      setShowRealSuccess(true);
    } catch (err) {
      // Try to parse JSON error message from the staging server
      let serverErrorMsg = '';
      try {
        const parsed = JSON.parse(err.message);
        serverErrorMsg = parsed.message || parsed.data?.errors?.[0];
      } catch (e) {
        // Not a JSON error
      }
      
      if (serverErrorMsg) {
        // Show real staging business logic error to the user
        setPurchaseError(serverErrorMsg);
      } else {
        // Fallback to local simulator for general network or CORS blocks
        console.warn('Staging NUP transaction creation failed, falling back to local simulation:', err);
        setShowSimulator(true);
      }
    } finally {
      setIsPaying(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsPaying(true);
    setTimeout(() => {
      // Create new simulated NUP
      const newNup = {
        id: Date.now(),
        nup_code: nupCode,
        units_count: quantity,
        sales_name: referral === 'Pro8a' ? 'Yala' : 'Sales Agent',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: new Date().toISOString(),
        status: 'Pembayaran Berhasil',
        has_booking_fee: false
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('simulated_nups') || '[]');
      localStorage.setItem('simulated_nups', JSON.stringify([newNup, ...existing]));

      setIsPaying(false);
      setPaySuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title="Beli NUP" 
          breadcrumbs={['Beranda', 'Nomor Urut Pemesanan', 'Beli NUP']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
          
          {/* HEADER BACK NAVIGATION */}
          <Link 
            href="/nup"
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer w-fit"
          >
            <ChevronRight size={14} className="rotate-180" />
            <span>Kembali ke Halaman NUP</span>
          </Link>

          {/* BUY NUP DESCRIPTION BANNER */}
          <div className="bg-[#0b1329] border border-blue-950 rounded-3xl p-6.5 sm:p-8 flex items-start gap-4 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Ticket size={24} />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                NUP (Nomor Urut Pemesanan)
              </h2>
              <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                NUP adalah nomor yang memastikan Anda terdaftar sebagai calon pembeli. Jika Anda ingin mengikuti Customer Gathering dan mendapatkan informasi eksklusif tentang unit terbaik, maka NUP adalah langkah pertama yang perlu Anda ambil.
              </p>
            </div>
          </div>

          {/* REAL STAGING ERROR ALERT BANNER */}
          {purchaseError && (
            <div className="bg-red-950/10 border border-red-500/20 text-red-400 p-5 rounded-3xl flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-300">
              <ShieldAlert size={18} className="shrink-0 mt-0.5 text-red-500" />
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Gagal Membeli NUP (Aturan Staging)</h4>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-350">{purchaseError}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1 & 2: FORM TENTUKAN TIPE UNIT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                  <span>Tentukan Tipe Unit</span>
                </h3>
                
                {/* SELECT UNIT TYPE DROPDOWN */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Tipe Unit Diminati <span className="text-amber-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold appearance-none cursor-pointer"
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Family">Family</option>
                      <option value="Royal">Royal</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* DYNAMIC SELECTED TAG & QUANTITY INPUT */}
                {unitType && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                        {unitType}
                        <button 
                          onClick={() => setUnitType('')} 
                          className="hover:text-white transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                        Jumlah {unitType} <span className="text-amber-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-11 h-11 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 h-11 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-white focus:outline-none font-extrabold"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-11 h-11 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* REFERRAL CODE INPUT */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Kode Referral <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    placeholder="Masukkan kode referral sales agent..."
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-semibold"
                  />
                </div>

                {/* BOOKING FEE CALCULATOR BOX */}
                {unitType && (
                  <div className="bg-[#0b101d] border border-slate-850 p-5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-slate-450 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Biaya Booking Fee</h4>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                          Biaya Booking Fee dibayarkan pada tahap berikutnya (setelah NUP). Dapat berubah jika Anda mengubah tipe unit diminati & jumlah tipe unit yang dipesan.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">{unitType} x{quantity}</span>
                      <span className="text-white">Rp {bookingFeeAmount.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-black border-t border-slate-900/60 pt-3">
                      <span className="text-slate-400 uppercase tracking-wider">Total Harga</span>
                      <span className="text-amber-400">Rp {bookingFeeAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 3: BIAYA NUP SIDEBAR CARD */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
                <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2">
                  <span>Biaya NUP</span>
                </h3>
                
                <div className="space-y-4.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase">NUP</span>
                    <span className="text-white">Rp. 0</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-black border-t border-slate-900 pt-4">
                    <span className="text-slate-500 uppercase tracking-widest">Total</span>
                    <span className="text-amber-400">Rp. 0</span>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={!unitType || !referral}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 text-xs font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg shadow-amber-500/5 uppercase tracking-widest mt-2"
                  >
                    <span>Beli</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* DYNAMIC XENDIT PAYMENT SIMULATOR MODAL */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4">
          
          {/* Main simulator container */}
          <div className="bg-[#f4f7f9] text-[#1a202c] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 my-8">
            
            {/* Top Red Alert simulated header */}
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

            {paySuccess ? (
              /* Simulated Payment Success screen */
              <div className="p-10 text-center space-y-6 bg-white animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#1a202c] uppercase tracking-wider">Pembayaran NUP Berhasil!</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md mx-auto">
                    Nomor Urut Pemesanan Anda telah sukses diterbitkan dan ditransaksikan menggunakan simulasi Xendit.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left max-w-md mx-auto space-y-3 font-semibold text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Nomor NUP:</span>
                    <span className="text-slate-900 font-black">{nupCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tipe Unit:</span>
                    <span className="text-slate-900 font-extrabold">{unitType} (x{quantity})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Dibayar:</span>
                    <span className="text-slate-900 font-extrabold">Rp {bookingFeeAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Invoice:</span>
                    <span className="text-slate-900 font-extrabold font-mono text-[10px]">{invoiceNumber}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowSimulator(false);
                    setPaySuccess(false);
                    router.push('/nup');
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-6.5 py-4 rounded-2xl cursor-pointer w-fit uppercase tracking-widest transition-all"
                >
                  Kembali ke Halaman NUP
                </button>
              </div>
            ) : (
              /* Standard Xendit Checkout Grid */
              <div className="grid md:grid-cols-12">
                
                {/* Left side: Payment Methods */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                  
                  {/* PAY BEFORE EXPIRATION */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">PAY BEFORE MAY 25, 2026 AT 22:16</span>
                    <h2 className="text-3xl font-black text-[#1a202c] tracking-tight">
                      IDR {bookingFeeAmount.toLocaleString('id-ID')}
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
                      onClick={() => setShowSimulator(false)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePaymentComplete}
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
                      <strong className="text-sm text-[#1a202c] font-black font-mono tracking-wider">{invoiceNumber}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Description</span>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-semibold">
                        Pembayaran Booking Fee NUP {nupCode}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-slate-800 font-black block">Booking Fee untuk Tipe Unit {unitType}</span>
                          <span className="text-[10.5px] text-slate-400 font-extrabold">{quantity} × IDR {unitPrices[unitType].toLocaleString('id-ID')}</span>
                        </div>
                        <span className="text-[#1a202c] font-extrabold">IDR {bookingFeeAmount.toLocaleString('id-ID')}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                        <span className="text-slate-400 font-bold">Subtotal</span>
                        <span className="text-slate-700 font-extrabold">IDR {bookingFeeAmount.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 text-sm font-black">
                        <span className="text-[#1a202c] uppercase tracking-wider">Total Amount Due</span>
                        <span className="text-blue-600">IDR {bookingFeeAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* REAL STAGING SUCCESS POPUP */}
      {showRealSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10b981] mx-auto">
              <CheckCircle2 size={36} />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Berhasil</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Pembelian NUP telah berhasil!
              </p>
            </div>

            <button
              onClick={() => {
                setShowRealSuccess(false);
                router.push('/nup');
              }}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black py-3.5 rounded-2xl cursor-pointer uppercase tracking-widest transition-all"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
