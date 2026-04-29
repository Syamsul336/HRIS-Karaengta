-- ═══════════════════════════════════════════════════════════
-- KARAENGTA HRIS — Database Schema for Supabase / PostgreSQL
-- ═══════════════════════════════════════════════════════════
-- Jalankan file ini di Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- 1. TABEL EMPLOYEES (master karyawan)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS employees (
  employee_id        TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  organization_name  TEXT,
  position           TEXT,
  branch             TEXT,
  gender             TEXT CHECK (gender IN ('Laki-laki','Perempuan')),
  status             TEXT CHECK (status IN ('Aktif','Resign','Cuti','Suspend')),
  employment_status  TEXT CHECK (employment_status IN ('Contract','Probation','Permanent','Resigned')),
  join_date          DATE,
  end_date           DATE,
  date_resign        DATE,
  bulan              TEXT,                    -- e.g. "Oktober (2025)"
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_status   ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_org      ON employees(organization_name);
CREATE INDEX IF NOT EXISTS idx_employees_branch   ON employees(branch);


-- 2. TABEL RECRUITMENT (kandidat rekrutmen)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS recruitment (
  id                  BIGSERIAL PRIMARY KEY,
  nama                TEXT NOT NULL,
  no_percobaan        INT  DEFAULT 1,
  alamat_domisili     TEXT,
  lokasi              TEXT CHECK (lokasi IN ('Dalam Kabupaten Maros','Luar Kabupaten Maros')),
  pengumpulan_berkas  TEXT CHECK (pengumpulan_berkas IN ('Online','Offline')),
  umur                INT,
  interval_usia       TEXT,
  status              TEXT,                   -- Belum Menikah / Menikah / Cerai
  posisi              TEXT,
  -- Stage tanggal (DATE — bisa null kalau belum sampai stage itu)
  applied             DATE,
  screening_cv        DATE,
  tes_tertulis        DATE,
  interview_hr        DATE,
  interview_user      DATE,
  training            DATE,
  ttd_kontrak         DATE,
  join_date           DATE,                   -- pakai 'join_date' krn 'join' adalah reserved keyword
  create_date         DATE,
  update_date         DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_posisi    ON recruitment(posisi);
CREATE INDEX IF NOT EXISTS idx_recruitment_lokasi    ON recruitment(lokasi);
CREATE INDEX IF NOT EXISTS idx_recruitment_applied   ON recruitment(applied);


-- 3. TABEL ATTENDANCE (absensi bulanan)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendance (
  id            BIGSERIAL PRIMARY KEY,
  employee_id   TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  full_name     TEXT,                          -- denormalized untuk fallback
  branch        TEXT,
  bulan         TEXT NOT NULL,                 -- e.g. "Okt (2025)"
  total_hadir   INT DEFAULT 0,
  terlambat     INT DEFAULT 0,
  cuti          INT DEFAULT 0,
  sakit         INT DEFAULT 0,
  izin          INT DEFAULT 0,
  alpha         INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, bulan)                   -- 1 employee 1 record per bulan
);

CREATE INDEX IF NOT EXISTS idx_attendance_bulan    ON attendance(bulan);
CREATE INDEX IF NOT EXISTS idx_attendance_emp      ON attendance(employee_id);


-- 4. TABEL EMPLOYEE_SP (Surat Peringatan)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS employee_sp (
  id           BIGSERIAL PRIMARY KEY,
  employee_id  TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  name         TEXT,                           -- denormalized
  bulan        TEXT NOT NULL,
  jenis_sp     TEXT CHECK (jenis_sp IN ('SP 1','SP 2','SP 3')),
  position     TEXT,
  level        TEXT CHECK (level IN ('Staff','Management')),
  gender       TEXT CHECK (gender IN ('Laki-laki','Perempuan')),
  keterangan   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sp_bulan    ON employee_sp(bulan);
CREATE INDEX IF NOT EXISTS idx_sp_emp      ON employee_sp(employee_id);
CREATE INDEX IF NOT EXISTS idx_sp_jenis    ON employee_sp(jenis_sp);


-- 5. AUTO-UPDATE updated_at
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_employees ON employees;
CREATE TRIGGER set_timestamp_employees
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_recruitment ON recruitment;
CREATE TRIGGER set_timestamp_recruitment
  BEFORE UPDATE ON recruitment
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
