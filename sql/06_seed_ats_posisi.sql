-- ═══════════════════════════════════════════════════════════
-- SEED DATA — ATS: Posisi Tersedia & Profil Kandidat
-- Karaengta HRIS v2.0 — Wilayah Maros, Sulawesi Selatan
-- Jalankan SETELAH 02_seed.sql berhasil dijalankan
-- ═══════════════════════════════════════════════════════════


-- ── JOB OPENINGS (Posisi Tersedia) ──────────────────────────
-- Posisi yang sedang dibuka per Januari–Februari 2026
-- Mencerminkan kebutuhan nyata: ada yang baru buka, ada yang sudah hampir terisi

INSERT INTO job_openings (title, department, branch, headcount, gaji_min, gaji_max, required_skills, min_experience, min_education, deadline, status, keterangan) VALUES

-- POSISI TERBUKA (open) --

('Staff Frontliner', 'Operasional', 'Outlet Tambua', 3, 2000000, 2500000,
  '[{"skill":"Komunikasi","min_level":7},{"skill":"Pelayanan Pelanggan","min_level":7},{"skill":"Kasir / POS System","min_level":5}]',
  0, 'SMA', '2026-03-15', 'open',
  'Dibutuhkan segera untuk mengisi kekosongan di Outlet Tambua pasca resign beberapa karyawan. Siap bekerja shift pagi dan malam.'),

('Staff Frontliner (Shift Malam)', 'Operasional', 'Outlet Batas Kota', 2, 2100000, 2600000,
  '[{"skill":"Komunikasi","min_level":6},{"skill":"Pelayanan Pelanggan","min_level":6},{"skill":"Ketahanan Fisik","min_level":7}]',
  0, 'SMA', '2026-03-20', 'open',
  'Khusus shift malam 20.00–06.00. Ada tunjangan shift malam Rp 200.000/bulan.'),

('Captain Store Bantimurung', 'Operasional', 'Outlet Bantimurung', 1, 2800000, 3300000,
  '[{"skill":"Leadership","min_level":7},{"skill":"Manajemen Stok","min_level":6},{"skill":"Pelayanan Pelanggan","min_level":8},{"skill":"Pengelolaan Kasir","min_level":6}]',
  1, 'SMA', '2026-03-10', 'open',
  'Memimpin tim frontliner di outlet Bantimurung. Minimal pernah jadi senior frontliner atau captain sebelumnya.'),

('Staff Produksi', 'Operasional', 'Produksi Pusat', 5, 2000000, 2400000,
  '[{"skill":"Ketelitian","min_level":7},{"skill":"Fisik Prima","min_level":7},{"skill":"Kerja Tim","min_level":6}]',
  0, 'SMA', '2026-03-31', 'open',
  'Kebutuhan mendesak di lini produksi. Bersedia bekerja 6 hari seminggu. Domisili Maros diutamakan.'),

('Design Graphic', 'Marketing', 'Management', 1, 2500000, 3500000,
  '[{"skill":"Adobe Photoshop","min_level":7},{"skill":"Adobe Illustrator","min_level":6},{"skill":"Canva","min_level":8},{"skill":"Konten Sosial Media","min_level":6}]',
  1, 'D3', '2026-03-15', 'open',
  'Membuat konten visual untuk sosial media, packaging, dan materi promosi. Portfolio wajib dilampirkan.'),

('Content Creator', 'Marketing', 'Management', 1, 2300000, 3000000,
  '[{"skill":"Videografi","min_level":7},{"skill":"Video Editing","min_level":7},{"skill":"Copywriting","min_level":6},{"skill":"Instagram / TikTok","min_level":8}]',
  1, 'SMA', '2026-03-20', 'open',
  'Membuat konten video dan foto produk untuk Instagram, TikTok, dan Facebook Karaengta.'),

('Office Boy', 'Umum', 'Management', 1, 1800000, 2000000,
  '[{"skill":"Kebersihan & Kerapian","min_level":8},{"skill":"Pengiriman Dokumen","min_level":6}]',
  0, 'SMA', '2026-03-31', 'open',
  'Menjaga kebersihan kantor pusat dan membantu distribusi dokumen antar divisi.'),

