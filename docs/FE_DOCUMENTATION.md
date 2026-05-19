# Dokumentasi Frontend (FE) - Customer Portal Insira

Dokumen ini berisi arsitektur teknis, standar visual design system, struktur komponen, dan alur integrasi frontend pada **Customer Portal Insira Memorial Park** yang dibangun menggunakan **Next.js App Router (React 19)** dan **Tailwind CSS v4**.

---

## 1. Spesifikasi Teknis Utama
*   **Framework**: Next.js 16.2.4 (App Router)
*   **Library UI/Logic**: React 19.2.4
*   **Utility Styling**: Tailwind CSS v4.0.0
*   **Ikonografi**: `lucide-react`
*   **Pengelolaan State**: React Hooks (`useState`, `useEffect`) & Server Cookies

---

## 2. Design System Premium (Dark Slate & Gold)

Desain portal didefinisikan ulang secara visual agar mencerminkan kesan eksklusif, mewah, khidmat, dan bernilai tinggi (*high-end luxury*). 

### A. Palet Warna (CSS Variables di `app/globals.css`)
*   **Deep Space Background** (`#060913`): Latar belakang gelap premium dengan radial gradients bernuansa biru/ungu redup.
*   **Glassmorphic Onyx** (`rgba(15, 23, 42, 0.45)`): Kartu transparan dengan efek `backdrop-blur-xl` dan border slate halus (`rgba(51, 65, 85, 0.5)`).
*   **Vibrant Imperial Gold** (`#e2b93c` hingga `#b89324`): Aksen gradasi emas mewah untuk tombol utama, teks krusial, dan indikator aktif.
*   **Glow Effect**: Bayangan halus neon (`glow-input`) untuk menyoroti input teks dan tombol yang sedang dalam status fokus.

### B. Tipografi & Kelas Kustom
1.  **Typography**: Menggunakan font modern `Geist Sans` dengan penekanan pada ketebalan `font-black` (900) untuk tajuk utama dan `font-extrabold` (800) untuk label guna memperkuat visual kontras tinggi.
2.  **.glass-card**: Kelas utilitas untuk efek kaca premium. Memberikan efek hover translasi naik 2px dan glow emas tipis (`rgba(226, 185, 60, 0.06)`).
3.  **.gold-gradient**: Warna gradasi emas solid tiga titik (`#fce074`, `#e2b93c`, `#b89324`) dengan transisi kecerahan pada status `:hover`.
4.  **.purple-glow-card**: Kotak neon ungu khidmat khusus untuk banner event/ gathering terdekat.

---

## 3. Struktur Direktori File
Berikut adalah struktur file frontend utama yang telah diduplikasi secara lokal:

```bash
insira-customer/
├── app/
│   ├── layout.js                 # Metadata kustom, konfigurasi font global & body styles
│   ├── globals.css               # Import Tailwind CSS v4, variabel warna & utilitas premium
│   ├── page.js                   # Gateway pre-loader untuk redirecting client-side ke dashboard
│   ├── middleware.js             # Otorisasi route & proteksi halaman berbasis token cookies
│   ├── login/
│   │   └── page.js               # Form login interaktif (Split design, eye toggle password)
│   ├── dashboard/
│   │   └── page.js               # Dashboard utama (Alur A/B, banner Customer Gathering)
│   ├── nup/
│   │   └── page.js               # Daftar antrean NUP dengan pencarian & pagination
│   ├── booking-fee/
│   │   └── page.js               # Manajemen Uang Muka, Info Tagihan Pending & Detail Modal Unit
│   ├── request-refund/
│   │   └── page.js               # Tabel riwayat pengajuan refund, filter sort, & empty state
│   ├── select-unit/
│   │   └── v2/
│   │       └── page.js           # Sistem tab interaktif, validasi status antrean & Detail Drawer
│   ├── verification/
│   │   └── page.js               # Formulir verifikasi data utama & data pendukung + modal Edit
│   ├── pembayaran/
│   │   ├── page.js               # Daftar cicilan/tagihan berjalan & tagihan jatuh tempo
│   │   └── [id]/
│   │       └── page.js           # VA Generator, instruksi bayar ber-tab & riwayat transaksi
│   └── makam-saya/
│       ├── page.js               # Tabel inventaris makam keluarga & menu dropdown aksi
│       └── [id]/
│           └── page.js           # Detail spesifikasi koordinat makam & perubahan nama alokasi
├── components/
│   ├── Sidebar.js                # Navigasi kiri terpadu lengkap dengan profil & tombol Keluar
│   └── Header.js                 # Navigasi atas (Breadcrumbs dinamis, bel notifikasi & dropdown profil)
└── lib/
    └── api.js                    # Fetch wrapper, autentikasi sesi login & mapping endpoint staging
```

---

## 4. Alur Interaksi & State Management Komponen

### A. Proteksi Rute (`middleware.js`)
Middleware beroperasi di sisi server untuk mendeteksi keberadaan cookie `token`.
*   Jika tidak ada token dan pengguna mengakses rute internal `/dashboard`, `/nup`, dll $\rightarrow$ Redirect otomatis ke `/login`.
*   Jika ada token dan pengguna mengakses `/login` $\rightarrow$ Redirect otomatis ke `/dashboard`.

### B. Otentikasi Langsung (`app/login/page.js`)
*   Menggunakan state `isLoading` untuk mengontrol indikator spinner pada tombol kirim.
*   State `error` digunakan untuk menampilkan alert box merah beranimasi dengan transisi `zoom-in-95` jika respon staging mengembalikan status kegagalan.

### C. Alur Pemilihan Unit (`app/select-unit/v2/page.js`)
*   State `activeTab` mengontrol tampilan bersyarat (*conditional rendering*) antara unit yang **Bisa Memilih** dan **Belum Bisa Memilih**.
*   **Bisa Memilih**: Merender grid berisi daftar NUP yang berstatus `Perlu Diselesaikan` lengkap dengan tombol aksi pemilihan skema pembayaran.
*   **Belum Bisa Memilih**: Merender daftar NUP yang diblokir beserta daftar kondisi prasyarat yang belum terpenuhi (berwarna merah).
*   State `selectedUnitsList` & `showModal` mengontrol penayangan overlay modal glassmorphic ketika teks "+X Unit Lain" diklik oleh user.

### D. Generator Salin Nomor VA (`app/pembayaran/[id]/page.js`)
*   Mengimplementasikan API Clipboard browser bawaan (`navigator.clipboard.writeText`) pada tombol copy nomor Virtual Account.
*   Mengaktifkan state `copied` (boolean) selama 2 detik untuk mengubah ikon salin menjadi tanda centang hijau (`Check`) guna meningkatkan aspek kepuasan micro-interaction pengguna.
*   Sistem tab navigasi instruksi bayar dikontrol lewat state `activeInstruction` ('atm' | 'mbanking' | 'ibanking') tanpa melakukan reload halaman.
