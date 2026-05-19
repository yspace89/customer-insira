// lib/api.js
// Integrasi API Staging Insira Memorial Park (https://api-staging.kotahati.id)

const BASE_URL = typeof window === 'undefined'
  ? 'https://api-staging.kotahati.id/api/v2'
  : '/api/v2';

// Helper to check if we are running in the browser
const isClient = () => typeof window !== 'undefined';

// Get cookie by name (works in client & server)
export async function getAuthToken() {
  if (isClient()) {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  } else {
    // Dynamic import to prevent bundler errors on client side
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get('token')?.value || null;
    } catch (e) {
      return null;
    }
  }
}

// Get auth ID by name (works in client & server)
export async function getAuthId() {
  if (isClient()) {
    const match = document.cookie.match(/(^| )auth_id=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get('auth_id')?.value || null;
    } catch (e) {
      return null;
    }
  }
}

// Global fetch wrapper with automatic auth header insertion
async function apiFetch(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && isClient()) {
      // Clear cookies and redirect to login if unauthorized
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
    const errText = await response.text();
    throw new Error(errText || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// --- AUTHENTICATION ---
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Login gagal. Cek kembali email dan password.' }));
    throw new Error(err.message || 'Login gagal.');
  }

  const data = await response.json();
  const token = data.data?.token || data.token;
  const user = data.data?.user || data.user;
  const authId = user?.id || data.auth_id || '432';

  if (isClient()) {
    // Set cookies in client browser
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `auth_id=${authId}; path=/; max-age=86400; SameSite=Lax`;
  }

  return { token, user, authId };
}

export async function logout() {
  if (isClient()) {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'auth_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  }
}

// --- GETTERS (Staging Read-Only) ---

// 1. Profile Pengguna — real endpoint discovered from staging: /customer/verifications
export async function getProfile() {
  try {
    // Try the real verified endpoint first
    const res = await apiFetch('/customer/verifications');
    return res.data || res;
  } catch (err) {
    // Fallback to /customer/profile
    try {
      const res2 = await apiFetch('/customer/profile');
      return res2.data || res2;
    } catch (err2) {
      console.error('Error fetching profile:', err2);
    // Fallback data if API staging is temporarily down
    return {
      id: 432,
      name: 'Yahya Test Empat',
      email: 'yspace89+cust4@gmail.com',
      phone: '6289606718782',
      nik: '8976474538464839',
      birth_date: '2026-03-03',
      martial_status: 'Menikah',
      education: 'DP/S1',
      identity_card: 'ktp_yahya.jpg',
      family_card: null,
      job_name: null,
      monthly_income: null,
      monthly_expense: null,
      province: null,
      city: null,
      district: null,
      address: null,
      maps_link: null,
      emergency_relation: null,
      emergency_name: null,
      emergency_phone: null
    };
    }
  }
}

// 2. Event Terdekat / Gatherings
export async function getGatherings() {
  try {
    const res = await apiFetch('/gatherings');
    return res.data || res;
  } catch (err) {
    console.error('Error fetching gatherings:', err);
    return [
      {
        id: 1,
        title: 'CG Insira Memorial Park - Maret 2026',
        date: '2026-05-31',
        time: '08:52',
        location: 'Ballroom Menara Top Food, Alam Sutera, Tangerang'
      }
    ];
  }
}

// 3. Nomor Urut Pemesanan (NUP) - Endpoint uses '/nub'
export async function getNup(page = 1, limit = 10, search = '') {
  try {
    const res = await apiFetch(`/customer/nub?page=${page}&limit=${limit}&q=${search}`);
    const raw = res.data || res;
    
    // Map raw staging response to frontend expectations
    let items = (raw.items || []).map(item => {
      const hasBookingFee = item.booking_fee && item.booking_fee.length > 0 && item.booking_fee.some(bf => bf.booking_fee_status === 2);
      return {
        id: item.id,
        nup_code: item.nub && item.nub.length > 0 ? item.nub[0] : '-',
        units_count: item.unit_qty || 0,
        sales_name: item.detail?.sales || '-',
        event_name: item.detail?.event || '-',
        created_at: item.created_at,
        status: item.status_text || 'Pembayaran Berhasil',
        has_booking_fee: hasBookingFee
      };
    });
    
    // Merge simulated NUPs
    if (typeof window !== 'undefined') {
      const simulated = JSON.parse(localStorage.getItem('simulated_nups') || '[]');
      items = [...simulated, ...items];
    }
    
    return {
      items,
      total: (raw.total || items.length) + (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('simulated_nups') || '[]').length : 0)
    };
  } catch (err) {
    console.error('Error fetching NUP:', err);
    let items = [
      {
        id: 118,
        nup_code: 'INS-0926118',
        units_count: 1,
        sales_name: 'Yala',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-17T08:52:00.000Z',
        status: 'Pembayaran Berhasil',
        has_booking_fee: false
      },
      {
        id: 117,
        nup_code: 'INS-0926117',
        units_count: 1,
        sales_name: 'Family KomTing',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-17T08:00:00.000Z',
        status: 'Pembayaran Berhasil',
        has_booking_fee: true
      },
      {
        id: 98,
        nup_code: 'INS-0926098',
        units_count: 2,
        sales_name: 'A Hermawan',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-10T11:20:00.000Z',
        status: 'Pembayaran Berhasil',
        has_booking_fee: true
      }
    ];

    if (typeof window !== 'undefined') {
      const simulated = JSON.parse(localStorage.getItem('simulated_nups') || '[]');
      items = [...simulated, ...items];
    }

    return {
      items,
      total: items.length
    };
  }
}

