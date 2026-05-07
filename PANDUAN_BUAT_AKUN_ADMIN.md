# Panduan Buat Akun Admin HR Karaengta

## Cara Membuat Akun Admin Baru

### Langkah 1 — Daftar Akun di Supabase Auth

Buka Supabase Dashboard → pilih project HRIS Karaengta → klik **Authentication** di sidebar kiri → tab **Users** → klik **"Add user"** → pilih **"Create new user"**

Isi:
- **Email:** `email-anda@gmail.com`
- **Password:** pilih password yang kuat (min. 8 karakter, ada huruf besar, angka)
- **Auto Confirm User:** centang ✓

Klik **"Create User"**. Salin **User UID** yang muncul (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

---

### Langkah 2 — Aktifkan sebagai Admin di SQL Editor

Buka **SQL Editor** → **New Query** → paste salah satu query berikut:

#### Opsi A: Pakai Email (paling mudah)
```sql
UPDATE hr_users
SET role = 'admin', is_active = TRUE
WHERE email = 'email-anda@gmail.com';
```

#### Opsi B: Pakai UID (jika email belum terdaftar di hr_users)
```sql
-- Cek dulu apakah sudah ada:
SELECT * FROM hr_users WHERE email = 'email-anda@gmail.com';

-- Jika tidak ada, insert manual:
INSERT INTO hr_users (id, email, full_name, role, is_active)
VALUES (
  'paste-uid-dari-langkah-1-disini',
  'email-anda@gmail.com',
  'Muhammad Syamsul Bahri',
  'admin',
  TRUE
)
ON CONFLICT (id) DO UPDATE
  SET role = 'admin', is_active = TRUE;
```

Klik **Run**. Pastikan output menunjukkan `1 row affected`.

---

### Langkah 3 — Login ke HRIS

Buka `http://127.0.0.1:5500/dashboard.html` (atau URL deploy-mu) → masukkan email & password yang tadi dibuat → klik Login.

---

## Role yang Tersedia

| Role | Bisa Lihat | Bisa Edit/Tambah/Hapus |
|---|---|---|
| `admin` | Semua halaman termasuk Kelola User | ✅ Semua |
| `hr_manager` | Semua halaman kecuali Kelola User | ✅ Semua data |
| `hr_staff` | Semua halaman kecuali Kelola User | ✅ Semua data |
| `viewer` | Semua halaman | ❌ Read only |

---

## Menambah User HR Lain

Setelah login sebagai admin:

1. Buka sidebar → klik **Kelola User**
2. User yang sudah daftar akan muncul (awalnya `role: viewer, status: tidak aktif`)
3. Ubah role sesuai kebutuhan dan aktifkan

Atau via SQL:
```sql
-- Lihat semua user yang belum diaktifkan:
SELECT id, email, full_name, role, is_active FROM hr_users;

-- Aktifkan dan set role user tertentu:
UPDATE hr_users
SET role = 'hr_staff', is_active = TRUE
WHERE email = 'email-rekan@gmail.com';
```

---

## Jika Lupa Password

Supabase Dashboard → Authentication → Users → cari email → klik **"Send password reset"**

Atau reset langsung via SQL:
```sql
-- Tidak bisa reset password via SQL, harus via Supabase Dashboard
-- Authentication → Users → titik tiga (...) → Reset Password
```

---

## Cek Status Akun

```sql
SELECT
  u.email,
  u.full_name,
  u.role,
  u.is_active,
  u.created_at,
  au.last_sign_in_at
FROM hr_users u
JOIN auth.users au ON au.id = u.id
ORDER BY u.created_at DESC;
```
