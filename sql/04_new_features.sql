-- ═══════════════════════════════════════════════════════════
-- KARAENGTA HRIS — Schema Tambahan v2.0
-- Jalankan di Supabase Dashboard → SQL Editor SETELAH 01_schema.sql
-- ═══════════════════════════════════════════════════════════

-- 1. JOB OPENINGS — posisi yang sedang dibuka
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS job_openings (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,               -- nama posisi
  department      TEXT,
  branch          TEXT,
  headcount       INT DEFAULT 1,               -- jumlah orang dibutuhkan
  gaji_min        INT DEFAULT 0,
  gaji_max        INT DEFAULT 0,
  required_skills JSONB DEFAULT '[]',          -- [{skill, min_level}]
  min_experience  INT DEFAULT 0,               -- tahun pengalaman minimum
  min_education   TEXT,                        -- SMA/D3/S1/S2
  deadline        DATE,
  status          TEXT CHECK (status IN ('open','closed','filled')) DEFAULT 'open',
  keterangan      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_status ON job_openings(status);
CREATE INDEX IF NOT EXISTS idx_job_dept   ON job_openings(department);

-- 2. CANDIDATE SKILLS — skill per kandidat rekrutmen
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS candidate_skills (
  id              BIGSERIAL PRIMARY KEY,
  recruitment_id  BIGINT REFERENCES recruitment(id) ON DELETE CASCADE,
  -- profil lengkap
  pendidikan      TEXT,                        -- SMA/D3/S1/S2
  jurusan         TEXT,
  pengalaman_thn  INT DEFAULT 0,
  pengalaman_desc TEXT,                        -- deskripsi pengalaman
  -- skills (array JSON: [{skill, level 1-10}])
  skills          JSONB DEFAULT '[]',
  -- catatan HR
  catatan_hr      TEXT,
  -- link CV / dokumen
  cv_url          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recruitment_id)
);

CREATE INDEX IF NOT EXISTS idx_cs_recruitment ON candidate_skills(recruitment_id);

-- 3. PAYROLL — data penggajian per karyawan per bulan
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payroll (
  id              BIGSERIAL PRIMARY KEY,
  employee_id     TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  full_name       TEXT,                        -- denormalized
  bulan           TEXT NOT NULL,               -- "Nov (2025)"
  -- Pendapatan
  gaji_pokok      INT DEFAULT 0,
  tunjangan_makan INT DEFAULT 0,
  tunjangan_transport INT DEFAULT 0,
  tunjangan_lain  INT DEFAULT 0,
  -- Potongan
  potongan_bpjs_kes   INT DEFAULT 0,           -- 1% dari gaji pokok
  potongan_bpjs_tk    INT DEFAULT 0,           -- 2% dari gaji pokok
  potongan_alpha      INT DEFAULT 0,           -- dihitung dari data absensi
  potongan_telat      INT DEFAULT 0,
  potongan_lain       INT DEFAULT 0,
  -- Hasil kalkulasi (disimpan agar tidak perlu hitung ulang)
  total_pendapatan    INT GENERATED ALWAYS AS
    (gaji_pokok + tunjangan_makan + tunjangan_transport + tunjangan_lain) STORED,
  total_potongan      INT GENERATED ALWAYS AS
    (potongan_bpjs_kes + potongan_bpjs_tk + potongan_alpha + potongan_telat + potongan_lain) STORED,
  gaji_bersih         INT GENERATED ALWAYS AS
    (gaji_pokok + tunjangan_makan + tunjangan_transport + tunjangan_lain
     - potongan_bpjs_kes - potongan_bpjs_tk - potongan_alpha - potongan_telat - potongan_lain) STORED,
  status          TEXT CHECK (status IN ('draft','final')) DEFAULT 'draft',
  catatan         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, bulan)
);

CREATE INDEX IF NOT EXISTS idx_payroll_bulan ON payroll(bulan);
CREATE INDEX IF NOT EXISTS idx_payroll_emp   ON payroll(employee_id);

-- 4. AUTO-UPDATE updated_at untuk tabel baru
-- ═══════════════════════════════════════════════════════════
DROP TRIGGER IF EXISTS set_timestamp_job_openings ON job_openings;
CREATE TRIGGER set_timestamp_job_openings
  BEFORE UPDATE ON job_openings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_candidate_skills ON candidate_skills;
CREATE TRIGGER set_timestamp_candidate_skills
  BEFORE UPDATE ON candidate_skills
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_payroll ON payroll;
CREATE TRIGGER set_timestamp_payroll
  BEFORE UPDATE ON payroll
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- 5. RLS untuk tabel baru (sama pattern dengan tabel lama)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE job_openings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll          ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active_read_jobs"      ON job_openings     FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_jobs"   ON job_openings     FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_jobs"   ON job_openings     FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_jobs"   ON job_openings     FOR DELETE USING (can_write());

CREATE POLICY "active_read_cs"        ON candidate_skills FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_cs"     ON candidate_skills FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_cs"     ON candidate_skills FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_cs"     ON candidate_skills FOR DELETE USING (can_write());

CREATE POLICY "active_read_payroll"   ON payroll          FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_payroll" ON payroll         FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_payroll" ON payroll         FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_payroll" ON payroll         FOR DELETE USING (can_write());
