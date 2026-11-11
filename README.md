# Review Kantin Kampus

Aplikasi full-stack untuk menemukan, melihat, dan mengelola informasi warung kantin kampus. Frontend berkomunikasi dengan REST API backend, sedangkan backend menyimpan data ke Microsoft SQL Server.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, TypeScript, Express 5, `tsx` |
| Database | Microsoft SQL Server, `mssql`, Drizzle ORM |
| Validasi dan autentikasi | Zod, JWT, bcrypt |
| Dokumentasi API | Swagger UI |

## Prasyarat

- Node.js **22.18.0 atau lebih baru** dan npm.
- Microsoft SQL Server yang dapat diakses dari backend.
- Database dan tabel aplikasi sudah dibuat sesuai skema proyek. `Backend/tugas3-security-auth/src/db/seed.sql` berisi data awal, bukan skrip pembuatan seluruh skema.

## Instalasi

Clone repository frontend:

```powershell
git clone https://github.com/prasojotito/tugas4-reviewkantin-fullstack.git
cd tugas4-reviewkantin-fullstack
```

Backend disimpan sebagai repository terpisah. Jika folder backend belum berisi source code, ambil repository backend ke lokasi yang digunakan aplikasi:

```powershell
git clone https://github.com/prasojotito/tugas3-security-auth.git Backend\tugas3-security-auth
```

Pasang dependency frontend dan backend:

```powershell
cd Backend\tugas3-security-auth
npm install
cd ..\..\Frontend
npm install
cd ..
```

> Jika source backend sudah tersedia, lewati perintah `git clone` di atas.

## Konfigurasi environment

Buat file `.env` dari template di masing-masing aplikasi. Jalankan perintah berikut dari root repository:

```powershell
Copy-Item Backend\tugas3-security-auth\.env.example Backend\tugas3-security-auth\.env
Copy-Item Frontend\.env.example Frontend\.env
```

Atur nilai di file `.env` backend sesuai SQL Server dan origin frontend:

| Variabel | Kegunaan |
|---|---|
| `DB_SERVER` | Host atau alamat server SQL Server |
| `DB_PORT` | Port SQL Server |
| `DB_USER`, `DB_PASSWORD` | Kredensial database |
| `DB_NAME` | Nama database aplikasi |
| `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` | Pengaturan koneksi terenkripsi dan sertifikat SQL Server |
| `JWT_SECRET` | Secret acak untuk menandatangani token; gunakan nilai rahasia yang kuat |
| `JWT_EXPIRES_IN` | Masa berlaku token |
| `FRONTEND_ORIGIN` | Origin frontend yang diizinkan CORS; untuk Vite lokal gunakan `http://localhost:5173` |

Frontend menggunakan:

| Variabel | Kegunaan |
|---|---|
| `VITE_API_BASE_URL` | URL dasar API; untuk backend lokal gunakan `http://localhost:3000/api/v1` |

Jangan membagikan atau meng-commit file `.env`. Ganti setiap nilai kredensial contoh di template dengan konfigurasi milik sendiri.

## Menjalankan aplikasi

Pastikan database SQL Server sudah aktif dan dapat diakses. Jalankan backend dan frontend di **dua terminal PowerShell terpisah**.

Terminal 1 — backend:

```powershell
cd Backend\tugas3-security-auth
npm run dev
```

Backend berjalan pada `http://localhost:3000`. Script development juga membuat ulang dokumentasi Swagger sebelum server dijalankan.

Terminal 2 — frontend:

```powershell
cd Frontend
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Memeriksa koneksi dan dokumentasi API

- `http://localhost:3000/health` — status backend dan koneksi database.
- `http://localhost:3000/docs` — dokumentasi interaktif endpoint API.
- Endpoint aplikasi menggunakan prefix `http://localhost:3000/api/v1`.

Jika health check gagal, periksa apakah SQL Server aktif, database dan tabel sudah tersedia, serta nilai koneksi pada `.env` backend sudah benar.

## Perintah pemeriksaan frontend

Jalankan dari folder `Frontend`:

```powershell
npm run build
npm run lint
```
