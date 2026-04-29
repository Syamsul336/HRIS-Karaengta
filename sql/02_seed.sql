-- ═══════════════════════════════════════════════════════════
-- SEED DATA — Karaengta HRIS
-- Jalankan SETELAH 01_schema.sql berhasil dijalankan
-- ═══════════════════════════════════════════════════════════

-- ── EMPLOYEES ──────────────────────────────────────────────
INSERT INTO employees (employee_id, name, organization_name, position, branch, gender, status, employment_status, join_date, end_date, date_resign, bulan) VALUES
('KUG001','Reski Amalia','HRD','Manager HRD','Management','Perempuan','Aktif','Contract','2025-01-25','2026-01-25',NULL,'Oktober (2025)'),
('KUG002','Muh Aswar Habir, A.Md,Sn','Marketing','Manager Marketing','Management','Laki-laki','Resign','Resigned','2024-01-25','2025-12-31','2025-10-01','Oktober (2025)'),
('KUG003','Nur Aisyah','Operasional','Supervisor Produksi','Management','Perempuan','Aktif','Contract','2025-08-04','2025-11-03',NULL,'Oktober (2025)'),
('KUG004','Nur Jumiarti','Operasional','Supervisor Store','Management','Perempuan','Aktif','Contract','2025-02-01','2026-04-27',NULL,'Oktober (2025)'),
('KUG005','Nur Haliah','Operasional','Supervisor Store','Management','Perempuan','Resign','Resigned','2025-08-01','2025-10-30','2025-10-04','Oktober (2025)'),
('KUG006','Zainul Muttakin','Operasional','Supervisor Store','Management','Laki-laki','Aktif','Contract','2025-08-01','2025-10-30',NULL,'Oktober (2025)'),
('KUG007','Rima Ulandari','Operasional','Supervisor Supply and Chain','Management','Perempuan','Aktif','Probation','2025-08-01','2025-10-30',NULL,'Oktober (2025)'),
('KUG008','Nike Ratnadilla','Finance','Staff Finance','Management','Perempuan','Aktif','Contract','2025-01-25','2026-01-25',NULL,'Oktober (2025)'),
('KUG009','Nadia Putri Meilani','Marketing','Customer Service Online','Management','Perempuan','Aktif','Contract','2025-05-24','2026-03-25',NULL,'Oktober (2025)'),
('KUG010','Adhel Abdiani','Operasional','Admin Operasional','Management','Perempuan','Aktif','Probation','2025-08-14','2025-11-25',NULL,'Oktober (2025)'),
('KUG011','Rini Juliyanti Muhlis','Marketing','Customer Service Online','Management','Perempuan','Aktif','Contract','2025-09-08','2025-10-25',NULL,'Oktober (2025)'),
('KUG012','Alfira Abidin','Operasional','Staff Purchasing','Management','Perempuan','Aktif','Probation','2025-08-04','2025-10-03',NULL,'Oktober (2025)'),
('KUG013','Nur Aminah','Operasional','Staff Quality Control','Management','Perempuan','Aktif','Probation','2025-08-01','2025-10-30',NULL,'Oktober (2025)'),
('KUG014','Nurhadiya Tari','Operasional','Captain Store','Tambua','Perempuan','Resign','Resigned','2025-07-21','2025-10-25','2025-10-19','Oktober (2025)')
ON CONFLICT (employee_id) DO NOTHING;


