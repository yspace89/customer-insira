# Dokumentasi Backend (BE) - Integrasi API Staging Insira

Dokumen ini berisi spesifikasi teknis mengenai bagaimana Customer Portal lokal berintegrasi secara aman dengan **Staging API Server Insira** asli, mencakup endpoint, skema data request/response, metode otentikasi, dan langkah-langkah perlindungan data (*read-only safeguards*).

---

## 1. Domain & Protokol Staging API
Semua transaksi data terhubung langsung ke server staging resmi berikut:
*   **Base URL**: `https://api-staging.kotahati.id/api/v2`
*   **Protokol**: HTTPS (Wajib menggunakan enkripsi TLS 1.3)

---

## 2. Mekanisme Otentikasi & Penyimpanan Sesi
Sistem menggunakan otentikasi berbasis JSON Web Token (JWT) yang diterbitkan secara dinamis saat login berhasil.

### A. Alur Header Authorization
Setiap request yang membutuhkan otentikasi wajib menyertakan token JWT pada header HTTP:
```http
Authorization: Bearer <JWT_Token_Hasil_Login>
Content-Type: application/json
```

### B. Kebijakan Penyimpanan Cookies (Client-Side)
Saat login sukses, token akan disimpan pada cookies browser lokal dengan spesifikasi:
*   `token`: Menyimpan JWT string aktif dari backend. (Max-Age: 86400 detik / 24 Jam, SameSite: Lax).
*   `auth_id`: Menyimpan ID unik pembeli (cth: `432`) untuk validasi rute dinamis.

---

## 3. Spesifikasi Detail Endpoint API Staging

### A. Login Customer (Otentikasi Dinamis)
Digunakan untuk menukarkan email dan sandi dengan JWT Token.
*   **Endpoint**: `POST /customer/login`
*   **Payload Request**:
    ```json
    {
      "email": "yspace89+cust4@gmail.com",
      "password": "Test@123!"
    }
    ```
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login berhasil",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": 432,
          "name": "Yahya Test Empat",
          "email": "yspace89+cust4@gmail.com",
          "phone": "6289606718782"
        }
      }
    }
    ```

### B. Profil Pengguna
Mengambil informasi lengkap identitas pribadi pengguna untuk verifikasi berkas.
*   **Endpoint**: `GET /customer/profile`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": 432,
        "name": "Yahya Test Empat",
        "email": "yspace89+cust4@gmail.com",
        "phone": "6289606718782",
        "nik": "8976474538464839",
        "birth_date": "2026-03-03",
        "martial_status": "Menikah",
        "education": "DP/S1",
        "identity_card": "ktp_yahya.jpg",
        "family_card": null,
        "job_name": null,
        "monthly_income": null,
        "monthly_expense": null,
        "province": null,
        "city": null,
        "district": null,
        "address": null,
        "maps_link": null,
        "emergency_relation": null,
        "emergency_name": null,
        "emergency_phone": null
      }
    }
    ```

### C. Gathering Event Terdekat
Mengambil data jadwal acara sosialisasi gathering terbaru.
*   **Endpoint**: `GET /gatherings`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "CG Insira Memorial Park - Maret 2026",
          "date": "2026-05-31",
          "time": "08:52",
          "location": "Ballroom Menara Top Food, Alam Sutera, Tangerang"
        }
      ]
    }
    ```

### D. Nomor Urut Pemesanan (NUP)
Mengambil daftar antrean pemesanan NUP milik pembeli.
*   **Endpoint**: `GET /customer/nub?page=1&limit=3&q=`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "items": [
          {
            "id": 118,
            "nup_code": "INS-0926118",
            "units_count": 1,
            "sales_name": "Yala",
            "event_name": "CG Insira Memorial Park - Maret 2026",
            "created_at": "2026-04-17T08:52:00.000Z",
            "status": "Pembayaran Berhasil",
            "has_booking_fee": false
          }
        ],
        "total": 3
      }
    }
    ```

### E. Transaksi Booking Fee
Mengambil riwayat pembayaran uang muka (booking fee).
*   **Endpoint**: `GET /customer/booking-fee`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 118,
          "transaction_code": "INS-0926118",
          "status": "Menunggu Pembayaran",
          "unit_type": "-",
          "sales_name": "-",
          "event_name": "CG Insira Memorial Park - Maret 2026",
          "created_at": "2026-04-17T08:52:00.000Z"
        }
      ]
    }
    ```

### F. Tagihan Cicilan (PPJB List)
Mengambil detail tagihan cicilan berjalan dan virtual account pembayaran.
*   **Endpoint**: `GET /customer/ppjb`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 257,
          "transaction_code": "INS-0126145",
          "status": "1 Tagihan Jatuh Tempo",
          "units_count": 2,
          "tenor_months": 1,
          "total_bill": 47800000,
          "procession_packages": "1 Paket Prosesi",
          "due_date": "2026-04-05",
          "next_bill_amount": 47800000,
          "virtual_account": "132819999000257",
          "bank_name": "BRI Virtual Account",
          "remaining_balance": 265700000,
          "payments_history": [
            { "date": "2026-03-04", "amount": 1000000, "name": "Booking Fee" }
          ]
        }
      ]
    }
    ```

### G. Daftar Unit Makam Terdaftar
Mengambil daftar kavling fisik yang sudah resmi dimiliki pembeli.
*   **Endpoint**: `GET /customer/units`
*   **Skema Response (Sukses 200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 810,
          "unit_name": "Single - A17 - 17",
          "block": "A17",
          "unit_no": "17",
          "allocated_for": "-"
        }
      ]
    }
    ```

---

## 4. Perlindungan Data & Aturan Mutasi State (Read-Only Policy)
Guna menjamin keamanan integritas data pada database staging server Kotahati:
1.  **Read-Only Policy**: Semua fitur mutasi data yang berdaruh langsung pada saldo keuangan, pembuatan invoice baru, dan penghapusan unit dinonaktifkan di sisi Frontend (hanya melayani GET fetch request).
2.  **Penanganan Error & Off-line Fallback**: Jika server API staging Kotahati mengalami kegagalan akses (status 5xx atau timeout), fungsi integrasi pada file `lib/api.js` akan beralih secara halus menggunakan data bayangan (*hardcoded mock fallback data*) yang identik dengan kondisi real staging guna menjaga kestabilan operasional portal lokal.