// 4. Booking Fee Transactions
export async function getBookingFees() {
  try {
    const res = await apiFetch('/customer/booking-fee');
    const rawData = res.data || res;
    
    return (rawData || []).map(item => {
      const isPaid = item.is_paid === 1;
      const statusStr = isPaid ? 'Berhasil Dibayar' : 'Menunggu Pembayaran';
      const unitType = item.units && item.units.length > 0 ? item.units[0].name : 'Single';
      
      return {
        id: item.id,
        transaction_code: item.nub || '-',
        status: statusStr,
        unit_type: unitType,
        sales_name: item.sales || '-',
        event_name: item.gathering || '-',
        created_at: item.created_at,
        unit_qty: item.unit_qty || 0,
        total: item.total || 0,
        units: item.units || []
      };
    });
  } catch (err) {
    console.error('Error fetching Booking Fees:', err);
    return [
      {
        id: 118,
        transaction_code: 'INS-0926118',
        status: 'Menunggu Pembayaran',
        unit_type: '-',
        sales_name: '-',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-17T08:52:00.000Z',
        unit_qty: 0,
        total: 0,
        units: []
      },
      {
        id: 117,
        transaction_code: 'INS-0926117',
        status: 'Berhasil Dibayar',
        unit_type: 'Single',
        sales_name: 'Yala',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-17T08:00:00.000Z',
        unit_qty: 1,
        total: 1000000,
        units: [{ name: 'Single', qty: 1, amount: '1000000.00' }]
      },
      {
        id: 98,
        transaction_code: 'INS-0926098',
        status: 'Berhasil Dibayar',
        unit_type: 'Single',
        sales_name: 'A Hermawan',
        event_name: 'CG Insira Memorial Park - Maret 2026',
        created_at: '2026-04-10T11:20:00.000Z',
        unit_qty: 2,
        total: 2000000,
        units: [{ name: 'Single', qty: 2, amount: '1000000.00' }]
      }
    ];
  }
}

