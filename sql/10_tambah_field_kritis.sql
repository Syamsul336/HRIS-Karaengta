-- ═══════════════════════════════════════════════════════════
-- KARAENGTA HRIS — Tambah Field Kritis v3.1
-- File: 10_tambah_field_kritis.sql
--
-- Jalankan di Supabase → SQL Editor SETELAH:
--   01_schema.sql ✓
--   02_seed.sql ✓
--   03_rls_policies.sql ✓
--   04_new_features.sql ✓
--   05_features_v3.sql ✓
--   fix_constraint.sql ✓
--   import_data.sql ✓
--   import_rekrutmen.sql ✓
--   06_seed_ats_posisi.sql ✓
--   07_seed_500_kandidat.sql ✓
--   08_seed_excel_dan_skills.sql ✓
--   09_seed_lengkapi_skills.sql ✓
--
-- AMAN dijalankan berulang (semua pakai IF NOT EXISTS / IF EXISTS)
-- ═══════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════
-- 1. FIX CONSTRAINT employment_status
--    (sama dengan fix_constraint.sql — aman dijalankan ulang)
-- ══════════════════════════════════════════════════════════
ALTER TABLE employees
  DROP CONSTRAINT IF EXISTS employees_employment_status_check;

ALTER TABLE employees
  ADD CONSTRAINT employees_employment_status_check
  CHECK (employment_status IN ('Contract','Probation','Permanent','Resigned','Training'));


-- ══════════════════════════════════════════════════════════
-- 2. TAMBAH FIELD KE TABEL EMPLOYEES
--    (field yang belum ada di 01_schema.sql)
-- ══════════════════════════════════════════════════════════
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS no_telepon           TEXT,
  ADD COLUMN IF NOT EXISTS email                TEXT,
  ADD COLUMN IF NOT EXISTS nik                  TEXT,
  ADD COLUMN IF NOT EXISTS no_bpjs_kes          TEXT,
  ADD COLUMN IF NOT EXISTS no_bpjs_tk           TEXT,
  ADD COLUMN IF NOT EXISTS nama_bank            TEXT,
  ADD COLUMN IF NOT EXISTS no_rekening          TEXT,
  ADD COLUMN IF NOT EXISTS atas_nama_rek        TEXT,
  ADD COLUMN IF NOT EXISTS tgl_lahir            DATE,
  ADD COLUMN IF NOT EXISTS tempat_lahir         TEXT,
  ADD COLUMN IF NOT EXISTS alamat               TEXT,
  ADD COLUMN IF NOT EXISTS pendidikan           TEXT,
  ADD COLUMN IF NOT EXISTS jurusan              TEXT,
  ADD COLUMN IF NOT EXISTS kontak_darurat_nama  TEXT,
  ADD COLUMN IF NOT EXISTS kontak_darurat_hp    TEXT,
  ADD COLUMN IF NOT EXISTS kontak_darurat_hub   TEXT,
  ADD COLUMN IF NOT EXISTS gaji_pokok           INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tunjangan_makan      INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tunjangan_transport  INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tunjangan_tetap_lain INT DEFAULT 0;

-- Constraint pendidikan (boleh NULL — tidak semua karyawan sudah diisi)
ALTER TABLE employees
  DROP CONSTRAINT IF EXISTS employees_pendidikan_check;
ALTER TABLE employees
  ADD CONSTRAINT employees_pendidikan_check
  CHECK (pendidikan IS NULL OR pendidikan IN ('SD','SMP','SMA/SMK','D3','S1','S2','S3'));


-- ══════════════════════════════════════════════════════════
-- 3. TAMBAH FIELD KE TABEL RECRUITMENT (kandidat)
--    (field yang belum ada di 01_schema.sql)
-- ══════════════════════════════════════════════════════════
ALTER TABLE recruitment
  ADD COLUMN IF NOT EXISTS no_telepon      TEXT,
  ADD COLUMN IF NOT EXISTS email           TEXT,
  ADD COLUMN IF NOT EXISTS gender          TEXT,
  ADD COLUMN IF NOT EXISTS sumber_lamaran  TEXT,
  ADD COLUMN IF NOT EXISTS skor_tes        INT,
  ADD COLUMN IF NOT EXISTS interviewer     TEXT,
  ADD COLUMN IF NOT EXISTS alasan_penolakan TEXT;

-- Constraint gender recruitment (boleh NULL untuk data lama)
ALTER TABLE recruitment
  DROP CONSTRAINT IF EXISTS recruitment_gender_check;
ALTER TABLE recruitment
  ADD CONSTRAINT recruitment_gender_check
  CHECK (gender IS NULL OR gender IN ('Laki-laki','Perempuan'));

