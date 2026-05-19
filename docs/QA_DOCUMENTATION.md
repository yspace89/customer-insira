# Dokumentasi Quality Assurance (QA) - Skenario Uji Portal Insira

Dokumen ini berisi rencana pengujian (*test plan*), skenario uji manual (*manual test cases*), kriteria keberimaan (*acceptance criteria*), dan contoh struktur skrip otomatisasi E2E menggunakan **Playwright** untuk memastikan keandalan fungsi **Customer Portal Insira**.

---

## 1. Lingkungan Pengujian (Test Environment)
*   **Aplikasi**: Next.js Customer Portal (Lokal)
*   **Base URL**: `http://localhost:3000`
*   **Staging API**: `https://api-staging.kotahati.id`
*   **Akun Uji**:
    *   **Email**: `yspace89+cust4@gmail.com`
    *   **Sandi**: `Test@123!`
*   **Target Browser**: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge.

---

## 2. Matriks Pengujian Kasus Uji Manual (9 Menu Portal)

### TC-01: Autentikasi Pengguna & Sesi (Menu: Login)
*   **Langkah Uji**:
    1. Buka halaman `http://localhost:3000/login`.
    2. Masukkan email dan kata sandi yang salah $\rightarrow$ Klik "Masuk Sekarang".
    3. Masukkan email dan kata sandi staging yang benar $\rightarrow$ Klik "Masuk Sekarang".
    4. Klik tombol "Keluar" di sidebar setelah masuk.
*   **Hasil yang Diharapkan**:
    *   Sistem memunculkan alert merah "Login gagal..." ketika kredensial salah.
    *   Sistem berhasil masuk ke `/dashboard` saat kredensial benar.
    *   Cookie `token` terpasang di Storage Browser dengan tipe secure.
    *   Tombol "Keluar" berhasil menghapus cookies dan me-redirect pengguna kembali ke `/login`.

### TC-02: Dashboard & Pemilihan Alur (Menu: Beranda)
*   **Langkah Uji**:
    1. Dari rute `/dashboard`, pastikan terdapat sapaan dinamis bertuliskan nama customer.
    2. Periksa keberadaan dua kartu paralel: **Alur A (Langsung Booking)** & **Alur B (Dapatkan NUP)**.
    3. Klik tombol "Bayar Booking Fee" di Alur A $\rightarrow$ Pastikan berpindah ke `/booking-fee`.
    4. Periksa keberadaan Banner Event Terdekat $\rightarrow$ Verifikasi kecocokan lokasi Ballroom Top Food dengan data staging.
*   **Hasil yang Diharapkan**:
    *   Sapaan menampilkan "Bapak/Ibu Yahya Test Empat".
    *   Navigasi tombol alur bekerja dengan lancar.
    *   Informasi waktu, lokasi, dan tanggal event terlampir dengan tepat dan rapi.

### TC-03: Riwayat NUP (Menu: Nomor Urut Pemesanan)
*   **Langkah Uji**:
    1. Buka menu "Nomor Urut Pemesanan".
    2. Ketik kata kunci "INS-0926117" di kolom pencarian.
    3. Verifikasi jumlah NUP yang tercantum pada pagination (Total: 3).
*   **Hasil yang Diharapkan**:
    *   Sistem menampilkan NUP yang dicari secara real-time.
    *   Setiap baris kartu NUP menampilkan status "Pembayaran Berhasil" (badge hijau).
    *   Terdapat tombol "Lanjutkan ke Booking Fee" bagi NUP yang belum melakukan pembayaran booking.

### TC-04: Transaksi Uang Muka (Menu: Booking Fee)
*   **Langkah Uji**:
    1. Buka menu "Booking Fee".
    2. Klik tombol "Lihat Rincian" pada transaksi berstatus "Berhasil Dibayar".
    3. Verifikasi isi rincian tipe unit di modal popup.
*   **Hasil yang Diharapkan**:
    *   Modal popup muncul secara smooth di tengah layar dengan background gelap redup.
    *   Rincian modal menampilkan tipe unit "Single : 2 @Rp 1.000.000" dengan total Rp 2.000.000.
    *   Tombol silang (X) atau "Tutup" berhasil menyembunyikan modal kembali.

### TC-05: Pengajuan Pembatalan (Menu: Request Refund)
*   **Langkah Uji**:
    1. Buka menu "Request Refund".
    2. Periksa struktur kolom tabel: `No`, `NUP`, `Nominal`, `Status`, `Alasan Ditolak`.
    3. Lakukan klik sortir pada header kolom `NUP`.
*   **Hasil yang Diharapkan**:
    *   Tabel merender baris kosong "Tidak Ada Data" / "No data available" secara estetis karena user belum memiliki riwayat refund.
    *   Pagination dinonaktifkan secara tepat.

### TC-06: Validasi Kapling Lahan (Menu: Pilih Unit)
*   **Langkah Uji**:
    1. Buka menu "Pilih Unit".
    2. Pindah di antara tab **Bisa Memilih** dan **Belum Bisa Memilih**.
    3. Pada tab "Bisa Memilih", klik link "+1 Unit Lainnya" $\rightarrow$ Pastikan muncul modal detail unit cadangan.
    4. Pada tab "Belum Bisa Memilih", pastikan terdapat pesan alasan detail kegagalan.
