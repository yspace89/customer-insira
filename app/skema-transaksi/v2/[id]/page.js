'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, calculateInstallment, getPayments } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import Image from 'next/image';

export default function SkemaTransaksiPage() {
  const params = useParams();
  const router = useRouter();
  const transactionCode = params.id; // e.g., INS-0926117

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' or 'installment'
  const [promoCode, setPromoCode] = useState('');
  const [selectedBank, setSelectedBank] = useState('BCA');

  // Dynamic state loaded from localStorage
  const [unitName, setUnitName] = useState('A03 - 2 - Signature Family');
  const [totalTagihan, setTotalTagihan] = useState(509000000);
  const [realPaymentId, setRealPaymentId] = useState(396);
  const cashback = 0;
  const bookingFee = 1000000;
  const sisaTagihan = totalTagihan - bookingFee - cashback;

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        // Load chosen unit details from localStorage
        const storedUnit = localStorage.getItem(`chosen_unit_${transactionCode}`);
        if (storedUnit) {
          const parsed = JSON.parse(storedUnit);
          setUnitName(parsed.name);
          if (parsed.type === 'Family') {
            setTotalTagihan(509000000);
          } else {
            setTotalTagihan(150000000);
          }
        }

        // Fetch payments list and resolve the real payment ID matching the transaction code
        const allPayments = await getPayments();
        const matchingPay = allPayments.find(p => p.transaction_code === transactionCode);
        if (matchingPay) {
          setRealPaymentId(matchingPay.id);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [transactionCode]);

  const handlePay = async () => {
    setSubmitting(true);
    try {
      const payload = {
        payment_type: paymentType,
        bank: selectedBank,
        promo_code: promoCode
      };
      
      const response = await calculateInstallment(transactionCode, payload);
      
      // If success, API returns payment_id. Override placeholder 396 with resolved real ID
      const paymentId = (response && response.payment_id !== 396) ? response.payment_id : realPaymentId;

      // Store checkout context in localStorage
      localStorage.setItem(`payment_checkout_${paymentId}`, JSON.stringify({
        payment_type: paymentType,
        bank: selectedBank,
        promo_code: promoCode,
        unit_name: unitName,
        total_bill: totalTagihan,
        booking_fee: bookingFee,
        nup_code: transactionCode
      }));
      
      router.push(`/pembayaran/${paymentId}`);
      
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Terjadi kesalahan saat memproses skema pembayaran.');
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
          title="Detail Pembayaran" 
          breadcrumbs={['Beranda', 'Pilih Unit', 'Skema Bayar']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 flex justify-center">
          {/* Mobile-sized card constraint to match screenshot layout */}
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* White Header */}
            <div className="p-6 pb-2 border-b border-slate-100 flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-bold text-slate-800">Detail Pembayaran</h1>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              
              {/* Unit Terpilih */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Unit Terpilih</h3>
                <div className="inline-block bg-red-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full">
                  {unitName}
                </div>
              </div>

              {/* Jenis Pembayaran */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Pilih Jenis Pembayaran</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentType === 'cash' ? 'border-[#003876] bg-[#003876]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                      {paymentType === 'cash' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Cash</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentType === 'installment' ? 'border-[#003876] bg-[#003876]' : 'border-slate-300 group-hover:border-slate-400'}`}>
                      {paymentType === 'installment' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Diangsur</span>
                  </label>
                </div>
              </div>

              {/* Rincian */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Rincian</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total Tagihan</span>
                    <span className="font-semibold text-slate-800">Rp {totalTagihan.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Cashback</span>
                    <span className="font-semibold text-slate-800">Rp {cashback}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Booking Fee</span>
                    <span className="font-semibold text-red-600">-Rp {bookingFee.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-dashed border-slate-200 mt-3">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>Sisa Tagihan</span>
                      <span>Rp {sisaTagihan.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kode Promo */}
              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Kode Promo</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Masukkan kode jika memiliki promo khusus</p>
                </div>
                <button className="border border-[#003876] text-[#003876] text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Masukkan kode
                </button>
              </div>

              {/* Virtual Account Selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Pilih Virtual Account</h3>
                <div className="flex gap-3">
                  {/* BCA */}
                  <button 
                    onClick={() => setSelectedBank('BCA')}
                    className={`flex-1 border rounded-xl h-14 flex items-center justify-center p-2 transition-all ${selectedBank === 'BCA' ? 'border-[#003876] ring-1 ring-[#003876] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="font-black text-[#0066AE] text-xl tracking-tighter italic flex items-center">
                      BCA
                    </div>
                  </button>
                  {/* BNI */}
                  <button 
                    onClick={() => setSelectedBank('BNI')}
                    className={`flex-1 border rounded-xl h-14 flex items-center justify-center p-2 transition-all ${selectedBank === 'BNI' ? 'border-[#003876] ring-1 ring-[#003876] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="font-black text-[#006A63] text-xl tracking-tighter flex items-center">
                      <span className="text-[#F26421]">B</span>NI
                    </div>
                  </button>
                  {/* BRI */}
                  <button 
                    onClick={() => setSelectedBank('BRI')}
                    className={`flex-1 border rounded-xl h-14 flex items-center justify-center p-2 transition-all ${selectedBank === 'BRI' ? 'border-[#003876] ring-1 ring-[#003876] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="font-black text-[#00519E] text-base tracking-tighter flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#00519E] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white"></div></div>
                      BANK BRI
                    </div>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Action Bar */}
            <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">👁️</span>
                Lihat Ringkasan
              </button>
              
              <button
                disabled={submitting}
                onClick={handlePay}
                className={`bg-[#003876] hover:bg-[#002855] text-white text-sm font-bold px-8 py-3 rounded-xl shadow-lg transition-all ${submitting ? 'opacity-80 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}`}
              >
                {submitting ? <RefreshCcw size={16} className="animate-spin" /> : 'Bayar'}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