-- Constraint sumber lamaran
ALTER TABLE recruitment
  DROP CONSTRAINT IF EXISTS recruitment_sumber_check;
ALTER TABLE recruitment
  ADD CONSTRAINT recruitment_sumber_check
  CHECK (sumber_lamaran IS NULL OR sumber_lamaran IN (
    'LinkedIn','JobStreet','Glints','Kalibrr','Indeed','Karir.com',
    'Referral Karyawan','Walk-in','Instagram','Poster/Spanduk','Lainnya'
  ));


-- ══════════════════════════════════════════════════════════
-- 4. TAMBAH FIELD KE TABEL PAYROLL
--    (payroll sudah ada di 04_new_features.sql dengan kolom dasar)
--    Tambah: THR, bonus, PPh21, lembur
-- ══════════════════════════════════════════════════════════
ALTER TABLE payroll
  ADD COLUMN IF NOT EXISTS thr             INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus           INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pph21           INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lembur_jam      NUMERIC(6,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lembur_nominal  INT DEFAULT 0;


-- ══════════════════════════════════════════════════════════
-- 5. TABEL BARU: OVERTIME (Lembur)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS overtime (
  id              BIGSERIAL PRIMARY KEY,
  employee_id     TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  full_name       TEXT,
  tanggal         DATE NOT NULL,
  jam_mulai       TIME,
  jam_selesai     TIME,
  tarif_per_jam   INT DEFAULT 0,
  jenis           TEXT DEFAULT 'Biasa'
                  CHECK (jenis IN ('Biasa','Hari Libur','Hari Raya')),
  keterangan      TEXT,
  status          TEXT DEFAULT 'Pending'
                  CHECK (status IN ('Pending','Disetujui','Ditolak')),
  disetujui_oleh  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_overtime_emp ON overtime(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_tgl ON overtime(tanggal);


-- ══════════════════════════════════════════════════════════
-- 6. TABEL BARU: TRAINING (Pengembangan SDM)
--    Catatan: kolom 'training' di tabel recruitment adalah DATE (tanggal stage),
--    berbeda dengan tabel ini yang mencatat riwayat pelatihan karyawan.
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS training_program (
  id              BIGSERIAL PRIMARY KEY,
  employee_id     TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  nama_karyawan   TEXT,
  nama_training   TEXT NOT NULL,
  jenis           TEXT DEFAULT 'Internal'
                  CHECK (jenis IN ('Internal','Eksternal','Online','Sertifikasi')),
  penyelenggara   TEXT,
  tgl_mulai       DATE,
  tgl_selesai     DATE,
  biaya           INT DEFAULT 0,
  nilai_akhir     INT CHECK (nilai_akhir IS NULL OR (nilai_akhir >= 0 AND nilai_akhir <= 100)),
  status          TEXT DEFAULT 'Direncanakan'
                  CHECK (status IN ('Direncanakan','Berlangsung','Selesai','Batal')),
  sertifikat_url  TEXT,
  keterangan      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_training_emp ON training_program(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_tgl ON training_program(tgl_mulai);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_ts_training ON training_program;
CREATE TRIGGER set_ts_training
  BEFORE UPDATE ON training_program
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- ══════════════════════════════════════════════════════════
-- 7. TABEL BARU: HR_CALENDAR (Kalender libur & event)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS hr_calendar (
  id          BIGSERIAL PRIMARY KEY,
  tanggal     DATE NOT NULL,
  judul       TEXT NOT NULL,
  jenis       TEXT DEFAULT 'Event HR'
              CHECK (jenis IN ('Libur Nasional','Libur Perusahaan','Event HR','Reminder','Deadline')),
  keterangan  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hrcal_tgl ON hr_calendar(tanggal);

-- Isi libur nasional 2026 (aman jika dijalankan ulang — pakai WHERE NOT EXISTS)
INSERT INTO hr_calendar (tanggal, judul, jenis) VALUES
  ('2026-01-01', 'Tahun Baru Masehi 2026',              'Libur Nasional'),
  ('2026-01-27', 'Isra Mikraj Nabi Muhammad SAW',        'Libur Nasional'),
  ('2026-02-17', 'Tahun Baru Imlek 2577',                'Libur Nasional'),
  ('2026-03-20', 'Hari Raya Idul Fitri 1447 H',          'Libur Nasional'),
  ('2026-03-21', 'Hari Raya Idul Fitri 1447 H Hari ke-2','Libur Nasional'),
  ('2026-03-28', 'Wafat Isa Al-Masih',                   'Libur Nasional'),
  ('2026-04-14', 'Hari Raya Nyepi Tahun Baru Saka 1948', 'Libur Nasional'),
  ('2026-05-01', 'Hari Buruh Internasional',              'Libur Nasional'),
  ('2026-05-14', 'Kenaikan Isa Al-Masih',                'Libur Nasional'),
  ('2026-05-25', 'Hari Raya Waisak 2570 BE',             'Libur Nasional'),
  ('2026-06-01', 'Hari Lahir Pancasila',                 'Libur Nasional'),
  ('2026-06-05', 'Hari Raya Idul Adha 1447 H',           'Libur Nasional'),
  ('2026-06-26', 'Tahun Baru Islam 1448 H',              'Libur Nasional'),
  ('2026-08-17', 'Hari Kemerdekaan Republik Indonesia',  'Libur Nasional'),
  ('2026-09-04', 'Maulid Nabi Muhammad SAW 1448 H',      'Libur Nasional'),
  ('2026-12-25', 'Hari Raya Natal',                      'Libur Nasional'),
  ('2026-12-26', 'Cuti Bersama Natal',                   'Libur Nasional')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════
-- 8. RLS UNTUK TABEL BARU
-- ══════════════════════════════════════════════════════════
ALTER TABLE overtime         ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_calendar      ENABLE ROW LEVEL SECURITY;

-- Overtime
DROP POLICY IF EXISTS "r_overtime" ON overtime;
DROP POLICY IF EXISTS "i_overtime" ON overtime;
DROP POLICY IF EXISTS "u_overtime" ON overtime;
DROP POLICY IF EXISTS "d_overtime" ON overtime;
CREATE POLICY "r_overtime" ON overtime FOR SELECT USING (is_active_hr_user());
CREATE POLICY "i_overtime" ON overtime FOR INSERT WITH CHECK (can_write());
CREATE POLICY "u_overtime" ON overtime FOR UPDATE USING (can_write());
CREATE POLICY "d_overtime" ON overtime FOR DELETE USING (can_write());

-- Training
DROP POLICY IF EXISTS "r_training" ON training_program;
DROP POLICY IF EXISTS "i_training" ON training_program;
DROP POLICY IF EXISTS "u_training" ON training_program;
DROP POLICY IF EXISTS "d_training" ON training_program;
CREATE POLICY "r_training" ON training_program FOR SELECT USING (is_active_hr_user());
CREATE POLICY "i_training" ON training_program FOR INSERT WITH CHECK (can_write());
CREATE POLICY "u_training" ON training_program FOR UPDATE USING (can_write());
CREATE POLICY "d_training" ON training_program FOR DELETE USING (can_write());

-- HR Calendar (semua active user bisa lihat, hanya writer yang bisa ubah)
DROP POLICY IF EXISTS "r_hrcal" ON hr_calendar;
DROP POLICY IF EXISTS "i_hrcal" ON hr_calendar;
DROP POLICY IF EXISTS "u_hrcal" ON hr_calendar;
DROP POLICY IF EXISTS "d_hrcal" ON hr_calendar;
CREATE POLICY "r_hrcal" ON hr_calendar FOR SELECT USING (is_active_hr_user());
CREATE POLICY "i_hrcal" ON hr_calendar FOR INSERT WITH CHECK (can_write());
CREATE POLICY "u_hrcal" ON hr_calendar FOR UPDATE USING (can_write());
CREATE POLICY "d_hrcal" ON hr_calendar FOR DELETE USING (can_write());


-- ══════════════════════════════════════════════════════════
-- 9. INDEX TAMBAHAN
-- ══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_emp_nik          ON employees(nik);
CREATE INDEX IF NOT EXISTS idx_emp_no_telepon   ON employees(no_telepon);
CREATE INDEX IF NOT EXISTS idx_rec_sumber       ON recruitment(sumber_lamaran);
CREATE INDEX IF NOT EXISTS idx_rec_gender       ON recruitment(gender);


-- ══════════════════════════════════════════════════════════
-- VERIFIKASI — jalankan query ini untuk cek hasilnya:
-- ══════════════════════════════════════════════════════════
/*
SELECT
  'employees kolom baru' as check_item,
  count(*) as total_kolom
FROM information_schema.columns
WHERE table_name = 'employees'
  AND column_name IN ('no_telepon','email','nik','no_bpjs_kes',
    'nama_bank','no_rekening','gaji_pokok','tgl_lahir','alamat',
    'pendidikan','kontak_darurat_nama')

UNION ALL SELECT 'overtime rows', count(*) FROM overtime
UNION ALL SELECT 'training_program rows', count(*) FROM training_program
UNION ALL SELECT 'hr_calendar rows', count(*) FROM hr_calendar;
*/