('Driver', 'Operasional', 'Management', 1, 2200000, 2800000,
  '[{"skill":"Mengemudi","min_level":9},{"skill":"Navigasi Daerah Maros","min_level":8},{"skill":"Tanggung Jawab","min_level":8}]',
  1, 'SMA', '2026-03-15', 'open',
  'Wajib punya SIM A aktif dan berpengalaman mengemudi. Hafal rute wilayah Maros–Makassar.'),

('Staff HRD', 'HRD', 'Management', 1, 2500000, 3200000,
  '[{"skill":"Rekrutmen","min_level":6},{"skill":"Administrasi HR","min_level":7},{"skill":"Microsoft Excel","min_level":7},{"skill":"Komunikasi","min_level":7}]',
  1, 'S1', '2026-03-15', 'open',
  'Membantu proses rekrutmen, administrasi karyawan, dan pelaporan HRD. Diutamakan lulusan Manajemen SDM atau Psikologi.'),

('Staff Accounting', 'Finance', 'Management', 1, 2800000, 3500000,
  '[{"skill":"Akuntansi Dasar","min_level":7},{"skill":"Microsoft Excel","min_level":8},{"skill":"Laporan Keuangan","min_level":7},{"skill":"Ketelitian","min_level":9}]',
  1, 'D3', '2026-03-20', 'open',
  'Mengelola pembukuan harian, rekap pengeluaran outlet, dan laporan keuangan bulanan.'),

('Social Media Specialist', 'Marketing', 'Management', 1, 2500000, 3200000,
  '[{"skill":"Instagram Marketing","min_level":8},{"skill":"Facebook Ads","min_level":7},{"skill":"Analitik Media Sosial","min_level":7},{"skill":"Copywriting","min_level":7}]',
  1, 'S1', '2026-03-25', 'open',
  'Mengelola akun sosial media Karaengta, membuat strategi konten, dan menganalisis performa post.'),

-- POSISI SUDAH TERISI (filled) --

('Captain Store Tambua', 'Operasional', 'Outlet Tambua', 1, 2800000, 3300000,
  '[{"skill":"Leadership","min_level":7},{"skill":"Manajemen Stok","min_level":7},{"skill":"Pelayanan Pelanggan","min_level":8}]',
  1, 'SMA', '2026-01-31', 'filled',
  'Posisi sudah terisi per Februari 2026.'),

('Supervisor Store Batas Kota', 'Operasional', 'Outlet Batas Kota', 1, 3200000, 4000000,
  '[{"skill":"Manajemen Tim","min_level":8},{"skill":"Pengelolaan Outlet","min_level":8},{"skill":"Pelaporan Operasional","min_level":7}]',
  2, 'SMA', '2026-01-20', 'filled',
  'Sudah diisi oleh kandidat internal yang dipromosikan.'),

-- POSISI DITUTUP (closed) --

('Customer Service (Social Media)', 'Marketing', 'Management', 1, 2200000, 2800000,
  '[{"skill":"Komunikasi Tertulis","min_level":8},{"skill":"Respon Cepat","min_level":8},{"skill":"Product Knowledge","min_level":7}]',
  0, 'SMA', '2025-12-31', 'closed',
  'Lowongan ditutup karena posisi dialihkan ke tim marketing.')

ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- RECRUITMENT TAMBAHAN — kandidat baru Januari–Februari 2026
-- Sesuai dengan posisi yang sedang dibuka
-- ═══════════════════════════════════════════════════════════

INSERT INTO recruitment (nama, no_percobaan, alamat_domisili, lokasi, pengumpulan_berkas, umur, interval_usia, status, posisi, applied, screening_cv, tes_tertulis, interview_hr, interview_user, training, ttd_kontrak, join_date, create_date, update_date) VALUES

-- Staff Frontliner Outlet Tambua (banyak pelamar, sudah di berbagai tahap) --

('Nurul Fajriah',1,'Dusun Patambungan, Desa Bontomatene, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-15','2026-01-16',NULL,'2026-01-17',NULL,NULL,'2026-01-20','2026-01-27','2026-01-15','2026-01-27'),

