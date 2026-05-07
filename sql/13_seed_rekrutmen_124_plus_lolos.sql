-- ═══════════════════════════════════════════════════════════════
-- SQL #13 — Tambah 124 kandidat rekrutmen baru + 6 kandidat lolos
-- Posisi berdasarkan job openings yang ada di sistem
-- ═══════════════════════════════════════════════════════════════
-- Jalankan di Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

INSERT INTO recruitment (
  nama, no_percobaan, alamat_domisili, lokasi, pengumpulan_berkas,
  umur, interval_usia, status, posisi,
  applied, screening_cv, tes_tertulis, interview_hr, interview_user,
  training, ttd_kontrak, join_date, create_date, update_date
) VALUES

-- ── Staff Frontliner (40 kandidat) ──────────────────────────
('Nurhayati Basri',1,'Jl. Maros-Makassar No.12, Kel. Pettuadae','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-01','2026-04-02',NULL,'2026-04-04',NULL,NULL,NULL,NULL,'2026-04-01','2026-04-04'),
('Rahmawati Baso',1,'Desa Borikamase, Kec. Simbang, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-01','2026-04-03',NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01','2026-04-03'),
('Fitri Wahyuni',1,'Jl. Pettarani No.88, Makassar','Luar Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-02','2026-04-04',NULL,'2026-04-06','2026-04-08',NULL,NULL,NULL,'2026-04-02','2026-04-08'),
('Suriani Lestari',1,'BTN Antang Blok C5, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-02','2026-04-02'),
('Musdalifah Kadir',1,'Desa Mattiro Deceng, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Offline',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-03','2026-04-04','2026-04-05','2026-04-07',NULL,NULL,NULL,NULL,'2026-04-03','2026-04-07'),
('Andi Fitriani',2,'Jl. Cendrawasih No.5, Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Menikah','Staff Frontliner','2026-04-03','2026-04-05',NULL,'2026-04-08',NULL,NULL,NULL,NULL,'2026-04-03','2026-04-08'),
('Nurfadhilah Rahman',1,'Dusun Padaelo, Desa Bonto Tallasa, Kec. Mandai','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-04','2026-04-04'),
('Riskawati Amir',1,'Perum. Griya Mas Blok B2, Kec. Turikale, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-04','2026-04-06',NULL,'2026-04-09','2026-04-11',NULL,NULL,NULL,'2026-04-04','2026-04-11'),
('Hasnah Jaya',1,'Desa Bontomanai, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Offline',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-05','2026-04-07',NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-05','2026-04-07'),
('Riani Putri Dewi',1,'Jl. Sultan Alauddin No.44, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-05','2026-04-07','2026-04-08','2026-04-10',NULL,NULL,NULL,NULL,'2026-04-05','2026-04-10'),
('Siti Aminah Azis',1,'Dusun Paccerakang, Desa Baji Pa''mai, Kec. Lau','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-06','2026-04-06'),
('Fikriyah Mursalim',1,'Jl. Pelita Raya No.7, Kel. Adatongeng, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-07','2026-04-08',NULL,'2026-04-10',NULL,NULL,NULL,NULL,'2026-04-07','2026-04-10'),
('Sukmawati Halim',1,'Desa Toddolimae, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-07','2026-04-07'),
('Ariani Ridwan',1,'BTN Griya Maros Permai Blok D, Maros','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-08','2026-04-09','2026-04-10','2026-04-12','2026-04-14',NULL,NULL,NULL,'2026-04-08','2026-04-14'),
('Nurjannah Saputri',1,'Desa Minasa Baji, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-08','2026-04-08'),
('Wahyuni Kaharuddin',1,'Jl. Maccopa No.3, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-09','2026-04-10',NULL,'2026-04-12',NULL,NULL,NULL,NULL,'2026-04-09','2026-04-12'),
('Multazam Putri',1,'Dusun Ratte Barani, Desa Cenrana, Kec. Cenrana','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-10','2026-04-10'),
('Nurfauziah Hamid',1,'Jl. H. M. Dg. Patompo No.9, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-10','2026-04-11',NULL,'2026-04-13',NULL,NULL,NULL,NULL,'2026-04-10','2026-04-13'),
('Roslina Dg. Ngiji',1,'Desa Sambueja, Kec. Simbang, Kab. Maros','Dalam Kabupaten Maros','Offline',28,'28–32 tahun','Menikah','Staff Frontliner','2026-04-11','2026-04-12','2026-04-13','2026-04-15',NULL,NULL,NULL,NULL,'2026-04-11','2026-04-15'),
('Hikmah Wulandari',1,'Perumahan Puri Maros Mas Blok A, Maros','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12','2026-04-12'),
('Sri Wahyuni Dg. Basse',1,'Dusun Pabbekkang, Desa Temmapadduae, Kec. Marusu','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-13','2026-04-14',NULL,'2026-04-16',NULL,NULL,NULL,NULL,'2026-04-13','2026-04-16'),
('Kartini Mansyur',1,'Jl. Urip Sumoharjo No.67, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-14','2026-04-14'),
('Ruqayyah Arsyad',1,'Desa Majannang, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-14','2026-04-15','2026-04-16','2026-04-18','2026-04-20',NULL,NULL,NULL,'2026-04-14','2026-04-20'),
('Salmiah Dg. Taco',1,'Dusun Limampoccoe, Desa Bentenge, Kec. Mandai','Dalam Kabupaten Maros','Offline',25,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-15','2026-04-16',NULL,'2026-04-18',NULL,NULL,NULL,NULL,'2026-04-15','2026-04-18'),
('Nuraeni Sawal',1,'Jl. Pemuda No.22, Kel. Pettuadae, Maros','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-16',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-16','2026-04-16'),
('Jumriati Dg. Tarring',1,'Desa Bontotangnga, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',29,'28–32 tahun','Menikah','Staff Frontliner','2026-04-17','2026-04-18',NULL,'2026-04-20',NULL,NULL,NULL,NULL,'2026-04-17','2026-04-20'),
('Rahma Dwi Astuti',1,'BTN Antang Permai, Makassar','Luar Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-18','2026-04-18'),
('Sitti Rahmah Tahir',1,'Desa Tukamasea, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-19','2026-04-20','2026-04-21','2026-04-23',NULL,NULL,NULL,NULL,'2026-04-19','2026-04-23'),
('Kurnia Tri Utami',1,'Jl. Sunu No.14, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-20','2026-04-20'),
('Sitti Bau',1,'Dusun Leang-Leang, Desa Samanggi, Kec. Simbang','Dalam Kabupaten Maros','Offline',27,'23–27 tahun','Menikah','Staff Frontliner','2026-04-21','2026-04-22',NULL,'2026-04-24',NULL,NULL,NULL,NULL,'2026-04-21','2026-04-24'),
('Jumriati Latif',1,'Desa Paccellekang, Kec. Patallassang, Gowa','Luar Kabupaten Maros','Online',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22','2026-04-22'),
('Aminah Dg. Rate',1,'Jl. Alauddin No.101, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-23','2026-04-24',NULL,'2026-04-26',NULL,NULL,NULL,NULL,'2026-04-23','2026-04-26'),
('Siti Khodijah Umar',1,'Desa Temmapadduae, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-24',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24','2026-04-24'),
('Wahidah Syamsuddin',1,'Jl. Kenanga No.5, Kel. Taroada, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-25','2026-04-26','2026-04-27','2026-04-29','2026-05-01',NULL,NULL,NULL,'2026-04-25','2026-05-01'),
('Andi Nurasman',1,'Desa Minasa Baji, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-26','2026-04-26'),
('Risna Dg. Ngona',1,'Dusun Pao, Desa Salenrang, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-27','2026-04-28',NULL,'2026-04-30',NULL,NULL,NULL,NULL,'2026-04-27','2026-04-30'),
('Hartati Muin',1,'Jl. Toddopuli Raya No.22, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-04-28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-28','2026-04-28'),
('Hasna Palallo',1,'Desa Borimasunggu, Kec. Lau, Kab. Maros','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-29','2026-04-30',NULL,'2026-05-02',NULL,NULL,NULL,NULL,'2026-04-29','2026-05-02'),
('Jumrana Dg. Caya',1,'Dusun Mattoangin, Desa Bontomatene, Kec. Simbang','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-04-30',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-30','2026-04-30'),
('Nur Aliya Syahrir',1,'Jl. Abd. Dg. Sirua No.14, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-05-01','2026-05-02',NULL,'2026-05-04',NULL,NULL,NULL,NULL,'2026-05-01','2026-05-04'),

-- ── Staff Frontliner Shift Malam (20 kandidat) ──────────────
('Riski Firmansyah',1,'Jl. Kesatuan No.3, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-01','2026-04-02',NULL,'2026-04-04',NULL,NULL,NULL,NULL,'2026-04-01','2026-04-04'),
('Ahmad Taufik',1,'Desa Mattiro Deceng, Kec. Bontoa','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-02','2026-04-02'),
('Muh. Fadli Akbar',1,'Dusun Minasa Upa, Desa Bontoa, Kec. Mandai','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-03','2026-04-04','2026-04-05','2026-04-07','2026-04-09',NULL,NULL,NULL,'2026-04-03','2026-04-09'),
('Ilham Saputra',1,'Jl. Maros Baru No.18, Maros','Dalam Kabupaten Maros','Offline',23,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-04','2026-04-04'),
('Deni Kurniawan',1,'BTN Bumi Sudiang, Makassar','Luar Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-05','2026-04-06',NULL,'2026-04-08',NULL,NULL,NULL,NULL,'2026-04-05','2026-04-08'),
('Haidir Hamzah',1,'Desa Bontotangnga, Kec. Bantimurung','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-07','2026-04-07'),
('Syahril Arafah',1,'Jl. Gagak No.7, Kel. Turikale, Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-09','2026-04-10','2026-04-11','2026-04-13',NULL,NULL,NULL,NULL,'2026-04-09','2026-04-13'),
('Zulkifli Dg. Naba',1,'Dusun Pabbekkang, Desa Temmapadduae, Kec. Marusu','Dalam Kabupaten Maros','Offline',28,'28–32 tahun','Menikah','Staff Frontliner (Shift Malam)','2026-04-11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-11','2026-04-11'),
('Mustakim Hamsir',1,'Desa Salenrang, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-13','2026-04-14',NULL,'2026-04-16',NULL,NULL,NULL,NULL,'2026-04-13','2026-04-16'),
('Faisal Rahman',1,'Jl. Andi Tonro No.11, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-15','2026-04-15'),
('Reza Maulana',1,'Perumahan Taman Maros Blok F, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-17','2026-04-18','2026-04-19','2026-04-21','2026-04-23',NULL,NULL,NULL,'2026-04-17','2026-04-23'),
('Muh. Arfan Saputra',1,'Dusun Batayya, Desa Bentenge, Kec. Mandai','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-19','2026-04-19'),
('Amiruddin Lewa',2,'Jl. Sungai Saddang No.3, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Menikah','Staff Frontliner (Shift Malam)','2026-04-21','2026-04-22',NULL,'2026-04-24',NULL,NULL,NULL,NULL,'2026-04-21','2026-04-24'),
('Bahar Dg. Tika',1,'Desa Bontomanai, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-23',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-23','2026-04-23'),
('Rachmat Hidayat',1,'Dusun Barakkang, Desa Baji Pa''mai, Kec. Lau','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-25','2026-04-26',NULL,'2026-04-28',NULL,NULL,NULL,NULL,'2026-04-25','2026-04-28'),
('Sufriadi Hamid',1,'Jl. Bontonompo No.4, Kel. Taroada, Maros','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-27',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-27','2026-04-27'),
('Rahmat Illahi',1,'Desa Tukamasea, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-04-29','2026-04-30','2026-05-01','2026-05-03',NULL,NULL,NULL,NULL,'2026-04-29','2026-05-03'),
('Herdiansyah Dg. Ngerang',1,'Dusun Pao, Desa Salenrang, Kec. Bontoa','Dalam Kabupaten Maros','Offline',26,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-01','2026-05-01'),
('Lukmanul Hakim',1,'Jl. Bung No.15, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-02','2026-05-03',NULL,'2026-05-05',NULL,NULL,NULL,NULL,'2026-05-02','2026-05-05'),
('Andi Agus Salim',1,'Desa Borikamase, Kec. Simbang, Kab. Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04','2026-05-04'),

-- ── Staff Produksi (20 kandidat) ──────────────────────────
('Marwah Syamsuddin',1,'Desa Bontotangnga, Kec. Bantimurung','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-01','2026-04-02',NULL,'2026-04-04',NULL,NULL,NULL,NULL,'2026-04-01','2026-04-04'),
('Nursyamsi Kadir',1,'Jl. Maccopa No.7, Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-02','2026-04-02'),
('Irma Yuliani',1,'BTN Minasa Upa, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-04','2026-04-05','2026-04-06','2026-04-08',NULL,NULL,NULL,NULL,'2026-04-04','2026-04-08'),
('Rahmatia Haris',1,'Dusun Paccerakang, Desa Baji Pa''mai, Kec. Lau','Dalam Kabupaten Maros','Offline',23,'23–27 tahun','Menikah','Staff Produksi','2026-04-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-06','2026-04-06'),
('Khadijah Dg. Ngona',1,'Desa Salenrang, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Online',27,'23–27 tahun','Menikah','Staff Produksi','2026-04-08','2026-04-09',NULL,'2026-04-11',NULL,NULL,NULL,NULL,'2026-04-08','2026-04-11'),
('Suryani Abidin',1,'Jl. Abd. Dg. Sirua No.8, Makassar','Luar Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-10','2026-04-10'),
('Ratna Dewi Sanjaya',1,'Desa Bontomanai, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-12','2026-04-13','2026-04-14','2026-04-16','2026-04-18',NULL,NULL,NULL,'2026-04-12','2026-04-18'),
('Sitti Hasna Wati',1,'Dusun Ratte Barani, Desa Cenrana','Dalam Kabupaten Maros','Offline',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-14','2026-04-14'),
('Marlina Yusuf',1,'Jl. Sungai Saddang Baru No.4, Makassar','Luar Kabupaten Maros','Online',28,'28–32 tahun','Menikah','Staff Produksi','2026-04-16','2026-04-17',NULL,'2026-04-19',NULL,NULL,NULL,NULL,'2026-04-16','2026-04-19'),
('Indah Permata Sari',1,'Desa Mattiro Deceng, Kec. Bontoa','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-18','2026-04-18'),
('Nur Fitri Amin',1,'Perumahan Griya Maros Mas, Maros','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-20','2026-04-21','2026-04-22','2026-04-24',NULL,NULL,NULL,NULL,'2026-04-20','2026-04-24'),
('Risna Idris',1,'Dusun Pabbekkang, Desa Temmapadduae, Kec. Marusu','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Produksi','2026-04-22',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-22','2026-04-22'),
('Hamdana Sari',1,'Jl. Tentara Pelajar No.3, Makassar','Luar Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-24','2026-04-25',NULL,'2026-04-27',NULL,NULL,NULL,NULL,'2026-04-24','2026-04-27'),
('Wahyuni Ruslan',1,'Desa Borikamase, Kec. Simbang, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-26','2026-04-26'),
('Sitti Marwah',1,'Jl. Nipa-Nipa No.12, Kel. Pettuadae, Maros','Dalam Kabupaten Maros','Online',29,'28–32 tahun','Menikah','Staff Produksi','2026-04-28','2026-04-29','2026-04-30','2026-05-02','2026-05-04',NULL,NULL,NULL,'2026-04-28','2026-05-04'),
('Astuti Dg. Kebo',1,'Dusun Mattoangin, Desa Bontomatene, Kec. Simbang','Dalam Kabupaten Maros','Offline',21,'18–22 tahun','Belum Menikah','Staff Produksi','2026-04-30',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-30','2026-04-30'),
('Nurfadilah Sabir',1,'Desa Bontotangnga, Kec. Bantimurung','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Produksi','2026-05-01','2026-05-02',NULL,'2026-05-04',NULL,NULL,NULL,NULL,'2026-05-01','2026-05-04'),
('Hartina Jufri',1,'Jl. Abd. Dg. Sirua No.33, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Produksi','2026-05-02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-02','2026-05-02'),
('Rahmi Wahyuningsih',1,'Desa Borimasunggu, Kec. Lau, Kab. Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Produksi','2026-05-03','2026-05-04',NULL,'2026-05-06',NULL,NULL,NULL,NULL,'2026-05-03','2026-05-06'),
('Magfirah Rasyid',1,'Dusun Limampoccoe, Desa Bentenge, Kec. Mandai','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-05-04',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-04','2026-05-04'),

-- ── Content Creator & Social Media (10 kandidat) ─────────────
('Andi Nurul Magfira',1,'Jl. Boulevard No.22, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Content Creator','2026-04-01','2026-04-03','2026-04-04','2026-04-07','2026-04-09',NULL,NULL,NULL,'2026-04-01','2026-04-09'),
('Sitti Nur Intan',1,'BTN Kodam, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Content Creator','2026-04-05','2026-04-07',NULL,'2026-04-10',NULL,NULL,NULL,NULL,'2026-04-05','2026-04-10'),
('Anisa Rahmasari',1,'Jl. Mallombassang No.4, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Content Creator','2026-04-10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-10','2026-04-10'),
('Dinda Amelia Putri',1,'Jl. AP. Pettarani No.55, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Content Creator','2026-04-15','2026-04-17','2026-04-18','2026-04-21','2026-04-23',NULL,NULL,NULL,'2026-04-15','2026-04-23'),
('Nabilah Syahrir',1,'Perumahan Tamalanrea, Makassar','Luar Kabupaten Maros','Online',21,'18–22 tahun','Belum Menikah','Content Creator','2026-04-20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-20','2026-04-20'),
('Zulkifli Ramlan',1,'Jl. Urip Sumoharjo No.12, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-04-03','2026-04-05','2026-04-06','2026-04-09','2026-04-11',NULL,NULL,NULL,'2026-04-03','2026-04-11'),
('Indra Wahyu Saputra',1,'Jl. Yos Sudarso No.3, Maros','Dalam Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-04-08','2026-04-10',NULL,'2026-04-13',NULL,NULL,NULL,NULL,'2026-04-08','2026-04-13'),
('Fira Andini',1,'BTN Citra Garden, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-04-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-14','2026-04-14'),
('Eka Wahyuningsih',1,'Jl. Poros Maros-Makassar No.55, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Social Media Specialist','2026-04-20','2026-04-22','2026-04-23','2026-04-25',NULL,NULL,NULL,NULL,'2026-04-20','2026-04-25'),
('Nurul Arifah Asdar',1,'Desa Bontomanai, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Customer Service (Social Media)','2026-04-25','2026-04-27',NULL,'2026-04-29',NULL,NULL,NULL,NULL,'2026-04-25','2026-04-29'),

-- ── Design Graphic & Staff HRD & Staff Accounting (14 kandidat) ─
('Muh. Reza Pratama',1,'Jl. Toddopuli Raya No.8, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Design Graphic','2026-04-02','2026-04-04','2026-04-05','2026-04-08','2026-04-10',NULL,NULL,NULL,'2026-04-02','2026-04-10'),
('Ahmad Yusuf Hasan',1,'Jl. Sungai Saddang No.14, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Design Graphic','2026-04-07','2026-04-09',NULL,'2026-04-12',NULL,NULL,NULL,NULL,'2026-04-07','2026-04-12'),
('Ferdy Setiawan',1,'BTN Minasa Upa Blok B, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Design Graphic','2026-04-14',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-14','2026-04-14'),
('Anita Suryana',1,'Jl. Kesatuan No.5, Maros','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Design Graphic','2026-04-21','2026-04-23','2026-04-24','2026-04-27',NULL,NULL,NULL,NULL,'2026-04-21','2026-04-27'),
('Rizqa Amalia Rahman',1,'Jl. Urip Sumoharjo No.34, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff HRD','2026-04-03','2026-04-05','2026-04-06','2026-04-09','2026-04-11',NULL,NULL,NULL,'2026-04-03','2026-04-11'),
('Yuliani Natasya',1,'Perum. Griya Maros Permai, Maros','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff HRD','2026-04-10','2026-04-12',NULL,'2026-04-15',NULL,NULL,NULL,NULL,'2026-04-10','2026-04-15'),
('Fahriati Rahma Dewi',1,'Jl. AP. Pettarani No.77, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Staff HRD','2026-04-17',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-17','2026-04-17'),
('Nabila Nur Islami',1,'Jl. Malino No.3, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff HRD','2026-04-25','2026-04-27','2026-04-28','2026-04-30','2026-05-02',NULL,NULL,NULL,'2026-04-25','2026-05-02'),
('Muh. Ikhsan Rivai',1,'Jl. Boulevard No.55, Makassar','Luar Kabupaten Maros','Online',26,'23–27 tahun','Belum Menikah','Staff Accounting','2026-04-04','2026-04-06','2026-04-07','2026-04-10','2026-04-12',NULL,NULL,NULL,'2026-04-04','2026-04-12'),
('Megawati Sinaga',1,'Jl. Poros Maros-Makassar No.34, Maros','Dalam Kabupaten Maros','Online',28,'28–32 tahun','Menikah','Staff Accounting','2026-04-11','2026-04-13',NULL,'2026-04-16',NULL,NULL,NULL,NULL,'2026-04-11','2026-04-16'),
('Rahmad Hidayah',1,'Jl. Perintis Kemerdekaan No.8, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Staff Accounting','2026-04-19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-19','2026-04-19'),
('Surya Dharma',1,'BTN Minasa Upa Blok A, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Accounting','2026-04-26','2026-04-28','2026-04-29','2026-05-01',NULL,NULL,NULL,NULL,'2026-04-26','2026-05-01'),
('Fatimah Azzahra',1,'Jl. Andi Tonro No.22, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Driver','2026-04-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-03','2026-04-03'),
('Hamzah Patunru',1,'Desa Borimasunggu, Kec. Lau, Kab. Maros','Dalam Kabupaten Maros','Online',30,'28–32 tahun','Menikah','Driver','2026-04-10','2026-04-12','2026-04-13','2026-04-15',NULL,NULL,NULL,NULL,'2026-04-10','2026-04-15');

-- ═══════════════════════════════════════════════════════════════
-- 6 KANDIDAT LOLOS SELEKSI PENUH (ttd_kontrak & join_date diisi)
-- Posisi: Staff Frontliner ×2, Staff Produksi, Staff HRD,
--         Content Creator, Staff Frontliner Shift Malam
-- ═══════════════════════════════════════════════════════════════
INSERT INTO recruitment (
  nama, no_percobaan, alamat_domisili, lokasi, pengumpulan_berkas,
  umur, interval_usia, status, posisi,
  applied, screening_cv, tes_tertulis, interview_hr, interview_user,
  training, ttd_kontrak, join_date, create_date, update_date
) VALUES
('Nur Halisa Syahril',1,'Jl. Maros-Makassar No.21, Kel. Pettuadae, Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner',
 '2026-03-15','2026-03-16','2026-03-18','2026-03-20','2026-03-23','2026-03-28','2026-04-01','2026-05-01','2026-03-15','2026-05-01'),

('Ari Irawan Putra',1,'Desa Bontoa, Kec. Mandai, Kab. Maros','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner',
 '2026-03-16','2026-03-17','2026-03-19','2026-03-21','2026-03-24','2026-03-29','2026-04-02','2026-05-01','2026-03-16','2026-05-01'),

('Nurhidayah Mansur',1,'Dusun Minasa Upa, Desa Bontoa, Kec. Mandai, Kab. Maros','Dalam Kabupaten Maros','Offline',26,'23–27 tahun','Belum Menikah','Staff Produksi',
 '2026-03-10','2026-03-11','2026-03-13','2026-03-17','2026-03-20','2026-03-27','2026-03-30','2026-05-01','2026-03-10','2026-05-01'),

('Wahyu Andika Pratama',1,'Jl. Perintis Kemerdekaan KM.12, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)',
 '2026-03-12','2026-03-13','2026-03-15','2026-03-18','2026-03-21','2026-03-28','2026-04-01','2026-05-01','2026-03-12','2026-05-01'),

('Andi Nabila Aulia',1,'Jl. Toddopuli Raya No.44, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Content Creator',
 '2026-03-08','2026-03-10','2026-03-12','2026-03-16','2026-03-19','2026-03-26','2026-03-30','2026-05-01','2026-03-08','2026-05-01'),

('Rizky Arifin',1,'Jl. Urip Sumoharjo No.88, Makassar','Luar Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Staff HRD',
 '2026-03-05','2026-03-06','2026-03-09','2026-03-13','2026-03-17','2026-03-24','2026-03-28','2026-05-01','2026-03-05','2026-05-01');


-- ── Tambahan 20 kandidat untuk melengkapi total 124 baris baru ──
INSERT INTO recruitment (
  nama, no_percobaan, alamat_domisili, lokasi, pengumpulan_berkas,
  umur, interval_usia, status, posisi,
  applied, screening_cv, tes_tertulis, interview_hr, interview_user,
  training, ttd_kontrak, join_date, create_date, update_date
) VALUES
('Nur Salsabila',1,'Dusun Mattoangin, Desa Bontomatene, Kec. Simbang','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-05-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-05','2026-05-05'),
('Astrid Amalia',1,'Jl. Toddopuli No.11, Makassar','Luar Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-05-05','2026-05-06',NULL,'2026-05-07',NULL,NULL,NULL,NULL,'2026-05-05','2026-05-07'),
('Miftahul Jannah',1,'Desa Temmapadduae, Kec. Marusu, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-05-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-06'),
('Nur Rahmah Subair',1,'Jl. Irigasi No.4, Maros','Dalam Kabupaten Maros','Offline',21,'18–22 tahun','Belum Menikah','Staff Frontliner','2026-05-06','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-07'),
('Sitti Halija',1,'Desa Bontomanai, Kec. Marusu','Dalam Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Hardina Usman',1,'BTN Griya Maros Permai, Maros','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Menikah','Staff Frontliner','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Muh. Fauzi Rahim',1,'Jl. Bontonompo No.2, Kel. Taroada, Maros','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-05','2026-05-05'),
('Ibnu Hajar',1,'Dusun Ratte Barani, Desa Cenrana, Kec. Cenrana','Dalam Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-06','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-07'),
('Muh. Ridwan Idris',1,'Jl. Sunu No.33, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Andi Wira Kusuma',1,'Desa Borimasunggu, Kec. Lau, Kab. Maros','Dalam Kabupaten Maros','Online',27,'23–27 tahun','Belum Menikah','Staff Frontliner (Shift Malam)','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Putri Rahayu',1,'Desa Salenrang, Kec. Bontoa, Kab. Maros','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Produksi','2026-05-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-05','2026-05-05'),
('Fajriyanti Amir',1,'Jl. Poros Maros-Makassar No.78, Maros','Dalam Kabupaten Maros','Offline',24,'23–27 tahun','Belum Menikah','Staff Produksi','2026-05-06','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-07'),
('Sitti Hadijah Alwi',1,'Dusun Pao, Desa Salenrang, Kec. Bontoa','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff Produksi','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Rosmiati Hasan',1,'Dusun Pabbekkang, Desa Temmapadduae','Dalam Kabupaten Maros','Online',26,'23–27 tahun','Menikah','Staff Produksi','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Andini Permatasari',1,'Jl. Andi Tonro No.12, Makassar','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Content Creator','2026-05-05','2026-05-06',NULL,'2026-05-07',NULL,NULL,NULL,NULL,'2026-05-05','2026-05-07'),
('Muh. Farid Karim',1,'Jl. Tentara Pelajar No.8, Makassar','Luar Kabupaten Maros','Online',28,'28–32 tahun','Menikah','Design Graphic','2026-05-05',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-05','2026-05-05'),
('Hariyati Yusuf',1,'BTN Citra Garden Blok C, Makassar','Luar Kabupaten Maros','Online',24,'23–27 tahun','Belum Menikah','Staff Accounting','2026-05-06','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-07'),
('Ahmad Maulana Haris',1,'Jl. Cakalang No.5, Maros','Dalam Kabupaten Maros','Online',29,'28–32 tahun','Menikah','Driver','2026-05-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-06','2026-05-06'),
('Ratnasari Dg. Lemba',1,'Desa Minasa Baji, Kec. Bantimurung, Kab. Maros','Dalam Kabupaten Maros','Offline',21,'18–22 tahun','Belum Menikah','Customer Service (Social Media)','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07'),
('Hasriani Taufik',1,'Dusun Ratte, Desa Cenrana Baru, Kec. Cenrana','Dalam Kabupaten Maros','Online',23,'23–27 tahun','Belum Menikah','Staff HRD','2026-05-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07','2026-05-07');
