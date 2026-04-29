# Karaengta HRIS

Sistem manajemen SDM internal — dashboard rekrutmen, karyawan, absensi, dan SP.

**Stack:** HTML + Vanilla JS + Supabase (PostgreSQL + Auth + RLS)

---

## 📁 Struktur File

```
karaengta-hris/
├── login.html              ← Halaman login & signup
├── dashboard.html          ← Dashboard utama (HRIS)
├── js/
│   ├── config.js           ← URL & API key Supabase (PERLU DIISI)
│   └── supabase.js         ← Client + helper queries
├── sql/
│   ├── 01_schema.sql       ← Buat tabel
│   ├── 02_seed.sql         ← Data awal
│   └── 03_rls_policies.sql ← Auth & permission
├── .gitignore
└── README.md
```

---

## 🚀 Setup dari Nol (langkah per langkah)

### 1. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → Sign up (gratis)
2. Klik **New Project**
3. Pilih region: **Singapore** (terdekat dari Indonesia)
4. Buat password database — **simpan di tempat aman**
5. Tunggu ± 2 menit sampai project ready

### 2. Setup Database

1. Di Supabase dashboard, buka **SQL Editor** → **New Query**
2. Copy-paste isi `sql/01_schema.sql` → klik **Run** (Ctrl+Enter)
3. Buat query baru → paste `sql/02_seed.sql` → **Run**
4. Buat query baru → paste `sql/03_rls_policies.sql` → **Run**
5. Cek di **Table Editor** — harusnya ada 5 tabel: `employees`, `recruitment`, `attendance`, `employee_sp`, `hr_users`

### 3. Konfigurasi `js/config.js`

1. Di Supabase, buka **Project Settings** (ikon roda gigi) → **API**
2. Copy 2 nilai berikut:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **Project API keys → `anon` `public`** (panjang sekali, mulai dari `eyJ...`)
3. Buka `js/config.js`, paste 2 nilai di atas:
   ```js
   export const SUPABASE_URL      = 'https://abcdefgh.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```

> ⚠️ **JANGAN** paste `service_role` key di sini — itu key admin yang bypass semua security. Kalau bocor, database Anda bisa dicuri/dihapus siapapun.

### 4. Buat Akun Admin Pertama

1. Buka `login.html` di browser (klik kanan → Open with browser)
2. Pilih tab **Daftar** → isi nama, email, password → submit
3. Cek email Anda untuk konfirmasi (kalau Supabase Email Confirmation aktif)
   - Atau matikan dulu di Supabase: **Authentication → Providers → Email** → uncheck "Confirm email"
4. Setelah signup, kembali ke **Supabase SQL Editor**, jalankan:
   ```sql
   UPDATE hr_users
   SET role = 'admin', is_active = TRUE
   WHERE email = 'email-anda@example.com';
   ```
5. Sekarang login di `login.html` → akan redirect ke `dashboard.html`

### 5. Tambah User HR Lain

Setelah signup, admin perlu aktivasi manual via SQL:
```sql
-- Lihat user yang baru daftar tapi belum aktif:
SELECT * FROM hr_users WHERE is_active = FALSE;

-- Aktivasi sebagai hr_staff (bisa CRUD):
UPDATE hr_users
SET role = 'hr_staff', is_active = TRUE
WHERE email = 'staff@karaengta.com';

-- Atau sebagai viewer (read-only):
UPDATE hr_users
SET role = 'viewer', is_active = TRUE
WHERE email = 'manajer@karaengta.com';
```

**Role yang tersedia:**
- `admin` — full access, bisa CRUD + lihat semua user
- `hr_manager` — full CRUD
- `hr_staff` — full CRUD
- `viewer` — hanya read

---

## 🌐 Deploy ke GitHub Pages

### 1. Push ke GitHub

```bash
cd karaengta-hris
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/karaengta-hris.git
git push -u origin main
```

### 2. Aktifkan GitHub Pages

1. Buka repo Anda di GitHub
2. **Settings → Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` / `(root)` → **Save**
5. Tunggu ± 1 menit, akan muncul URL: `https://USERNAME.github.io/karaengta-hris/login.html`

### 3. (PENTING) Tambahkan URL ke Supabase

Supaya auth bisa redirect dengan benar:

1. Supabase → **Authentication → URL Configuration**
2. **Site URL:** `https://USERNAME.github.io/karaengta-hris/`
3. **Redirect URLs:** tambahkan `https://USERNAME.github.io/karaengta-hris/dashboard.html`
4. Save

---

## ❓ Apakah `anon key` di GitHub aman?

**Ya, asalkan RLS aktif.** Itulah gunanya `03_rls_policies.sql`. 

- `anon key` hanya bisa query tabel sesuai policy yang sudah didefinisikan
- Tanpa login, user **tidak bisa** baca/tulis apa-apa (karena policy butuh `is_active_hr_user()` = true)
- Setelah login, hanya user yang `is_active = TRUE` yang bisa baca data
- Hanya role `admin`/`hr_manager`/`hr_staff` yang bisa CRUD

**Yang TIDAK aman** untuk dipush ke GitHub:
- ❌ `service_role` key (bypass semua RLS)
- ❌ Database password
- ❌ JWT secret

File `js/config.js` di repo ini **hanya berisi `anon key`** — aman.

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---|---|
| "Failed to fetch" di console | URL Supabase salah di `config.js`, atau project Supabase di-pause (free tier auto-pause kalau idle 1 minggu) |
| Login berhasil tapi langsung kembali ke login | User belum di-`UPDATE is_active = TRUE` di `hr_users` |
| Data tidak muncul setelah login | Cek **Authentication → Users**, pastikan user terdaftar. Cek juga `hr_users` table. |
| Tombol "Tambah Kandidat" tidak ada | User Anda bukan `hr_staff`/`admin`/`hr_manager` |
| Error CORS | Tambahkan domain GitHub Pages ke Supabase Auth URL Configuration |

---

## 📊 Skema Database

- **employees** — master data karyawan (PK: `employee_id`)
- **recruitment** — kandidat & tracking pipeline (PK: `id`)
- **attendance** — absensi bulanan, FK ke employees
- **employee_sp** — riwayat SP, FK ke employees
- **hr_users** — extension dari `auth.users` dengan role
