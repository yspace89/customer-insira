// app/pembayaran/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getProfile, getPayments } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Copy, 
  Check, 
  Calendar, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CreditCard,
  CheckCircle2,
  DollarSign,
  Clock,
  FileText,
  ShieldCheck,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [profile, setProfile] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction states
  const [copied, setCopied] = useState(false);
  const [activeInstruction, setActiveInstruction] = useState('mbanking'); // 'atm', 'mbanking', 'ibanking'
  const [activeTab, setActiveTab] = useState('detail'); // 'detail', 'skema', 'prosesi', 'akad'
  const [isPPJBSigned, setIsPPJBSigned] = useState(false); // E-Signature status for Akad
  const [showSignModal, setShowSignModal] = useState(false); // Sign verification popup

  useEffect(() => {
    async function loadData() {
      try {
        const prof = await getProfile();
        setProfile(prof);

        const allPayments = await getPayments();
        let found = allPayments.find(p => p.id === id);

        // Retrieve custom checkout details if stored to merge or fall back dynamically
        const stored = localStorage.getItem(`payment_checkout_${id}`);
        if (stored) {
          const checkout = JSON.parse(stored);
          const customVA = checkout.bank === 'BCA' 
            ? '132819999000' + id 
            : checkout.bank === 'BNI' 
              ? '82719999000' + id 
              : '132819999000' + id;
          
          if (found) {
            found = {
              ...found,
              bank_name: `${checkout.bank} Virtual Account`,
              virtual_account: customVA,
              status: checkout.payment_type === 'cash' ? 'Tagihan Lunas' : found.status,
              total_bill: checkout.payment_type === 'installment' ? checkout.total_bill - checkout.booking_fee : 0,
              next_bill_amount: checkout.payment_type === 'installment' ? Math.round((checkout.total_bill - checkout.booking_fee) / 12) : 0,
              remaining_balance: checkout.payment_type === 'installment' ? checkout.total_bill - checkout.booking_fee : 0
            };
          } else {
            found = {
              id: id,
              transaction_code: checkout.nup_code || 'INS-0126145',
              status: checkout.payment_type === 'cash' ? 'Tagihan Lunas' : '1 Tagihan Jatuh Tempo',
              units_count: 1,
              tenor_months: checkout.payment_type === 'installment' ? 12 : 0,
              total_bill: checkout.payment_type === 'installment' ? checkout.total_bill - checkout.booking_fee : 0,
              procession_packages: '1 Paket Prosesi',
              due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              next_bill_amount: checkout.payment_type === 'installment' ? Math.round((checkout.total_bill - checkout.booking_fee) / 12) : 0,
              virtual_account: customVA,
              bank_name: `${checkout.bank} Virtual Account`,
              remaining_balance: checkout.payment_type === 'installment' ? checkout.total_bill - checkout.booking_fee : 0,
              payments_history: [
                { date: new Date().toISOString().split('T')[0], amount: checkout.booking_fee, name: 'Booking Fee' }
              ]
            };
          }
        }
        setPayment(found);
      } catch (err) {
        console.error('Failed to load payment details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleCopyVA = () => {
    if (!payment?.virtual_account) return;
    navigator.clipboard.writeText(payment.virtual_account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-[#060913] pl-80 flex flex-col justify-center items-center text-center p-6">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-white">Detail Pembayaran Tidak Ditemukan</h3>
        <button 
          onClick={() => router.push('/pembayaran')}
          className="mt-4 bg-slate-900 border border-slate-800 text-white text-xs font-black px-5 py-3 rounded-2xl cursor-pointer"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  const isLunas = payment.status === 'Tagihan Lunas';

  return (
    <div className="min-h-screen bg-[#060913]">
      <Sidebar profile={profile} />
      
      <div className="pl-80 flex flex-col min-h-screen">
        <Header 
          title={`Detail Pembayaran: ${payment.transaction_code}`} 
          breadcrumbs={['Beranda', 'Pembayaran', 'Detail']} 
          profile={profile} 
        />
        
        <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* BACK ACTION */}
          <button 
            onClick={() => router.push('/pembayaran')}
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Halaman Pembayaran</span>
          </button>

          {/* SLIDING TABS SWITCH */}
          <div className="flex gap-4 p-1.5 bg-slate-950/60 border border-slate-900 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('detail')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'detail'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white bg-transparent border-0'
              }`}
            >
              <CreditCard size={14} />
              <span>Detail Pembayaran</span>
            </button>
            
            <button
              onClick={() => setActiveTab('skema')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'skema'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white bg-transparent border-0'
              }`}
            >
              <Calendar size={14} />
              <span>Skema</span>
            </button>

            <button
              onClick={() => setActiveTab('prosesi')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'prosesi'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white bg-transparent border-0'
              }`}
            >
              <Clock size={14} />
              <span>Prosesi Pemakaman</span>
            </button>

            <button
              onClick={() => setActiveTab('akad')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'akad'
                  ? 'custom-tab-active'
                  : 'text-slate-400 hover:text-white bg-transparent border-0'
              }`}
            >
              <FileText size={14} />
              <span>Akad</span>
            </button>
          </div>

          {activeTab === 'detail' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* DUE ALERT BANNER */}
              {!isLunas && (
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-amber-950/20 p-4.5 flex items-center justify-between shadow-lg shadow-amber-500/5 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Tagihan Berjalan Jatuh Tempo
                      </h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                        Harap selesaikan pembayaran sebelum tanggal {payment.due_date ? new Date(payment.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '05 April 2026'}.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCopyVA}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl cursor-pointer"
                  >
                    <span>Bayar Sekarang</span>
                  </button>
                </div>
              )}

              {/* DETAIL GRID LAYOUT */}
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1 & 2: INVOICE DETAILS & METHOD */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* CARD 1: DETAIL TAGIHAN */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                      <DollarSign size={16} className="text-amber-400" />
                      <span>Informasi Tagihan</span>
                    </h3>
                    
                    <div className="space-y-6">
                      {isLunas ? (
                        <div className="flex items-center gap-3.5 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                          <CheckCircle2 className="text-emerald-400 w-6 h-6 shrink-0" />
                          <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">Tagihan Lunas Terbayar</h4>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-relaxed">
                              Seluruh kewajiban pembayaran cicilan untuk transaksi ini telah diselesaikan dengan sukses.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Batas Jatuh Tempo</span>
                            <span className="text-sm font-extrabold text-white mt-1 block flex items-center gap-1.5">
                              <Calendar size={14} className="text-amber-400" />
                              {payment.due_date ? new Date(payment.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '05 April 2026'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total Tagihan Berjalan</span>
                            <span className="text-base font-black text-amber-400 mt-1 block">
                              Rp {payment.next_bill_amount ? payment.next_bill_amount.toLocaleString('id-ID') : '47.800.000'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Catatan Rincian</span>
                        <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                          {isLunas 
                            ? 'Semua angsuran pelunasan berkas dan lahan makam keluarga telah selesai diproses oleh admin keuangan Insira.'
                            : `Booking Fee sebesar Rp 1.000.000 yang telah Anda bayarkan sudah kami terima. Sisa tagihan pelunasan yang perlu diselesaikan adalah sebesar Rp ${payment.remaining_balance ? payment.remaining_balance.toLocaleString('id-ID') : '265.700.000'}.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: METODE PEMBAYARAN */}
                  {!isLunas && (
                    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                        <CreditCard size={16} className="text-amber-400" />
                        <span>Metode Pembayaran</span>
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-6 items-center">
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Bank Penerima</span>
                            <span className="text-xs text-white font-extrabold mt-1.5 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl inline-block">
                              {payment.bank_name || 'BRI Virtual Account'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Nomor Virtual Account</span>
                            <div className="flex items-center gap-2.5 mt-2">
                              <span className="text-sm font-extrabold text-white tracking-widest select-all bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-900">
                                {payment.virtual_account || '132819999000257'}
                              </span>
                              <button
                                onClick={handleCopyVA}
                                className="w-9 h-9 rounded-xl border border-slate-850 hover:border-amber-400/50 hover:text-white flex items-center justify-center text-slate-400 transition-all cursor-pointer bg-slate-950"
                                title="Salin No VA"
                              >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* VA Info card */}
                        <div className="p-5 bg-blue-500/5 border border-blue-900/20 rounded-2xl flex items-start gap-3">
                          <HelpCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Nomor VA Bersifat Tetap</h4>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                              Gunakan nomor Virtual Account di atas untuk setiap pembayaran angsuran Anda. Pembayaran akan terverifikasi otomatis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* COLUMN 3: PAYMENT HISTORY */}
                <div className="space-y-6 h-fit">
                  <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                      <Clock size={16} className="text-amber-400" />
                      <span>Riwayat Transaksi</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {payment.payments_history?.map((hist, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-2xl relative overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                                {hist.name || 'Angsuran'}
                              </span>
                              <span className="text-[11px] text-white font-extrabold block mt-0.5">
                                Rp {hist.amount.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">
                              {new Date(hist.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <button className="flex items-center gap-1 text-[8px] font-black text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest cursor-pointer">
                              <Download size={10} />
                              <span>Unduh Bukti</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: INSTRUCTION GUIDE ACCORDIONS */}
              {!isLunas && (() => {
                const bankType = payment.bank_name?.toLowerCase().includes('bca') 
                  ? 'BCA' 
                  : payment.bank_name?.toLowerCase().includes('bni') 
                    ? 'BNI' 
                    : 'BRI';
                    
                return (
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-amber-400" />
                      <span>Panduan Tata Cara Pembayaran VA</span>
                    </h3>
                    
                    {/* Tab Selector for Instructions */}
                    <div className="flex gap-2.5 border-b border-slate-900 pb-3 flex-wrap">
                      {[
                        { id: 'mbanking', label: bankType === 'BCA' ? 'BCA Mobile (m-BCA)' : bankType === 'BNI' ? 'BNI Mobile Banking' : 'BRI Mobile (BRIMO)' },
                        { id: 'atm', label: `ATM ${bankType}` },
                        { id: 'ibanking', label: bankType === 'BCA' ? 'KlikBCA' : bankType === 'BNI' ? 'BNI Internet Banking' : 'Internet Banking' }
                      ].map((ins) => (
                        <button
                          key={ins.id}
                          onClick={() => setActiveInstruction(ins.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            activeInstruction === ins.id
                              ? 'custom-tab-active'
                              : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ins.label}
                        </button>
                      ))}
                    </div>

                    {/* Instructions steps details */}
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-900">
                      {activeInstruction === 'mbanking' && (
                        <ol className="list-decimal list-inside space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                          {bankType === 'BCA' ? (
                            <>
                              <li>Buka aplikasi <strong>m-BCA</strong> di smartphone Anda lalu login menggunakan kode akses Anda.</li>
                              <li>Pilih menu <strong>m-Transfer</strong> pada navigasi transaksi utama.</li>
                              <li>Pilih <strong>BCA Virtual Account</strong> lalu masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Sistem akan mendeteksi otomatis tagihan bernama <strong>Insira Memorial Park - {profile?.name}</strong>.</li>
                              <li>Periksa kembali nominal pembayaran, lalu klik <strong>Send</strong> dan masukkan PIN m-BCA Anda.</li>
                            </>
                          ) : bankType === 'BNI' ? (
                            <>
                              <li>Buka aplikasi <strong>BNI Mobile Banking</strong> dan login menggunakan MPIN Anda.</li>
                              <li>Pilih menu <strong>Transfer</strong> lalu pilih <strong>Virtual Account Billing</strong>.</li>
                              <li>Pilih rekening debet lalu masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Sistem akan mendeteksi otomatis tagihan bernama <strong>Insira Memorial Park - {profile?.name}</strong>.</li>
                              <li>Periksa nominal pembayaran, masukkan password transaksi BNI Mobile Anda.</li>
                            </>
                          ) : (
                            <>
                              <li>Buka aplikasi <strong>BRIMO</strong> di smartphone Anda lalu login menggunakan username & password.</li>
                              <li>Pilih menu <strong>BRIVA</strong> pada daftar navigasi transaksi utama.</li>
                              <li>Pilih <strong>Pembayaran Baru</strong> lalu masukan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Sistem akan mendeteksi otomatis tagihan bernama <strong>Insira Memorial Park - {profile?.name}</strong>.</li>
                              <li>Periksa kembali rincian nominal pembayaran, lalu klik <strong>Bayar</strong>.</li>
                              <li>Masukan <strong>PIN BRIMO</strong> Anda untuk menyelesaikan proses otorisasi transaksi.</li>
                            </>
                          )}
                        </ol>
                      )}

                      {activeInstruction === 'atm' && (
                        <ol className="list-decimal list-inside space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                          {bankType === 'BCA' ? (
                            <>
                              <li>Masukkan kartu ATM BCA dan input PIN keamanan Anda.</li>
                              <li>Pilih menu <strong>Transaksi Lainnya</strong> lalu pilih menu <strong>Transfer</strong>.</li>
                              <li>Pilih menu <strong>Ke Rekening BCA Virtual Account</strong>.</li>
                              <li>Masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong> lalu tekan Benar.</li>
                              <li>Konfirmasi detail pemesanan Insira di layar ATM, lalu tekan Ya jika sudah sesuai.</li>
                            </>
                          ) : bankType === 'BNI' ? (
                            <>
                              <li>Masukkan kartu ATM BNI dan masukkan PIN keamanan Anda.</li>
                              <li>Pilih menu <strong>Menu Lain</strong> lalu pilih <strong>Transfer</strong>.</li>
                              <li>Pilih jenis rekening pengirim lalu pilih <strong>Virtual Account Billing</strong>.</li>
                              <li>Masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Konfirmasi rincian pembayaran di layar ATM dan pilih Ya untuk memproses transaksi.</li>
                            </>
                          ) : (
                            <>
                              <li>Masukan kartu ATM BRI dan input PIN keamanan kartu Anda.</li>
                              <li>Pilih menu <strong>Transaksi Lainnya</strong> lalu pilih menu <strong>Pembayaran</strong>.</li>
                              <li>Pilih menu <strong>Lainnya</strong> dan temukan pilihan menu <strong>BRIVA</strong>.</li>
                              <li>Masukan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong> lalu tekan Benar.</li>
                              <li>Konfirmasi detail pemesanan Insira di layar ATM, lalu tekan Ya jika sudah sesuai.</li>
                              <li>Simpan struk transaksi ATM sebagai bukti pembayaran sah Anda.</li>
                            </>
                          )}
                        </ol>
                      )}

                      {activeInstruction === 'ibanking' && (
                        <ol className="list-decimal list-inside space-y-3.5 text-xs text-slate-300 font-semibold leading-relaxed">
                          {bankType === 'BCA' ? (
                            <>
                              <li>Login ke portal KlikBCA.</li>
                              <li>Pilih menu <strong>Transfer Dana</strong> lalu pilih <strong>Transfer ke BCA Virtual Account</strong>.</li>
                              <li>Masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Masukkan respon KeyBCA APPLI 1 untuk memverifikasi transaksi Anda.</li>
                            </>
                          ) : bankType === 'BNI' ? (
                            <>
                              <li>Login ke portal BNI Internet Banking.</li>
                              <li>Pilih menu <strong>Transaksi</strong> lalu pilih <strong>Virtual Account Billing</strong>.</li>
                              <li>Masukkan nomor Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong>.</li>
                              <li>Masukkan respon token BNI B-Secure Anda untuk mengotorisasi pembayaran.</li>
                            </>
                          ) : (
                            <>
                              <li>Kunjungi laman portal Internet Banking BRI lalu login akun Anda.</li>
                              <li>Pilih menu <strong>Pembayaran & Pembelian</strong> pada sidebar menu.</li>
                              <li>Pilih sub-menu <strong>BRIVA</strong>.</li>
                              <li>Masukan kode bayar Virtual Account: <strong className="text-amber-400 select-all tracking-wider">{payment.virtual_account}</strong> lalu klik Kirim.</li>
                              <li>Masukan nominal bayar dan masukkan password serta nomor m-Token untuk verifikasi transaksi.</li>
                            </>
                          )}
                        </ol>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'skema' && (() => {
            const tenor = payment.tenor_months || 0;
            const totalBill = payment.total_bill || 150000000;
            const bookingFee = 1000000;
            const remainingBalance = payment.remaining_balance || (totalBill - bookingFee);
            const installmentAmount = payment.next_bill_amount || (tenor > 0 ? Math.round(remainingBalance / tenor) : 0);

            return (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* METRICS HEADER */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card rounded-3xl p-5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Skema Pembayaran</span>
                    <span className="text-sm font-extrabold text-white mt-1.5 block">
                      {tenor > 0 ? `Cicilan ${tenor} Bulan` : 'Cash Keras'}
                    </span>
                  </div>

                  <div className="glass-card rounded-3xl p-5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Total Harga Lahan</span>
                    <span className="text-sm font-extrabold text-white mt-1.5 block">
                      Rp {totalBill.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="glass-card rounded-3xl p-5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Booking Fee Terbayar</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-1.5 block">
                      Rp {bookingFee.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="glass-card rounded-3xl p-5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Sisa Tagihan Pokok</span>
                    <span className="text-sm font-extrabold text-amber-400 mt-1.5 block">
                      Rp {remainingBalance.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* TABLE OF INSTALLMENTS */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center gap-2.5">
                    <Calendar size={16} className="text-amber-400" />
                    <span>Jadwal Angsuran & Pelunasan</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                          <th className="py-3 px-4">No</th>
                          <th className="py-3 px-4">Kategori Tagihan</th>
                          <th className="py-3 px-4">Jatuh Tempo</th>
                          <th className="py-3 px-4">Nominal</th>
                          <th className="py-3 px-4">Metode</th>
                          <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-xs font-semibold text-white">
                        {/* Row 1: Booking Fee (Always Paid) */}
                        <tr className="hover:bg-slate-950/20 transition-colors">
                          <td className="py-3.5 px-4 text-slate-400">1</td>
                          <td className="py-3.5 px-4 font-bold">Uang Muka (Booking Fee)</td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {payment.payments_history && payment.payments_history[0] 
                              ? new Date(payment.payments_history[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Terverifikasi'}
                          </td>
                          <td className="py-3.5 px-4">Rp {bookingFee.toLocaleString('id-ID')}</td>
                          <td className="py-3.5 px-4">Virtual Account</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              <CheckCircle2 size={10} />
                              Lunas
                            </span>
                          </td>
                        </tr>

                        {/* Cicilan/Pelunasan Rows */}
                        {tenor === 0 || isLunas ? (
                          /* Cash Pelunasan */
                          <tr className="hover:bg-slate-950/20 transition-colors">
                            <td className="py-3.5 px-4 text-slate-400">2</td>
                            <td className="py-3.5 px-4 font-bold">Pelunasan Lahan (Cash)</td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {payment.due_date ? new Date(payment.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '05 April 2026'}
                            </td>
                            <td className="py-3.5 px-4">Rp {remainingBalance.toLocaleString('id-ID')}</td>
                            <td className="py-3.5 px-4">Virtual Account</td>
                            <td className="py-3.5 px-4 text-right">
                              <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                isLunas 
                                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                                  : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                              }`}>
                                {isLunas ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                {isLunas ? 'Lunas' : 'Belum Dibayar'}
                              </span>
                            </td>
                          </tr>
                        ) : (
                          /* Installment Rows */
                          [...Array(tenor)].map((_, index) => {
                            const monthsToAdd = index + 1;
                            const baseDate = payment.created_at ? new Date(payment.created_at) : new Date();
                            const dueDate = new Date(baseDate.setMonth(baseDate.getMonth() + monthsToAdd));
                            
                            const statusLabel = index === 0 ? 'Jatuh Tempo' : 'Belum Jatuh Tempo';
                            const statusColorClass = index === 0 
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' 
                              : 'text-slate-500 bg-slate-900 border border-slate-800';

                            return (
                              <tr key={index} className="hover:bg-slate-950/20 transition-colors">
                                <td className="py-3.5 px-4 text-slate-400">{index + 2}</td>
                                <td className="py-3.5 px-4 font-bold">Angsuran Bulan ke-{monthsToAdd}</td>
                                <td className="py-3.5 px-4 text-slate-400">
                                  {dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="py-3.5 px-4">Rp {installmentAmount.toLocaleString('id-ID')}</td>
                                <td className="py-3.5 px-4">Virtual Account</td>
                                <td className="py-3.5 px-4 text-right">
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColorClass}`}>
                                    {index === 0 && <ShieldAlert size={10} className="text-amber-400 animate-pulse" />}
                                    {statusLabel}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'prosesi' && (
            <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Paket Prosesi Pemakaman Keluarga
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        Status Layanan: <strong className="text-amber-400">AKTIF / STANDAR COVERED</strong>
                      </span>
                    </div>
                  </div>

                  <span className="gold-gradient text-slate-950 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest self-start sm:self-center">
                    Standar Insira
                  </span>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                  Setiap pembelian unit makam di Insira Memorial Park telah dilengkapi dengan **Paket Layanan Prosesi Pemakaman Standar**. Layanan ini dirancang khusus untuk memberikan ketenangan pikiran bagi keluarga yang ditinggalkan selama proses pemakaman berlangsung.
                </p>

                {/* SERVICES GRID */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  {[
                    { title: 'Persiapan Lahan Pemakaman', desc: 'Penggalian makam presisi sesuai ukuran, pemasangan penguat dinding kuburan beton/kayu, penyiapan papan penutup, serta taburan bunga wangi dasar makam.' },
                    { title: 'Perlengkapan Area Prosesi', desc: 'Penyewaan tenda VIP putih eksklusif ukuran 6x6 meter, penyediaan 30 unit kursi lipat berselimut kain putih, karpet beludru merah, dan sound system portabel nirkabel.' },
                    { title: 'Dekorasi & Rangkaian Bunga', desc: 'Satu set standing flower dekoratif berisikan bunga segar di samping makam, serta 2 keranjang bunga tabur segar wangi untuk keluarga inti.' },
                    { title: 'Jasa Pemandu Doa & MC', desc: 'Pendampingan Ustadz / Rohaniwan pemandu doa pemakaman yang tenang & khidmat, serta pembawa acara (MC) seremonial pemakaman keluarga.' },
                    { title: 'Akomodasi Sanitasi Pelayat', desc: 'Penyediaan 2 box air mineral botol dingin, tisu kering & basah, serta 10 unit payung pelindung cuaca panas atau hujan di lokasi makam.' },
                    { title: 'Dokumentasi Khidmat', desc: 'Jasa fotografer profesional untuk mendokumentasikan momen penting pemakaman secara sopan & tenang. Tautan unduhan digital dikirimkan dalam 48 jam.' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-5 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-2 relative overflow-hidden group hover:border-slate-800 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-[10px] font-black">
                          ✓
                        </span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{srv.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed pl-7">
                        {srv.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* UPGRADE AREA */}
                <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Butuh Layanan Tambahan?</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Tingkatkan ke Paket Deluxe atau VIP untuk mendapatkan layanan katering pelayat, gazebo teduh permanen, dan siaran live streaming pemakaman.
                    </p>
                  </div>

                  <button className="gold-gradient gold-gradient-hover text-slate-950 text-xs font-black px-5 py-3 rounded-2xl cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/5 uppercase tracking-widest transition-all hover:scale-[1.01] shrink-0">
                    <span>Upgrade Paket Layanan</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'akad' && (
            <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                
                {/* AKAD STATUS HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Perjanjian Pengikatan Jual Beli (PPJB) Kavling
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        Nomor Registrasi Akad: <strong className="text-amber-400">PPJB/IMP/2026/040{id}</strong>
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest self-start sm:self-center border ${
                    isPPJBSigned 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {isPPJBSigned ? 'Tandatangan Terverifikasi' : 'Menunggu Tandatangan'}
                  </span>
                </div>

                {/* SCROLLABLE CONTRACT PAPER */}
                <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 sm:p-10 h-[400px] overflow-y-auto space-y-6 scrollbar-thin text-slate-350 font-semibold text-xs leading-relaxed text-justify shadow-inner">
                  <div className="text-center space-y-2 border-b border-slate-900 pb-6">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">
                      SURAT PERJANJIAN PENGIKATAN JUAL BELI
                    </h2>
                    <h3 className="text-xs font-black text-amber-400 tracking-wider">
                      KAVLING LAHAN MAKAM - INSIRA MEMORIAL PARK
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Nomor Dokumen: PPJB/IMP/2026/040{id}
                    </p>
                  </div>

                  <p>
                    Pada hari ini, Senin tanggal 18 Mei tahun 2026, yang bertandatangan di bawah ini secara sah dan elektronik:
                  </p>

                  <div className="pl-4 space-y-3">
                    <p>
                      <strong>I. PT INSIRA MEMORIAL PARK</strong>, suatu perseroan terbatas yang didirikan berdasarkan hukum Negara Republik Indonesia, berkedudukan di Jakarta Selatan, yang dalam hal ini diwakili secara sah oleh <strong>Direktur Operasional Insira</strong>, selanjutnya disebut sebagai <strong>"PIHAK PERTAMA" (Penjual)</strong>.
                    </p>
                    <p>
                      <strong>II. {profile?.name || 'Nama Pelanggan'}</strong>, warga negara Indonesia, bertempat tinggal sesuai Kartu Tanda Penduduk (KTP) nomor <strong>{profile?.nik || '3174xxxxxxxxxxxx'}</strong>, selanjutnya disebut sebagai <strong>"PIHAK KEDUA" (Pembeli)</strong>.
                    </p>
                  </div>

                  <p>
                    Para Pihak terlebih dahulu menerangkan hal-hal sebagai berikut:
                  </p>

                  <ul className="list-disc list-inside pl-4 space-y-2 text-slate-400">
                    <li>Bahwa PIHAK PERTAMA adalah pemilik sah atas sebidang tanah makam modern yang terletak di kawasan eksklusif Insira Memorial Park.</li>
                    <li>Bahwa PIHAK KEDUA bermaksud untuk membeli hak pemakaman atas unit kavling makam fisik yang telah dipilih secara dinamis di area pemetaan denah Insira.</li>
                  </ul>

                  <p className="font-extrabold text-white uppercase tracking-wider text-xs pt-4 border-t border-slate-900/40">
                    PASAL 1: OBYEK PERJANJIAN & HARGA
                  </p>
                  <p>
                    PIHAK PERTAMA mengikatkan diri untuk menjual dan menyerahkan hak pemakaian lahan makam kepada PIHAK KEDUA, dan PIHAK KEDUA mengikatkan diri untuk membeli satu (1) unit Kavling Makam fisik dengan spesifikasi tipe yang disepakati, dengan nilai total pembelian sebesar <strong>Rp {(payment.total_bill || 150000000).toLocaleString('id-ID')}</strong> (termasuk pajak dan biaya administrasi).
                  </p>

                  <p className="font-extrabold text-white uppercase tracking-wider text-xs pt-4 border-t border-slate-900/40">
                    PASAL 2: TATA CARA PEMBAYARAN
                  </p>
                  <p>
                    Pembayaran dilaksanakan oleh PIHAK KEDUA kepada PIHAK PERTAMA melalui skema pembayaran terpilih ({payment.tenor_months > 0 ? `Cicilan ${payment.tenor_months} Bulan` : 'Cash Keras'}). Pembayaran dilakukan secara otomatis dan terverifikasi menggunakan Virtual Account tetap yang diterbitkan oleh PT Insira Memorial Park.
                  </p>

                  <p className="font-extrabold text-white uppercase tracking-wider text-xs pt-4 border-t border-slate-900/40">
                    PASAL 3: HAK & KEWAJIBAN PIHAK KEDUA
                  </p>
                  <p>
                    PIHAK KEDUA berhak mendapatkan penyiapan lahan makam khidmat, pemeliharaan rumput dan kebersihan kavling makam secara berkala oleh pengelola taman pemakaman Insira. PIHAK KEDUA wajib mematuhi seluruh tata tertib ziarah dan ketentuan syariah/keagamaan yang berlaku di dalam kawasan Insira Memorial Park.
                  </p>

                  <p className="font-extrabold text-white uppercase tracking-wider text-xs pt-4 border-t border-slate-900/40">
                    PASAL 4: FORCE MAJEURE & PENYELESAIAN PERSELISIHAN
                  </p>
                  <p>
                    Apabila terjadi perselisihan mengenai pelaksanaan perjanjian ini, Para Pihak sepakat untuk menyelesaikannya secara musyawarah untuk mufakat. Apabila perselisihan tidak dapat diselesaikan secara kekeluargaan, Para Pihak sepakat memilih domisili hukum yang tetap di Pengadilan Negeri Jakarta Selatan.
                  </p>

                  <p className="text-center pt-8 text-slate-500 font-extrabold text-[10px] border-t border-slate-900 uppercase tracking-widest">
                    --- DOKUMEN INI DITANDATANGANI SECARA ELEKTRONIK DAN SAH DEMI HUKUM ---
                  </p>
                </div>

                {/* SIGNATURES SECTION */}
                <div className="grid sm:grid-cols-2 gap-8 pt-4">
                  
                  {/* Pihak Pertama (Insira) Signature */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 text-center flex flex-col items-center justify-between gap-4 h-48">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Pihak Pertama (Penjual)</span>
                      <strong className="text-xs text-white uppercase tracking-wider block mt-1">PT Insira Memorial Park</strong>
                    </div>

                    <div className="w-40 py-2.5 px-3 border border-amber-500/20 bg-amber-500/5 rounded-xl text-center select-none rotate-[-2deg] my-2">
                      <span className="text-[10px] font-black text-amber-400 block tracking-widest font-mono uppercase">VERIFIED</span>
                      <span className="text-[8px] font-black text-slate-400 block mt-0.5">PT INSIRA MEMORIAL</span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Direktur Operasional
                    </span>
                  </div>

                  {/* Pihak Kedua (Customer) Signature */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 text-center flex flex-col items-center justify-between gap-4 h-48">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Pihak Kedua (Pembeli)</span>
                      <strong className="text-xs text-white uppercase tracking-wider block mt-1">{profile?.name || 'Nama Pelanggan'}</strong>
                    </div>

                    {isPPJBSigned ? (
                      <div className="w-40 py-2.5 px-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-center select-none rotate-[2deg] my-2 animate-in zoom-in-95 duration-500">
                        <span className="text-[10px] font-black text-emerald-400 block tracking-widest font-mono uppercase">SIGNED</span>
                        <span className="text-[8px] font-black text-slate-450 block mt-0.5">{profile?.nik || 'VERIFIED KTP'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSignModal(true)}
                        className="gold-gradient gold-gradient-hover text-slate-950 text-[10px] font-black px-5 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-amber-500/5 uppercase tracking-widest transition-all active:scale-[0.98]"
                      >
                        Tanda Tangan E-PPJB
                      </button>
                    )}

                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {isPPJBSigned ? 'Telah Ditandatangani' : 'Membutuhkan Otorisasi'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIGNATURE VERIFICATION POPUP MODAL */}
          {showSignModal && (
            <div className="fixed inset-0 bg-[#02040a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="glass-card rounded-3xl max-w-md w-full border border-slate-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400" />
                    <span>Verifikasi Tanda Tangan E-PPJB</span>
                  </h3>
                  <button 
                    onClick={() => setShowSignModal(false)}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="p-6 space-y-5 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                    <ShieldCheck size={28} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Konfirmasi Legalitas Akad</h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Dengan melakukan konfirmasi tanda tangan elektronik ini, Anda menyatakan setuju dan sepakat terhadap seluruh isi Surat Perjanjian Jual Beli (PPJB) kavling makam Insira.
                    </p>
                  </div>

                  <div className="bg-slate-950/65 border border-slate-900 p-4.5 rounded-2xl text-left space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">Nama Penandatangan:</span>
                      <span className="text-white font-extrabold">{profile?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">Nomor NIK KTP:</span>
                      <span className="text-white font-extrabold">{profile?.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">Tanggal Akad:</span>
                      <span className="text-white font-extrabold">18 Mei 2026</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setShowSignModal(false)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest cursor-pointer border border-slate-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={() => {
                        setIsPPJBSigned(true);
                        setShowSignModal(false);
                      }}
                      className="flex-1 gold-gradient gold-gradient-hover text-slate-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-amber-500/5 transition-all hover:scale-[1.01]"
                    >
                      Tandatangani
                    </button>
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