('Andi Reski Ramadhani',1,'Jl. Poros Maros-Makassar No. 14, Kel. Adatongeng, Kec. Turikale','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-15','2026-01-17',NULL,'2026-01-19',NULL,NULL,NULL,NULL,'2026-01-15','2026-01-19'),

('Yuliana Putri',1,'BTN Minasa Upa Blok K No.5, Makassar','Luar Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-16','2026-01-18',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-16','2026-01-18'),

('Sitti Nurfadillah',1,'Dusun Mattirobaji, Desa Mattirotasi, Kec. Maros Baru','Dalam Kabupaten Maros','Offline',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-18','2026-01-18'),

('Mardiyanti',1,'Jl. Nipa-Nipa, Kel. Pettuadae, Kec. Turikale, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-01-20','2026-01-21',NULL,'2026-01-23','2026-01-25',NULL,NULL,NULL,'2026-01-20','2026-01-25'),

('Rezky Amaliah Putri',1,'Dusun Bonto, Desa Bontoa, Kec. Mandai, Kab. Maros','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22','2026-01-22'),

('Nurhikmah',1,'Jl. Maccopa Raya, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',18,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-01-25',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-25','2026-01-25'),

('Fitriani Harun',1,'Jl. Hasanuddin No.22, Kec. Turikale, Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-01-28','2026-01-29',NULL,'2026-01-30',NULL,NULL,NULL,NULL,'2026-01-28','2026-01-30'),

-- Staff Frontliner Shift Malam --

('Andi Syahrul',1,'Dusun Ratte, Desa Cenrana Baru, Kec. Cenrana, Kab. Maros','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-01-20','2026-01-21',NULL,'2026-01-22',NULL,NULL,NULL,NULL,'2026-01-20','2026-01-22'),

('Muh Rizal Saputra',1,'Btn Asoka Permai Blok C No.8, Kec. Lau, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-01-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22','2026-01-22'),

('Herlina Sari',1,'Desa Moncongloe Lappara, Kec. Moncongloe, Maros','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Menikah','Staff Frontliner (Shift Malam)','2026-01-28','2026-01-29',NULL,'2026-02-01',NULL,NULL,NULL,NULL,'2026-01-28','2026-02-01'),

-- Captain Store Bantimurung --

('Zulfitrah Ansar',1,'Jl. Poros Bantimurung, Desa Minasa Baji, Kec. Bantimurung','Dalam Kabupaten Maros','Online',28,'28–32 tahun','Menikah','Captain Store Bantimurung','2026-01-10','2026-01-11','2026-01-14','2026-01-15','2026-01-17',NULL,NULL,NULL,'2026-01-10','2026-01-17'),

('Andi Rezki Islamiyah',1,'Jl. Sukarno Hatta, Kel. Taroada, Kec. Turikale, Maros','Dalam Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Captain Store Bantimurung','2026-01-12','2026-01-14','2026-01-16','2026-01-18','2026-01-20','2026-01-24','2026-01-27','2026-02-03','2026-01-12','2026-02-03'),

-- Staff Produksi (banyak dibutuhkan) --

('Syahrul Ramadhan',1,'Dusun Baliase, Desa Toddolimae, Kec. Bantimurung, Maros','Dalam Kabupaten Maros','Offline',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-01-08','2026-01-09',NULL,'2026-01-10',NULL,NULL,'2026-01-13','2026-01-20','2026-01-08','2026-01-20'),

('Baharuddin',1,'Dusun Parenring, Desa Alatengae, Kec. Bantimurung, Maros','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Produksi','2026-01-08','2026-01-09',NULL,'2026-01-10',NULL,NULL,'2026-01-13','2026-01-20','2026-01-08','2026-01-20'),

('Irfan Maulana',1,'Desa Bontomatene, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Offline',21,'18–22 tahun','Belum Menikah','Staff Produksi','2026-01-10','2026-01-11',NULL,'2026-01-13',NULL,NULL,NULL,NULL,'2026-01-10','2026-01-13'),

('Hasrul',1,'Dusun Bonto, Desa Nisombalia, Kec. Marusu, Maros','Dalam Kabupaten Maros','Offline',30,'28–32 tahun','Menikah','Staff Produksi','2026-01-15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15','2026-01-15'),

('Mustafa',1,'Desa Tallumae, Kec. Simbang, Kab. Maros','Dalam Kabupaten Maros','Offline',27,'23–27 tahun','Menikah','Staff Produksi','2026-01-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-18','2026-01-18'),

('Akbar Tanjung',1,'Jl. Raya Poros Maros No. 7, Kec. Turikale','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Produksi','2026-01-20','2026-01-21',NULL,'2026-01-22',NULL,NULL,NULL,NULL,'2026-01-20','2026-01-22'),

-- Design Graphic --

('Nursucianti',2,'Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',19,'18–22 tahun','Belum Menikah','Design Graphic','2026-01-20','2026-01-21','2026-01-23','2026-01-25',NULL,NULL,NULL,NULL,'2026-01-20','2026-01-25'),

('Andi Fitria Sari',1,'Jl. Dr. Wahidin No.3, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Design Graphic','2026-01-22','2026-01-23',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-22','2026-01-23'),

('Muh Fadli Hidayat',1,'Perumahan Griya Asri, Blok D5, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Design Graphic','2026-02-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-01','2026-02-01'),

-- Content Creator --

('Putri Rahayu Ningsih',1,'Jl. Veteran Selatan, Kel. Mamajang, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Content Creator','2026-01-25','2026-01-26',NULL,'2026-01-28',NULL,NULL,NULL,NULL,'2026-01-25','2026-01-28'),

('Dimas Eka Pratama',1,'Jl. AP Pettarani, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Content Creator','2026-01-27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-27','2026-01-27'),

-- Office Boy --

('Dg. Tompo',1,'Jl. Urip Sumoharjo No.21, Makassar','Luar Kabupaten Maros','Offline',22,'18–22 tahun','Belum Menikah','Office Boy','2026-02-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-22','2026-02-22'),

('Muh. Nawir',1,'Desa Bontoa, Kec. Mandai, Kab. Maros','Dalam Kabupaten Maros','Offline',30,'28–32 tahun','Menikah','Office Boy','2026-02-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-22','2026-02-22'),

-- Driver --

('Ruslan Dg. Nai',1,'Desa Hasanuddin, Kec. Mandai, Kab. Maros','Dalam Kabupaten Maros','Offline',35,'33–37 tahun','Menikah','Driver','2026-01-18','2026-01-19',NULL,'2026-01-21',NULL,NULL,NULL,NULL,'2026-01-18','2026-01-21'),

('Muh. Nasrullah',1,'Jl. Baji Minasa, Kec. Turikale, Maros','Dalam Kabupaten Maros','Offline',29,'28–32 tahun','Menikah','Driver','2026-01-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-20','2026-01-20'),

-- Staff HRD --

('Intan Permata',1,'Desa Cenrana, Kec. Cenrana, Kab. Maros','Dalam Kabupaten Maros','Online',29,'28–32 tahun','Belum Menikah','Staff Frontliner','2026-02-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-22','2026-02-22'),

('Nurfadilah Amir',1,'Jl. Garuda No.15, Maros Kota','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff HRD','2026-01-17','2026-01-18',NULL,'2026-01-20',NULL,NULL,NULL,NULL,'2026-01-17','2026-01-20'),

('Risma Wulandari',1,'Btn Pao-Pao Permai Blok G7, Gowa','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff HRD','2026-01-20','2026-01-21',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-20','2026-01-21'),

-- Staff Accounting --

('Nurhayati Basri',1,'Jl. Landak Baru, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Staff Accounting','2026-01-22','2026-01-23','2026-01-25','2026-01-27',NULL,NULL,NULL,NULL,'2026-01-22','2026-01-27'),

('Andi Syarifah Nabila',1,'Jl. Poros Maros Raya, Kel. Taroada, Maros','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Accounting','2026-01-25','2026-01-26',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-25','2026-01-26'),

-- Social Media Specialist --

('Almira Tsabitah',1,'Jl. Hertasning Baru, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-02-01','2026-02-03',NULL,'2026-02-05',NULL,NULL,NULL,NULL,'2026-02-01','2026-02-05'),

('Nurul Azizah Ramli',1,'Perumahan Griya Mandiri Maros, Blok B2','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-02-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-05','2026-02-05')

ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- CANDIDATE SKILLS — Profil skill kandidat yang sudah screening
-- Hanya diisi untuk kandidat yang sudah minimal tahap Screening CV
-- ID recruitment disesuaikan dengan urutan INSERT di atas
-- ═══════════════════════════════════════════════════════════

-- CATATAN: Gunakan subquery untuk dapat id berdasarkan nama & posisi
-- agar tidak tergantung urutan BIGSERIAL

INSERT INTO candidate_skills (recruitment_id, pendidikan, jurusan, pengalaman_thn, pengalaman_desc, skills, catatan_hr, cv_url)
SELECT r.id,
       vals.pendidikan, vals.jurusan, vals.pengalaman_thn, vals.pengalaman_desc,
       vals.skills::JSONB, vals.catatan_hr, vals.cv_url
FROM recruitment r
JOIN (VALUES

  -- Nurul Fajriah — Staff Frontliner (sdh join)
  ('Nurul Fajriah', 'Staff Frontliner', 'SMA', 'IPS', 0,
   'Pernah magang di minimarket lokal selama 3 bulan.',
   '[{"skill":"Komunikasi","level":7},{"skill":"Pelayanan Pelanggan","level":7},{"skill":"Kasir / POS System","level":6}]',
   'Penampilan rapi, komunikatif, cepat belajar. Lolos semua tahap. Recommended.', NULL),

  -- Andi Reski Ramadhani — Staff Frontliner (sdh interview HR, belum ttd)
  ('Andi Reski Ramadhani', 'Staff Frontliner', 'SMA', 'IPA', 0,
   'Fresh graduate, tidak ada pengalaman kerja sebelumnya.',
   '[{"skill":"Komunikasi","level":6},{"skill":"Pelayanan Pelanggan","level":6},{"skill":"Kasir / POS System","level":4}]',
   'Antusias, mau belajar. Belum ada pengalaman kasir tapi attitude bagus.', NULL),

  -- Yuliana Putri — Staff Frontliner (sdh screening, belum lanjut)
  ('Yuliana Putri', 'Staff Frontliner', 'SMA', 'IPS', 1,
   'Pernah kerja 1 tahun sebagai SPG di toko fashion Makassar.',
   '[{"skill":"Komunikasi","level":7},{"skill":"Pelayanan Pelanggan","level":8},{"skill":"Kasir / POS System","level":5}]',
   'Pengalaman SPG bagus tapi domisili Makassar, perlu konfirmasi kesediaan pindah.', NULL),

  -- Mardiyanti — Staff Frontliner (sdh sampai Interview User)
  ('Mardiyanti', 'Staff Frontliner', 'SMK', 'Tata Niaga', 2,
   'Pernah kerja sebagai kasir di Alfamart Maros 2 tahun.',
   '[{"skill":"Komunikasi","level":8},{"skill":"Pelayanan Pelanggan","level":8},{"skill":"Kasir / POS System","level":8},{"skill":"Manajemen Keluhan","level":6}]',
   'Sangat potensial. Pengalaman kasir kuat, bisa langsung produktif. Tunggu keputusan Interview User.', NULL),

  -- Fitriani Harun — Staff Frontliner (sdh interview HR)
  ('Fitriani Harun', 'Staff Frontliner', 'SMA', 'IPS', 0,
   'Baru lulus SMA, belum pernah kerja.',
   '[{"skill":"Komunikasi","level":6},{"skill":"Pelayanan Pelanggan","level":5},{"skill":"Kasir / POS System","level":3}]',
   'Masih perlu banyak training. Attitude ramah, cocok untuk frontliner dengan mentoring.', NULL),

  -- Andi Syahrul — Shift Malam (sdh Interview HR)
  ('Andi Syahrul', 'Staff Frontliner (Shift Malam)', 'SMA', 'IPS', 1,
   'Pernah kerja sebagai penjaga toko malam di warung sembako 1 tahun.',
   '[{"skill":"Komunikasi","level":6},{"skill":"Ketahanan Fisik","level":8},{"skill":"Pelayanan Pelanggan","level":6}]',
   'Sudah terbiasa kerja malam. Fisik kuat, tidak ada masalah dengan shift malam.', NULL),

  -- Herlina Sari — Shift Malam (sdh Interview HR)
  ('Herlina Sari', 'Staff Frontliner (Shift Malam)', 'SMA', 'IPS', 2,
   'Pernah kerja shift malam di SPBU selama 2 tahun di Maros.',
   '[{"skill":"Komunikasi","level":7},{"skill":"Ketahanan Fisik","level":8},{"skill":"Pelayanan Pelanggan","level":7}]',
   'Sudah biasa kerja shift malam. Sudah menikah, suami mendukung. Sangat direkomendasikan.', NULL),

  -- Zulfitrah Ansar — Captain Store Bantimurung (sdh Interview User, blm training)
  ('Zulfitrah Ansar', 'Captain Store Bantimurung', 'SMA', 'IPS', 3,
   'Captain Frontliner di toko sembako di Bantimurung selama 3 tahun. Pernah handle tim 4 orang.',
   '[{"skill":"Leadership","level":7},{"skill":"Manajemen Stok","level":7},{"skill":"Pelayanan Pelanggan","level":8},{"skill":"Pengelolaan Kasir","level":7}]',
   'Kandidat kuat. Sudah kenal area Bantimurung. Perlu dilakukan penilaian leadership lebih dalam.', NULL),

  -- Andi Rezki Islamiyah — Captain Store Bantimurung (sdh join!)
  ('Andi Rezki Islamiyah', 'Captain Store Bantimurung', 'SMK', 'Tata Niaga', 2,
   'Supervisor toko di minimarket lokal Maros selama 2 tahun. Terbiasa buat laporan harian.',
   '[{"skill":"Leadership","level":8},{"skill":"Manajemen Stok","level":8},{"skill":"Pelayanan Pelanggan","level":9},{"skill":"Pengelolaan Kasir","level":8},{"skill":"Pelaporan Operasional","level":7}]',
   'Sangat kompeten. Lolos semua tahap dengan nilai tertinggi. Sudah bergabung Feb 2026.', NULL),

  -- Syahrul Ramadhan — Staff Produksi (sdh join)
  ('Syahrul Ramadhan', 'Staff Produksi', 'SMA', 'IPA', 0,
   'Baru lulus, belum pernah kerja di produksi.',
   '[{"skill":"Ketelitian","level":7},{"skill":"Fisik Prima","level":8},{"skill":"Kerja Tim","level":7}]',
   'Muda, fisik prima, cepat belajar. Cocok untuk lini produksi.', NULL),

  -- Baharuddin — Staff Produksi (sdh join)
  ('Baharuddin', 'Staff Produksi', 'SMA', 'IPS', 1,
   'Pernah kerja di usaha produksi makanan rumahan selama 1 tahun.',
   '[{"skill":"Ketelitian","level":7},{"skill":"Fisik Prima","level":8},{"skill":"Kerja Tim","level":8}]',
   'Sudah ada sedikit pengalaman di produksi makanan. Sudah bergabung.', NULL),

  -- Irfan Maulana — Staff Produksi (sdh Interview HR)
  ('Irfan Maulana', 'Staff Produksi', 'SMA', 'IPS', 0,
   'Baru lulus, pernah bantu usaha keluarga di bidang produksi.',
   '[{"skill":"Ketelitian","level":6},{"skill":"Fisik Prima","level":7},{"skill":"Kerja Tim","level":7}]',
   'Tidak ada pengalaman formal tapi antusias. Perlu training standar.', NULL),

  -- Akbar Tanjung — Staff Produksi (sdh Interview HR)
  ('Akbar Tanjung', 'Staff Produksi', 'SMK', 'Teknik Mesin', 1,
   'Magang di pabrik las Makassar 6 bulan, lalu kerja serabutan 1 tahun.',
   '[{"skill":"Ketelitian","level":7},{"skill":"Fisik Prima","level":8},{"skill":"Kerja Tim","level":7}]',
   'Latar belakang teknik, cocok jika ada penggunaan mesin produksi. Dipertimbangkan.', NULL),

  -- Nursucianti percobaan ke-2 — Design Graphic (sdh Interview HR)
  ('Nursucianti', 'Design Graphic', 'SMA', 'IPS', 1,
   'Belajar desain otodidak sejak SMA. Pernah bantu desain poster event lokal.',
   '[{"skill":"Adobe Photoshop","level":6},{"skill":"Canva","level":8},{"skill":"Konten Sosial Media","level":7},{"skill":"Adobe Illustrator","level":4}]',
   'Sudah ada peningkatan skill dari percobaan pertama. Portfolio konten media sosial cukup baik.', NULL),

  -- Andi Fitria Sari — Design Graphic (sdh screening)
  ('Andi Fitria Sari', 'Design Graphic', 'D3', 'Desain Komunikasi Visual', 2,
   '2 tahun sebagai freelance graphic designer di Maros dan Makassar.',
   '[{"skill":"Adobe Photoshop","level":8},{"skill":"Adobe Illustrator","level":8},{"skill":"Canva","level":9},{"skill":"Konten Sosial Media","level":8}]',
   'Portfolio sangat kuat. Kandidat terbaik untuk posisi ini sejauh ini.', NULL),

  -- Putri Rahayu Ningsih — Content Creator (sdh Interview HR)
  ('Putri Rahayu Ningsih', 'Content Creator', 'S1', 'Ilmu Komunikasi', 2,
   '2 tahun kelola konten TikTok dan Instagram brand lokal Makassar (1200+ followers).',
   '[{"skill":"Videografi","level":7},{"skill":"Video Editing","level":7},{"skill":"Copywriting","level":8},{"skill":"Instagram / TikTok","level":9}]',
   'Punya sense konten yang bagus untuk UMKM lokal. Kandidat kuat. Nunggu Interview User.', NULL),

  -- Ruslan Dg. Nai — Driver (sdh Interview HR)
  ('Ruslan Dg. Nai', 'Driver', 'SMA', 'IPS', 8,
   '8 tahun sebagai driver angkutan barang Maros–Makassar. SIM A aktif, punya SIM B.',
   '[{"skill":"Mengemudi","level":9},{"skill":"Navigasi Daerah Maros","level":10},{"skill":"Tanggung Jawab","level":8}]',
   'Sangat hafal rute Maros. Rekam jejak baik, tidak pernah kecelakaan. Sangat direkomendasikan.', NULL),

  -- Nurfadilah Amir — Staff HRD (sdh Interview HR)
  ('Nurfadilah Amir', 'Staff HRD', 'S1', 'Manajemen', 1,
   'Magang HRD di salah satu pabrik Maros selama 6 bulan setelah lulus.',
   '[{"skill":"Rekrutmen","level":6},{"skill":"Administrasi HR","level":7},{"skill":"Microsoft Excel","level":7},{"skill":"Komunikasi","level":7}]',
   'Dasar HR cukup bagus dari magang. Perlu pembimbingan lebih lanjut tapi potensial.', NULL),

  -- Nurhayati Basri — Staff Accounting (sdh Interview HR)
  ('Nurhayati Basri', 'Staff Accounting', 'D3', 'Akuntansi', 2,
   'Staff keuangan di koperasi Makassar 2 tahun. Biasa buat laporan bulanan dan rekap kas.',
   '[{"skill":"Akuntansi Dasar","level":8},{"skill":"Microsoft Excel","level":8},{"skill":"Laporan Keuangan","level":8},{"skill":"Ketelitian","level":9}]',
   'Pengalaman accounting solid untuk level D3. Sangat direkomendasikan untuk staff accounting.', NULL),

  -- Almira Tsabitah — Social Media Specialist (sdh Interview HR)
  ('Almira Tsabitah', 'Social Media Specialist', 'S1', 'Ilmu Komunikasi', 2,
   'Digital marketing freelance 2 tahun, pernah handle akun brand kuliner lokal Makassar.',
   '[{"skill":"Instagram Marketing","level":8},{"skill":"Facebook Ads","level":7},{"skill":"Analitik Media Sosial","level":8},{"skill":"Copywriting","level":8}]',
   'Sangat cocok untuk posisi ini. Tahu cara grow akun brand lokal. Tunggu keputusan final.', NULL)

) AS vals(nama, posisi, pendidikan, jurusan, pengalaman_thn, pengalaman_desc, skills, catatan_hr, cv_url)
  ON r.nama = vals.nama AND r.posisi = vals.posisi
ON CONFLICT (recruitment_id) DO NOTHING;
