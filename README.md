# Karaengta HRIS

Sistem Informasi SDM internal berbasis web untuk mengelola rekrutmen, data karyawan, absensi, dan Surat Peringatan (SP). Dirancang sebagai single-page application yang ringan — tidak butuh framework, tidak butuh server sendiri. Cukup buka file HTML di browser, semua data disimpan dan dikelola melalui Supabase.

---

## Fitur

### 🏠 Dashboard

Halaman utama yang memberikan gambaran kondisi SDM perusahaan secara sekilas dan real-time. Tersedia kartu statistik yang menampilkan total karyawan aktif, jumlah kandidat yang sedang diproses, total absensi bulan berjalan, dan rekapitulasi Surat Peringatan berdasarkan tingkat (SP1, SP2, SP3).

Di bawah statistik tersedia **pipeline rekrutmen dalam format kanban visual** — setiap kolom mewakili satu tahap seleksi, dan setiap kartu kandidat dapat diklik untuk melihat detailnya. Pipeline ini diperbarui secara otomatis setiap kali data rekrutmen berubah, sehingga tim HR selalu melihat kondisi terkini tanpa perlu refresh manual.

### 👥 Rekrutmen

Modul ini mengelola seluruh siklus penerimaan karyawan baru, dari tahap awal hingga penempatan.

**Pipeline kanban** terdiri dari lima tahap berurutan:

| Tahap | Keterangan |
|---|---|
| Screening | Seleksi berkas awal — kelengkapan administrasi dan kesesuaian kualifikasi |
| Psikotest | Tes psikologis dan kepribadian |
| Interview | Wawancara dengan tim HR dan/atau user |
| Medical Check-Up | Pemeriksaan kesehatan calon karyawan |
| Penempatan | Kandidat diterima dan siap onboarding |

Selain kanban, tersedia **tabel kandidat lengkap** yang bisa difilter berdasarkan nama, posisi yang dilamar, dan status tahapan. Untuk menambah kandidat baru, tersedia form dengan kolom: nama lengkap, posisi yang dilamar, domisili, usia, status pengumpulan berkas, dan tanggal melamar.

### 🗂️ Karyawan

Modul ini berfungsi sebagai master data seluruh karyawan perusahaan. Data yang tercatat per karyawan mencakup nama lengkap, jabatan, unit/departemen, dan status kepegawaian — yaitu **Tetap**, **Kontrak**, atau **Magang**.

Tampilan dibagi menjadi dua tab: **Aktif** dan **Tidak Aktif**, sehingga riwayat karyawan yang sudah keluar tetap tersimpan dan bisa diakses kapan saja. Tersedia filter berdasarkan nama, status kepegawaian, dan unit organisasi untuk memudahkan pencarian di database karyawan yang besar.

### 📅 Absensi

Modul rekap kehadiran karyawan yang diorganisir per bulan. Setiap baris mewakili satu karyawan, dengan kolom kehadiran yang terdiri dari:

| Kolom | Keterangan |
|---|---|
| Hadir | Jumlah hari masuk kerja |
| Sakit | Ketidakhadiran karena sakit (dengan surat) |
| Izin | Ketidakhadiran dengan izin resmi |
| Alpha | Ketidakhadiran tanpa keterangan |
| Cuti | Pengambilan hak cuti |

Data absensi bisa difilter berdasarkan bulan dan tahun, sehingga mudah menarik rekap untuk keperluan penggajian atau evaluasi bulanan.

### ⚠️ Surat Peringatan (SP)

Modul pencatatan dan riwayat Surat Peringatan karyawan. Mendukung tiga tingkat SP sesuai regulasi ketenagakerjaan: **SP1**, **SP2**, dan **SP3**. Setiap entri SP menyimpan nama karyawan, tingkat SP, tanggal penerbitan, dan keterangan pelanggaran.

Riwayat SP bersifat kumulatif — seluruh catatan SP seorang karyawan tersimpan dan dapat dilihat sekaligus, berguna untuk proses evaluasi atau ketika perlu mengambil keputusan tindak lanjut. Tersedia filter berdasarkan nama karyawan dan tingkat SP.

---

## Hak Akses

Sistem menggunakan model role-based access control (RBAC) dengan empat level. Pembatasan akses diterapkan di dua lapisan: di sisi UI (tombol aksi disembunyikan untuk role yang tidak berhak) dan di sisi database (melalui Row Level Security Supabase), sehingga pembatasan tidak bisa dilewati hanya dengan memanipulasi tampilan.

| Role | Kemampuan |
|---|---|
| `admin` | Full access — CRUD semua modul, dapat melihat dan mengelola daftar user HR |
| `hr_manager` | Full CRUD di semua modul (rekrutmen, karyawan, absensi, SP) |
| `hr_staff` | Full CRUD di semua modul (rekrutmen, karyawan, absensi, SP) |
| `viewer` | Read-only — hanya bisa melihat data, tidak ada aksi tambah/edit/hapus |

Setiap akun yang baru mendaftar tidak otomatis aktif — admin perlu mengaktifkan dan menetapkan role secara manual melalui database, sehingga tidak ada user tidak dikenal yang bisa masuk ke sistem.

---

## Stack Teknologi

**Frontend** dibangun sepenuhnya dengan HTML5, Vanilla JavaScript, dan CSS custom properties tanpa framework apapun — tidak ada build step, tidak ada dependensi npm. Satu-satunya aset eksternal adalah font Manrope dari Google Fonts.

**Backend** menggunakan [Supabase](https://supabase.com), platform open-source berbasis PostgreSQL yang menyediakan database, autentikasi, dan API secara terintegrasi. Seluruh otorisasi data dikelola melalui Row Level Security (RLS) langsung di level database.

**Database** terdiri dari 5 tabel:

| Tabel | Isi |
|---|---|
| `employees` | Master data karyawan (primary key: `employee_id`) |
| `recruitment` | Data kandidat dan pipeline seleksi |
| `attendance` | Rekap absensi bulanan, berelasi ke `employees` |
| `employee_sp` | Riwayat SP, berelasi ke `employees` |
| `hr_users` | Ekstensi dari `auth.users` Supabase — menyimpan role dan status aktif |

---

## Struktur File

```
karaengta-hris/
├── login.html              ← Halaman login & signup
├── dashboard.html          ← Dashboard utama (semua modul dalam satu halaman)
├── js/
│   ├── config.js           ← URL & API key Supabase (perlu diisi sebelum dipakai)
│   └── supabase.js         ← Supabase client + semua helper query ke database
├── sql/
│   ├── 01_schema.sql       ← DDL: buat semua tabel dan relasi
│   ├── 02_seed.sql         ← Data awal untuk pengujian
│   └── 03_rls_policies.sql ← Row Level Security: atur siapa boleh baca/tulis apa
└── README.md
```