*   **Hasil yang Diharapkan**:
    *   Transisi tab berlangsung instan tanpa reload.
    *   Modal "+1 Unit Lainnya" menampilkan unit tambahan cth: `B12 - 115 - Single`.
    *   Alasan detail kegagalan merender peringatan "Booking Fee belum terbayar" dengan ikon tanda seru merah.

### TC-07: Verifikasi Formulir (Menu: Verifikasi Data)
*   **Langkah Uji**:
    1. Buka menu "Verifikasi Data".
    2. Pindah ke tab **Data Pendukung** $\rightarrow$ Klik tombol "Lengkapi Data".
    3. Isi formulir modal Pekerjaan, Alamat, dan Kontak Darurat $\rightarrow$ Klik "Simpan Perubahan".
*   **Hasil yang Diharapkan**:
    *   Data KTP di tab Utama menampilkan status hijau "Terverifikasi".
    *   Sistem berhasil memperbarui data pendukung di layar secara lokal setelah tombol Simpan diklik.

### TC-08: Rincian Cicilan & VA (Menu: Pembayaran)
*   **Langkah Uji**:
    1. Buka menu "Pembayaran" $\rightarrow$ Pilih salah satu transaksi aktif (cth: ID 257) $\rightarrow$ Klik "Selengkapnya".
    2. Klik tombol salin (Copy) di samping nomor Virtual Account.
    3. Klik tab "ATM BRI" dan "BRI Mobile (BRIMO)" di panduan pembayaran.
*   **Hasil yang Diharapkan**:
    *   Batas jatuh tempo cicilan, nominal tagihan, dan sisa saldo terhitung dengan tepat.
    *   Sistem memunculkan ikon centang hijau selama 2 detik dan menyalin teks VA ke clipboard komputer.
    *   Daftar instruksi berubah secara dinamis sesuai tab yang diklik.

### TC-09: Inventarisasi Lahan Pemakaman (Menu: Makam Saya)
*   **Langkah Uji**:
    1. Buka menu "Makam Saya".
    2. Klik tombol opsi tiga titik (`...`) di salah satu unit $\rightarrow$ Klik "Ubah Peruntukan".
    3. Masukkan nama calon penghuni makam $\rightarrow$ Klik "Simpan Perubahan".
*   **Hasil yang Diharapkan**:
    *   Tabel menampilkan daftar 5 unit makam berstatus Single secara presisi.
    *   Sistem berhasil memperbarui kolom "Diperuntukan" di baris tabel dengan nama calon penghuni yang baru dimasukkan.

---

## 3. Skrip Otomatisasi Uji E2E (Struktur Playwright)

Skrip otomatisasi berikut ditulis menggunakan Playwright JS untuk melakukan validasi alur kritis portal secara mandiri:

```javascript
// tests/customer-portal.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Customer Portal E2E Testing Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Kunjungi Halaman Login
    await page.goto('http://localhost:3000/login');
  });

  test('Skenario Uji 1: Login Gagal dengan Kredensial Salah', async ({ page }) => {
    await page.fill('input[type="text"]', 'salah@gmail.com');
    await page.fill('input[type="password"]', 'SalahPass123!');
    await page.click('button[type="submit"]');

    // Pastikan muncul alert error
    const errorAlert = page.locator('text=Login gagal');
    await expect(errorAlert).toBeVisible();
  });

  test('Skenario Uji 2: Login Sukses, Validasi Dashboard & Salin VA Pembayaran', async ({ page }) => {
    // Input Kredensial Staging Asli
    await page.fill('input[type="text"]', 'yspace89+cust4@gmail.com');
    await page.fill('input[type="password"]', 'Test@123!');
    await page.click('button[type="submit"]');

    // Menunggu transisi ke Dashboard
    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=Selamat Datang, Bapak/Ibu Yahya Test Empat')).toBeVisible();

    // Navigasi ke Halaman Pembayaran
    await page.click('text=Pembayaran');
    await page.waitForURL('**/pembayaran');
    await expect(page.locator('text=Daftar Tagihan & Cicilan')).toBeVisible();

    // Masuk ke Detail Pembayaran ID 257
    await page.click('text=INS-0126145'); // Mencari no transaksi di kartu
    await page.click('text=Selengkapnya');
    await page.waitForURL('**/pembayaran/257');

    // Uji Tombol Salin VA
    await page.click('button[title="Salin No VA"]');
    // Verifikasi clipboard jika didukung atau cek state class centang
    const checkIcon = page.locator('.text-emerald-400');
    await expect(checkIcon).toBeVisible();
  });

  test('Skenario Uji 3: Ubah Nama Calon Penghuni Makam', async ({ page }) => {
    // Login
    await page.fill('input[type="text"]', 'yspace89+cust4@gmail.com');
    await page.fill('input[type="password"]', 'Test@123!');
    await page.click('button[type="submit"]');

    // Navigasi ke Makam Saya
    await page.click('text=Makam Saya');
    await page.waitForURL('**/makam-saya');

    // Klik tombol menu tiga titik baris pertama
    await page.locator('tbody tr').first().locator('button').click();
    await page.click('text=Ubah Peruntukan');

    // Isi nama calon penghuni baru
    await page.fill('input[placeholder="Masukkan nama calon penghuni makam..."]', 'Almarhum Bapak Fulan');
    await page.click('text=Simpan Perubahan');

    // Pastikan nama berubah di tabel
    const tableRow = page.locator('tbody tr').first();
    await expect(tableRow.locator('text=Almarhum Bapak Fulan')).toBeVisible();
  });
});
```
