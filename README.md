# Review Kantin Kampus

Aplikasi full-stack untuk menemukan dan mengelola warung kantin kampus. Frontend menyediakan antarmuka untuk mencari warung, melihat kategori dan rating, serta mendaftar atau masuk. Backend menyediakan REST API, autentikasi JWT, validasi input, otorisasi berbasis role, dan akses ke SQL Server.

> **Catatan ruang lingkup:** Frontend saat ini mengintegrasikan alur autentikasi dan data warung. Backend juga menyediakan endpoint menu, review, likes, flags, audit, dan administrasi; endpoint tersebut dapat digunakan melalui API, tetapi belum semuanya memiliki halaman/fitur di frontend.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur repository](#struktur-repository)
- [Arsitektur dan integrasi frontend-backend](#arsitektur-dan-integrasi-frontend-backend)
- [Prasyarat](#prasyarat)
- [Menyiapkan database](#menyiapkan-database)
- [Menjalankan aplikasi di Windows](#menjalankan-aplikasi-di-windows)
- [Konfigurasi environment](#konfigurasi-environment)
- [Alur penggunaan](#alur-penggunaan)
- [API](#api)
- [Format respons dan error](#format-respons-dan-error)
- [Validasi dan aturan akses](#validasi-dan-aturan-akses)
- [Build dan pemeriksaan kode](#build-dan-pemeriksaan-kode)
- [Pemecahan masalah](#pemecahan-masalah)
- [Keamanan dan kontribusi](#keamanan-dan-kontribusi)

## Fitur

### Frontend

- Daftar warung dengan pencarian, filter kategori, dan pagination.
- Kategori, warung populer, rating, lokasi, dan detail warung.
- Registrasi, login, halaman profil, serta penyimpanan sesi JWT di browser.
- Form tambah dan ubah warung yang dibatasi berdasarkan role.
- Navigasi ke halaman detail, skeleton saat memuat, dan tampilan error.
- Antarmuka responsif dengan palet warna cokelat.

### Backend

- REST API dengan prefix versi `/api/v1`.
- Validasi body, parameter, dan query memakai Zod.
- Autentikasi JWT dan otorisasi role `admin`, `owner`, serta `customer`.
- Password di-hash memakai bcrypt.
- Akses database SQL Server melalui Drizzle ORM.
- Dokumentasi interaktif Swagger di `/docs` dan pemeriksaan layanan di `/health`.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, TypeScript, Express 5, `tsx` |
| Database | Microsoft SQL Server, `mssql`, Drizzle ORM |
| Validasi | Zod |
| Autentikasi | JWT (`jsonwebtoken`), bcrypt |
| Dokumentasi API | `swagger-autogen`, Swagger UI |

Backend didokumentasikan menggunakan Node.js **22.18.0 atau lebih baru**. Menggunakan versi ini atau lebih baru juga sesuai untuk menjalankan toolchain frontend pada project.

## Struktur repository

```text
.
├── README.md
├── Backend/
│   └── tugas3-security-auth/
│       ├── .env.example
│       ├── package.json
│       ├── drizzle.config.ts
│       └── src/
│           ├── index.ts
│           ├── controllers/
│           ├── db/              # koneksi, pemetaan tabel, dan seed SQL
│           ├── docs/            # generator dan hasil Swagger
│           ├── dtos/
│           ├── middlewares/     # validasi, autentikasi, otorisasi, error
│           ├── repositories/    # query database
│           ├── routes/
│           ├── schemas/         # skema Zod
│           ├── services/        # aturan bisnis
│           └── utils/
└── Frontend/
    ├── .env.example
    ├── package.json
    └── src/
        ├── api/                 # client Axios dan pemanggilan endpoint
        ├── components/
        ├── context/             # state autentikasi
        ├── pages/
        ├── types/
        └── utils/
```

## Arsitektur dan integrasi frontend-backend

```text
Browser (React/Vite :5173)
        │
        │ HTTP JSON, /api/v1/*
        │ Authorization: Bearer <JWT> untuk endpoint privat
        ▼
Express API (:3000)
        │
        ├── Router → middleware → Controller → Service → Repository
        │
        ▼
Microsoft SQL Server (:1433 secara default)
```

1. Frontend membaca `VITE_API_BASE_URL` dan membuat Axios client di `Frontend/src/api/client.ts`.
2. Modul `auth.ts` dan `stalls.ts` mengirim request ke API. Base URL frontend sudah berisi `/api/v1`, sehingga request seperti `/stalls` diteruskan ke `/api/v1/stalls`.
3. Express memasang router warung pada `/api/v1/stalls`, autentikasi pada `/api/v1/auth`, dan fitur API lainnya pada `/api/v1`.
4. Untuk request yang memerlukan login, frontend mengirim JWT dari `localStorage` melalui header `Authorization`. Token diperoleh dari login; bila endpoint privat mengembalikan `401`, client menghapus token dan memberi tahu konteks autentikasi.
5. Backend memvalidasi data, menjalankan aturan bisnis, lalu mengakses SQL Server melalui repository dan Drizzle ORM.
6. Backend mengizinkan origin frontend melalui `FRONTEND_ORIGIN`. Nilainya harus sama dengan origin browser yang digunakan untuk membuka frontend.

### Bentuk data warung

Objek warung yang dikembalikan API memiliki bentuk utama berikut:

```json
{
  "id": 1,
  "ownerId": 2,
  "name": "Warung Contoh",
  "category": "Makanan",
  "location": "Kantin Kampus",
  "description": "Menu rumahan",
  "avgRating": 4.5,
  "reviewCount": 2,
  "isPopular": false
}
```

`category`, `location`, dan `description` dapat bernilai `null`. Nilai `isPopular` dihitung backend dari rating. Respons sukses membungkus objek dalam `data`; respons daftar warung juga menyertakan `meta` untuk pagination.

## Prasyarat

- Node.js 22.18.0 atau lebih baru dan npm.
- SQL Server yang dapat diakses dari mesin backend.
- Database `review_kantin` dan tabel-tabel yang sesuai dengan definisi skema backend.
- Terminal PowerShell untuk contoh perintah Windows di bawah.

## Menyiapkan database

Backend menggunakan tabel `USERS`, `STALLS`, `MENU_ITEMS`, `REVIEWS`, `LIKES`, `FLAGS`, dan `AUDIT_LOGS`, yang pemetaannya tersedia di `Backend/tugas3-security-auth/src/db/schema.ts`.

Sebelum menjalankan server:

1. Pastikan SQL Server aktif dan database `review_kantin` telah dibuat.
2. Siapkan tabel sesuai skema project/Tugas 2.
3. Jika ingin mengisi data contoh, jalankan `Backend/tugas3-security-auth/src/db/seed.sql` terhadap database tersebut.
4. Siapkan akun database yang dapat mengakses tabel-tabel itu dan masukkan konfigurasinya ke `.env` backend.

Repository ini menyertakan file seed, tetapi **tidak menyertakan skrip DDL lengkap untuk membuat database dan tabel dari awal**. Seed mengasumsikan database serta tabel sudah tersedia. Periksa file seed dan sumber skema terlebih dahulu sebelum menjalankannya pada database yang berisi data penting.

## Menjalankan aplikasi di Windows

Jalankan backend dan frontend di **dua terminal PowerShell terpisah**.

### 1. Instalasi dan konfigurasi backend

```powershell
cd Backend\tugas3-security-auth
npm install
Copy-Item .env.example .env
```

Buka `Backend/tugas3-security-auth/.env` dan sesuaikan konfigurasi SQL Server serta JWT. Pastikan `FRONTEND_ORIGIN` sama dengan alamat frontend, secara default `http://localhost:5173`.

### 2. Menjalankan backend

Dari folder `Backend/tugas3-security-auth`:

```powershell
npm run dev
```

Backend berjalan di `http://localhost:3000`. Script `dev` akan menghasilkan dokumentasi Swagger sebelum server dijalankan.

Endpoint pemeriksaan:

- `http://localhost:3000/health` — memeriksa koneksi server dan database.
- `http://localhost:3000/docs` — dokumentasi interaktif endpoint.

`/health` merespons sukses hanya bila koneksi database berhasil.

### 3. Instalasi dan konfigurasi frontend

Buka terminal PowerShell baru dari root repository:

```powershell
cd Frontend
npm install
Copy-Item .env.example .env
```

Nilai default di `Frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Ubah nilai tersebut jika backend berjalan pada host atau port berbeda. Setelah mengubah file environment, mulai ulang Vite agar nilai baru dimuat.

### 4. Menjalankan frontend

Dari folder `Frontend`:

```powershell
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

### Urutan startup

1. Jalankan SQL Server dan pastikan database/tabel tersedia.
2. Jalankan backend dan pastikan `/health` memberi status sukses.
3. Jalankan frontend.
4. Buka frontend melalui origin yang sesuai dengan `FRONTEND_ORIGIN`.

## Konfigurasi environment

### Backend

Salin `.env.example` menjadi `.env`, lalu isi dengan konfigurasi lokal. Variabel yang digunakan:

| Variabel | Fungsi |
|---|---|
| `DB_SERVER` | Host SQL Server |
| `DB_PORT` | Port SQL Server, default project `1433` |
| `DB_USER` | User database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Nama database, umumnya `review_kantin` |
| `DB_ENCRYPT` | Mengaktifkan enkripsi koneksi SQL Server (`true`/`false`) |
| `DB_TRUST_SERVER_CERTIFICATE` | Pengaturan sertifikat SQL Server |
| `JWT_SECRET` | Secret untuk menandatangani JWT; ganti dengan nilai acak dan rahasia |
| `JWT_EXPIRES_IN` | Masa berlaku token, misalnya `2h` |
| `FRONTEND_ORIGIN` | Origin frontend yang diizinkan CORS |

### Frontend

Frontend menggunakan:

| Variabel | Fungsi |
|---|---|
| `VITE_API_BASE_URL` | URL dasar API, termasuk prefix `/api/v1` |

Variabel frontend dengan prefix `VITE_` tersedia di bundle browser. Jangan menyimpan password database, JWT secret, atau kredensial privat di frontend.

## Alur penggunaan

1. Pengunjung membuka halaman utama; daftar warung dan kategori dimuat dari backend.
2. Pengunjung dapat mencari berdasarkan nama dan memilih kategori. Pagination mengikuti parameter API.
3. Pengguna mendaftar melalui halaman registrasi. Akun baru mendapat role `customer`; role tidak dapat dipilih melalui form registrasi.
4. Pengguna login. Frontend menyimpan token JWT dan data user, lalu memverifikasi sesi tersimpan dengan `GET /auth/me` saat aplikasi dibuka kembali.
5. `owner` atau `admin` dapat membuka form tambah warung. Owner hanya dapat mengubah warung miliknya; admin dapat mengubah semua warung.
6. Hanya admin yang dapat menghapus warung melalui API.
7. Logout menghapus token dari browser. Token yang tidak valid atau kedaluwarsa juga dibersihkan ketika API mengembalikan `401`.

## API

### Base URL

```text
http://localhost:3000/api/v1
```

Swagger UI menyediakan dokumentasi request dan response lengkap di `http://localhost:3000/docs`.

### Endpoint utama: autentikasi dan warung

| Method | Path | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/auth/register` | Publik | Daftar akun customer |
| `POST` | `/auth/login` | Publik | Login dan memperoleh JWT |
| `GET` | `/auth/me` | Semua role, wajib login | Profil dari token |
| `GET` | `/stalls` | Publik | Daftar warung; mendukung `search`, `category`, `page`, `limit` |
| `GET` | `/stalls/:id` | Publik | Detail warung |
| `GET` | `/stalls/:id/menus` | Publik | Menu untuk warung |
| `GET` | `/stalls/:id/reviews` | Publik | Daftar ulasan untuk warung |
| `POST` | `/stalls` | `owner`, `admin` | Membuat warung |
| `PUT` | `/stalls/:id` | Owner pemilik atau `admin` | Mengubah warung |
| `DELETE` | `/stalls/:id` | `admin` | Menghapus warung |
| `POST` | `/stalls/:id/reviews` | Semua role, wajib login | Menambahkan review |

### Endpoint tambahan backend

Endpoint berikut tersedia di backend dengan prefix `/api/v1`, tetapi belum seluruhnya dihubungkan ke antarmuka frontend:

| Method | Path | Akses |
|---|---|---|
| `GET` | `/users` | `admin` |
| `GET` | `/menu-items`, `/menu-items/:id` | Publik |
| `POST`, `PUT`, `DELETE` | `/menu-items`, `/menu-items/:id` | `admin` |
| `GET` | `/reviews` | Publik |
| `DELETE` | `/reviews/:id` | `admin` |
| `POST` | `/likes` | Wajib login |
| `DELETE` | `/likes/:id` | `admin` |
| `GET` | `/flags` | `admin` |
| `PUT` | `/flags/:id` | `admin` |
| `GET`, `POST` | `/audit` | `admin` |

### Contoh request

Daftar warung dengan pagination dan filter:

```http
GET http://localhost:3000/api/v1/stalls?search=nasi&category=Nasi&page=1&limit=6
```

Registrasi:

```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Nama Pengguna",
  "email": "pengguna@example.com",
  "password": "password-yang-kuat"
}
```

Login:

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "pengguna@example.com",
  "password": "password-yang-kuat"
}
```

Membuat warung (gunakan token milik `owner` atau `admin`):

```http
POST http://localhost:3000/api/v1/stalls
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "name": "Warung Contoh",
  "category": "Makanan",
  "location": "Kantin Kampus",
  "description": "Menu rumahan"
}
```

`ownerId` untuk warung dan identitas pengguna untuk review diambil dari token, bukan dari body request.

## Format respons dan error

Respons sukses menggunakan bentuk umum:

```json
{
  "status": "success",
  "data": {}
}
```

Daftar warung menambahkan metadata pagination:

```json
{
  "status": "success",
  "meta": {
    "page": 1,
    "limit": 6,
    "total": 10
  },
  "data": []
}
```

Error validasi mengembalikan `status`, `message`, dan daftar `errors` per field. Contoh:

```json
{
  "status": "fail",
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "name",
      "message": "name minimal 3 karakter"
    }
  ]
}
```

Status yang umum:

| Status HTTP | Arti |
|---|---|
| `400` | Input tidak lolos validasi |
| `401` | Belum login, token tidak valid, atau token kedaluwarsa |
| `403` | Sudah login, tetapi role atau kepemilikan tidak memenuhi |
| `404` | Resource tidak ditemukan |
| `409` | Konflik, misalnya email sudah terdaftar |
| `500` | Kesalahan internal server |

## Validasi dan aturan akses

- Registrasi memerlukan `name` 3–100 karakter, email valid, dan password 8–72 karakter.
- Pencarian warung mendukung `page` minimal 1 dan `limit` 1–100; default backend adalah page 1 dan limit 10.
- Pembuatan warung memerlukan `name` 3–100 karakter. Kategori maksimal 50 karakter, lokasi maksimal 100, dan deskripsi maksimal 1000.
- Rating review berupa bilangan bulat 1–5; komentar opsional maksimal 1000 karakter.
- `401 Unauthorized` berarti identitas belum terautentikasi. `403 Forbidden` berarti pengguna terautentikasi tetapi tidak mempunyai izin.
- Validasi dilakukan di backend; validasi frontend hanya membantu pengalaman pengguna dan tidak menggantikan pemeriksaan server.

## Build dan pemeriksaan kode

Dari folder `Frontend`:

```powershell
npm run build
npm run lint
```

`build` menjalankan pemeriksaan TypeScript (`tsc -b`) lalu membangun aset produksi dengan Vite. `lint` menjalankan ESLint.

Dari folder `Backend/tugas3-security-auth`:

```powershell
npm run docs:gen
npm run dev
```

Backend saat ini tidak mendefinisikan script test atau build di `package.json`. File `test.http` berisi contoh request REST yang dapat dijalankan melalui ekstensi REST Client VS Code.

## Pemecahan masalah

### Frontend menampilkan pesan tidak dapat terhubung ke server

- Pastikan backend berjalan di port `3000`.
- Buka `http://localhost:3000/health` dan periksa responsnya.
- Pastikan `Frontend/.env` menggunakan URL API yang benar dan mencantumkan `/api/v1`.
- Setelah mengubah `.env`, mulai ulang Vite.

### Backend gagal terhubung ke database

- Pastikan service SQL Server berjalan dan nama server, port, user, password, serta nama database benar.
- Pastikan database dan tabel sudah dibuat sebelum menjalankan API.
- Periksa pengaturan `DB_ENCRYPT` dan `DB_TRUST_SERVER_CERTIFICATE` sesuai konfigurasi SQL Server lokal.
- Periksa log terminal backend; endpoint `/health` juga menampilkan bahwa koneksi database gagal.

### Browser menampilkan error CORS

Setel `FRONTEND_ORIGIN` di `.env` backend sesuai alamat yang dipakai browser, misalnya `http://localhost:5173`, lalu mulai ulang backend. `http://127.0.0.1:5173` dan `http://localhost:5173` adalah origin yang berbeda.

### Endpoint privat mengembalikan `401` atau `403`

- `401`: login kembali untuk memperoleh token yang valid.
- `403`: pastikan role akun sesuai endpoint dan owner hanya mengubah warung miliknya.
- Jangan mengirim token atau kredensial dalam laporan publik.

## Keamanan dan kontribusi

- Jangan commit file `.env` atau membagikan secret JWT dan password database.
- Gunakan `Frontend/.env.example` dan `Backend/tugas3-security-auth/.env.example` sebagai template konfigurasi; nilai lokal dapat berbeda.
- Jangan menaruh kredensial privat di variabel frontend `VITE_*`, karena nilai tersebut dikirim ke browser.
- Perubahan skema database perlu diselaraskan antara SQL Server, `src/db/schema.ts`, validasi, DTO, dan API.
- Sebelum mengirim perubahan, jalankan build frontend dan pemeriksaan yang relevan.