-- ── RECRUITMENT ────────────────────────────────────────────
INSERT INTO recruitment (nama, no_percobaan, alamat_domisili, lokasi, pengumpulan_berkas, umur, interval_usia, status, posisi, applied, screening_cv, tes_tertulis, interview_hr, interview_user, training, ttd_kontrak, join_date, create_date, update_date) VALUES
('Dita Widiastuti',1,'Perumahan Griya Abitah, Kel. Pai, Kec. Biringkanaya Kota Makassar','Luar Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff HRD','2025-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-01','2025-10-01'),
('mulyadi',1,'Kendari','Luar Kabupaten Maros','Online',25,'23–27 tahun','Belum Menikah','Staff HRD','2025-10-01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-01','2025-10-01'),
('Rasmawati',1,'Kalokko, Desa Marannu, Kecamatan Lau, Kab. Maros','Dalam Kabupaten Maros','Offline',32,'28–32 tahun','Cerai','Staff Frontliner','2025-10-01','2025-10-01',NULL,'2025-10-02',NULL,NULL,'2025-10-03','2025-10-03','2025-10-01','2025-10-03'),
('Andi Atiqullah Naufal',1,'Jl.Bamburuncing No.48 Kec.Turikale, Kel.Pattuadae','Dalam Kabupaten Maros','Online',18,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-03',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-03','2025-10-03'),
('Sitti Rahmatia',1,'Pangkep','Luar Kabupaten Maros','Online',18,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-06','2025-10-06'),
('Nursucianti',1,'Bantimurung','Dalam Kabupaten Maros','Online',18,'18–22 tahun','Belum Menikah','Design Graphic','2025-10-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-07','2025-10-07'),
('Nur Aliya',1,'Batunapara','Dalam Kabupaten Maros','Online',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-07','2025-11-06',NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-07','2025-11-06'),
('Hikma Fitriah',1,'Dusun Baramamase, Desa Alatengae','Dalam Kabupaten Maros','Online',22,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-07','2025-11-03',NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-07','2025-11-03'),
('Hariana Syarifuddin',1,'Jln Poros Bantimurung, Mannuruki','Dalam Kabupaten Maros','Online',19,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-08','2025-10-21',NULL,'2025-10-22',NULL,NULL,'2025-10-28','2025-11-03','2025-10-08','2025-11-03'),
('Fifi Rindiyanti',1,'Btn Griya Maros Indah E10 No1','Dalam Kabupaten Maros','Online',20,'18–22 tahun','Belum Menikah','Staff Frontliner','2025-10-08','2025-10-08',NULL,'2025-10-08',NULL,NULL,'2025-10-10','2025-10-15','2025-10-08','2025-10-15');


-- ── ATTENDANCE ─────────────────────────────────────────────
INSERT INTO attendance (employee_id, full_name, branch, bulan, total_hadir, terlambat, cuti, sakit, izin, alpha) VALUES
('KUG001','Reski Amalia','Karaengta','Okt (2025)',31,0,0,0,0,0),
('KUG003','Nur Aisyah','Karaengta','Okt (2025)',31,0,0,0,0,0),
('KUG004','Nur Jumiarti','Karaengta','Okt (2025)',24,3,1,0,0,0),
('KUG006','Zainul Muttakin','Karaengta','Okt (2025)',31,0,0,0,0,0),
('KUG007','Rima Ulandari','Karaengta','Okt (2025)',31,0,0,0,0,0),
('KUG008','Nike Ratnadilla Keke','Karaengta','Okt (2025)',31,0,1,0,0,0),
('KUG009','Nadia Putri Meilani','Karaengta','Okt (2025)',31,0,1,0,0,0),
('KUG010','Adhel Abdiani','Karaengta','Okt (2025)',31,0,0,0,0,0),
('KUG011','Rini Juliyanti Muhlis','Karaengta','Okt (2025)',30,1,0,1,0,0),
('KUG012','Alfira Abidin','Karaengta','Okt (2025)',28,1,0,3,0,0),
('KUG013','Nur Aminah','Karaengta','Okt (2025)',28,0,0,3,0,0),
('KUG014','Nurhadiya Tari','Outlet Tambua','Okt (2025)',13,0,0,4,0,1)
ON CONFLICT (employee_id, bulan) DO NOTHING;


-- ── EMPLOYEE_SP ────────────────────────────────────────────
-- Catatan: KUG015–KUG068 belum ada di tabel employees, insert tanpa FK
-- Kalau mau strict FK, tambahkan dulu employees-nya, atau drop FK constraint
-- Untuk sekarang, insert dengan employee_id NULL untuk yang belum terdaftar
INSERT INTO employee_sp (employee_id, name, bulan, jenis_sp, position, level, gender) VALUES
(NULL,'Asri','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
(NULL,'Sahir','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
(NULL,'Andi Maulana Alviansyah As','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
(NULL,'Rusdi','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
(NULL,'Rahman','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
(NULL,'Syaripuddin','Okt (2025)','SP 1','Staff Produksi','Staff','Laki-laki'),
('KUG004','Nur Jumiarti','Nov (2025)','SP 2','Supervisor Store','Management','Perempuan'),
(NULL,'Andi Maulana Alviansyah As','Nov (2025)','SP 1','Staff Produksi','Staff','Laki-laki');