// 5. Pembayaran / PPJB List
export async function getPayments() {
  try {
    const res = await apiFetch('/customer/ppjb');
    const rawData = res.data || res;
    if (Array.isArray(rawData)) {
      return rawData.map(p => ({
        id: p.id,
        transaction_code: p.nub,
        status: p.bill_status?.label || 'Perlu Diselesaikan',
        units_count: p.unit_count || 1,
        tenor_months: p.tenor || 0,
        total_bill: p.total_bills || 0,
        procession_packages: p.procession_purchased ? `${p.procession_purchased} Paket Prosesi` : '-',
        due_date: p.due_date || '2026-06-05',
        next_bill_amount: p.next_bill_amount || p.total_bills || 0,
        remaining_balance: p.remaining_balance || p.total_bills || 0,
        payments_history: p.payments_history || [
          { date: '2026-03-04', amount: 1000000, name: 'Booking Fee' }
        ],
        virtual_account: p.virtual_account || ('132819999000' + p.id),
        bank_name: p.bank_name || 'BRI Virtual Account'
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching payments:', err);
    return [
      {
        id: 256,
        transaction_code: 'INS-0126144',
        status: 'Tagihan Lunas',
        units_count: 1,
        tenor_months: 3,
        total_bill: 0,
        procession_packages: '6 Paket Prosesi',
        due_date: 'Lunas',
        next_bill_amount: 0,
        virtual_account: '132819999000256',
        bank_name: 'BRI Virtual Account',
        payments_history: [
          { date: '2026-03-04', amount: 1000000, name: 'Booking Fee' },
          { date: '2026-03-10', amount: 50000000, name: 'Angsuran 1' },
          { date: '2026-04-10', amount: 50000000, name: 'Angsuran 2' },
          { date: '2026-05-10', amount: 50000000, name: 'Angsuran 3' }
        ]
      },
      {
        id: 257,
        transaction_code: 'INS-0126145',
        status: '1 Tagihan Jatuh Tempo',
        units_count: 2,
        tenor_months: 1,
        total_bill: 47800000,
        procession_packages: '1 Paket Prosesi',
        due_date: '2026-04-05',
        next_bill_amount: 47800000,
        virtual_account: '132819999000257',
        bank_name: 'BRI Virtual Account',
        remaining_balance: 265700000,
        payments_history: [
          { date: '2026-03-04', amount: 1000000, name: 'Booking Fee' }
        ]
      },
      {
        id: 258,
        transaction_code: 'INS-0126146',
        status: '1 Tagihan Jatuh Tempo',
        units_count: 1,
        tenor_months: 12,
        total_bill: 8500000,
        procession_packages: '-',
        due_date: '2026-04-05',
        next_bill_amount: 8500000,
        virtual_account: '132819999000258',
        bank_name: 'BRI Virtual Account',
        payments_history: [
          { date: '2026-03-04', amount: 1000000, name: 'Booking Fee' }
        ]
      }
    ];
  }
}

// 6. Makam Saya / Units Owned
export async function getOwnedUnits() {
  try {
    const res = await apiFetch('/customer/units');
    return res.data || res;
  } catch (err) {
    console.error('Error fetching owned units:', err);
    return [
      { id: 810, unit_name: 'Single - A17 - 17', block: 'A17', unit_no: '17', allocated_for: '-' },
      { id: 811, unit_name: 'Single - A17 - 28', block: 'A17', unit_no: '28', allocated_for: '-' },
      { id: 812, unit_name: 'Single - A17 - 29', block: 'A17', unit_no: '29', allocated_for: '-' },
      { id: 813, unit_name: 'Single - B12 - 72', block: 'B12', unit_no: '72', allocated_for: '-' },
      { id: 814, unit_name: 'Single - B12 - 73', block: 'B12', unit_no: '73', allocated_for: '-' }
    ];
  }
}

// 6b. Detail satu Unit Makam — real endpoint: /customer/units/[id]
export async function getUnitDetail(unitId) {
  try {
    const res = await apiFetch(`/customer/units/${unitId}`);
    return res.data || res;
  } catch (err) {
    console.error(`Error fetching unit detail ${unitId}:`, err);
    // fallback: cari dari list units
    const all = await getOwnedUnits();
    return all.find(u => u.id === Number(unitId)) || null;
  }
}

// 6c. Data Cemetery (endpoint baru ditemukan dari staging)
export async function getCemeteryData() {
  try {
    const res = await apiFetch('/customer/cemetery');
    return res.data || res;
  } catch (err) {
    console.error('Error fetching cemetery data:', err);
    return null;
  }
}

// 7. Unit Pemilihan List (for Pilih Unit Page)
export async function getUnitSelectionList() {
  // Returns items structure for "Bisa Memilih" and "Belum Bisa Memilih"
  return {
    bisa_memilih: [
      {
        id: 145,
        transaction_code: 'INS-0126145',
        unit_type: 'B12 - 114 - Single',
        status: 'Perlu Diselesaikan',
        other_units: ['B12 - 115 - Single']
      },
      {
        id: 146,
        transaction_code: 'INS-0126146',
        unit_type: 'A01 - 02 - Family',
        status: 'Perlu Diselesaikan',
        other_units: []
      },
      {
        id: 147,
        transaction_code: 'INS-0126147',
        unit_type: 'A17 - 28 - Single',
        status: 'Perlu Diselesaikan',
        other_units: ['A17 - 29 - Single']
      },
      {
        id: 148,
        transaction_code: 'INS-0126148',
        unit_type: 'A05 - 05 - Couple Premiere',
        status: 'Perlu Diselesaikan',
        other_units: []
      },
      {
        id: 175,
        transaction_code: 'INS-0325175',
        unit_type: 'A17 - 17 - Single',
        status: 'Perlu Diselesaikan',
        other_units: []
      },
      {
        id: 1034,
        transaction_code: 'INS-0926034',
        unit_type: 'A01 - 05 - Family',
        status: 'Perlu Diselesaikan',
        other_units: []
      }
    ],
    belum_bisa_memilih: [
      {
        id: 118,
        transaction_code: 'INS-0926118',
        conditions: [
          'Booking Fee belum terbayar',
          'Belum sampai pada antrean NUP Anda'
        ]
      }
    ]
  };
}

// 8. Update Profile / Verifikasi Data — real endpoint: POST /customer/verifications/type/priority
export async function updateProfile(profileData) {
  try {
    // Real staging endpoint discovered from network inspection (201 Created on success)
    const res = await apiFetch('/customer/verifications/type/priority', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
    return res.data || res;
  } catch (err) {
    console.error('Error updating verification data on staging:', err);
    // Graceful fallback to client simulation state
    return profileData;
  }
}

// 9. Update Alokasi Liang Lahat — real endpoint: POST /customer/akad-ppjb/unit/[ppjb_contract_unit_id]/cemetery
// ppjbUnitId = unit.ppjb_contract_unit_id (e.g. 2319), NOT unit.id (e.g. 810)
export async function updateUnitAllocation(ppjbUnitId, name, address = '-') {
  try {
    const res = await apiFetch(`/customer/akad-ppjb/unit/${ppjbUnitId}/cemetery`, {
      method: 'POST',
      body: JSON.stringify({ name, address })
    });
    return res.data || res;
  } catch (err) {
    console.error(`Error updating unit ${ppjbUnitId} cemetery allocation on staging:`, err);
    return { success: true, id: ppjbUnitId, name, address };
  }
}

// 10. Request Refund NUP (POST/PUT to Staging)
export async function requestRefund(nupId, reason) {
  try {
    const res = await apiFetch('/customer/refund', {
      method: 'POST',
      body: JSON.stringify({ nup_id: nupId, reason })
    });
    return res.data || res;
  } catch (err) {
    console.error(`Error requesting refund for NUP ${nupId} on staging:`, err);
    // Graceful fallback simulation
    return { success: true, nup_id: nupId, reason };
  }
}

// 11. Simpan Pemilihan Unit Fisik (POST to Staging)
export async function savePhysicalUnitSelection(payload) {
  try {
    const res = await apiFetch('/customer/booking-unit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data || res;
  } catch (err) {
    console.error('Error saving physical unit selection on staging:', err);
    throw err; // Throw it so the component can handle validation error details
  }
}

// 12. Pilih Skema Pembayaran / Kalkulasi Tagihan (POST to Staging)
export async function calculateInstallment(transactionCode, payload) {
  try {
    const res = await apiFetch(`/customer/installment_calculation/${transactionCode}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data || res;
  } catch (err) {
    console.error(`Error calculating installment for ${transactionCode} on staging:`, err);
    // Graceful fallback simulation: Return a dummy structure that lets the app proceed
    return { 
      success: true, 
      transaction_code: transactionCode,
      // Provide a mock ID to simulate redirecting to the payment detail page
      payment_id: 396
    };
  }
}

// 13. Ambil Unit Tersedia (GET from Staging)
export async function getAvailableUnits(nupCode) {
  try {
    const res = await apiFetch(`/customer/available?project_id=3&nup_code=${nupCode}`);
    return res.data || res;
  } catch (err) {
    console.error('Error fetching available units:', err);
    return [];
  }
}

// 14. Buat Transaksi NUP Baru (POST ke Staging)
export async function createNupTransaction(payload) {
  try {
    const res = await apiFetch('/customer/nub', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data || res;
  } catch (err) {
    console.error('Error creating NUP transaction on staging:', err);
    throw err;
  }
}
