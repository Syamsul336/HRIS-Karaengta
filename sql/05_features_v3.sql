-- ═══════════════════════════════════════════════════════════
-- KARAENGTA HRIS — Schema v3.0 (Fitur #6–#13)
-- Jalankan di Supabase SQL Editor SETELAH 04_new_features.sql
-- ═══════════════════════════════════════════════════════════

-- #6 RIWAYAT KARYAWAN (Mutasi / Promosi)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS employee_history (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  tgl_perubahan  DATE NOT NULL DEFAULT CURRENT_DATE,
  jenis          TEXT CHECK (jenis IN ('Mutasi','Promosi','Demosi','Status','Kontrak','Lainnya')) DEFAULT 'Lainnya',
  jabatan_lama   TEXT,
  jabatan_baru   TEXT,
  dept_lama      TEXT,
  dept_baru      TEXT,
  status_lama    TEXT,
  status_baru    TEXT,
  keterangan     TEXT,
  dicatat_oleh   TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_history_emp  ON employee_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_history_tgl  ON employee_history(tgl_perubahan);

-- #7 REKAP CUTI TAHUNAN
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS cuti_saldo (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  tahun          INT NOT NULL,
  jatah          INT DEFAULT 12,            -- hari cuti pertahun
  terpakai       INT DEFAULT 0,
  sisa           INT GENERATED ALWAYS AS (jatah - terpakai) STORED,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, tahun)
);

CREATE TABLE IF NOT EXISTS cuti_pengajuan (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  nama           TEXT,                      -- denormalized
  tgl_mulai      DATE NOT NULL,
  tgl_selesai    DATE NOT NULL,
  jumlah_hari    INT GENERATED ALWAYS AS (CAST(tgl_selesai - tgl_mulai + 1 AS INT)) STORED,
  jenis_cuti     TEXT CHECK (jenis_cuti IN ('Tahunan','Sakit','Melahirkan','Darurat','Lainnya')) DEFAULT 'Tahunan',
  alasan         TEXT,
  status         TEXT CHECK (status IN ('Pending','Disetujui','Ditolak')) DEFAULT 'Pending',
  catatan_hr     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cuti_saldo_emp ON cuti_saldo(employee_id);
CREATE INDEX IF NOT EXISTS idx_cuti_pengajuan_emp ON cuti_pengajuan(employee_id);
CREATE INDEX IF NOT EXISTS idx_cuti_pengajuan_status ON cuti_pengajuan(status);

-- #8 ANALYTICS — view untuk dashboard (tidak perlu tabel baru)
-- Data diambil dari tabel yang sudah ada via query agregasi

-- #9 ABSENSI HARIAN
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendance_daily (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  full_name      TEXT,
  tanggal        DATE NOT NULL,
  status         TEXT CHECK (status IN ('Hadir','Alpha','Sakit','Izin','Cuti','Telat')) DEFAULT 'Hadir',
  jam_masuk      TIME,
  jam_keluar     TIME,
  terlambat_menit INT DEFAULT 0,
  keterangan     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, tanggal)
);
CREATE INDEX IF NOT EXISTS idx_daily_tanggal ON attendance_daily(tanggal);
CREATE INDEX IF NOT EXISTS idx_daily_emp     ON attendance_daily(employee_id);

-- #10 MANAJEMEN USER HR — sudah ada di hr_users, cukup expose di UI
-- Tabel hr_users sudah ada dari 03_rls_policies.sql

-- #11 DOKUMEN KARYAWAN
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS employee_documents (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  nama_dokumen   TEXT NOT NULL,
  jenis          TEXT CHECK (jenis IN ('KTP','Ijazah','BPJS Kesehatan','BPJS TK','Kontrak','Foto','Sertifikat','Lainnya')) DEFAULT 'Lainnya',
  file_url       TEXT NOT NULL,             -- URL dari Supabase Storage
  file_name      TEXT,
  file_size      INT,                       -- bytes
  keterangan     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_docs_emp ON employee_documents(employee_id);

-- #12 OFFBOARDING CHECKLIST
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS offboarding (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  nama           TEXT,
  tgl_resign     DATE,
  tgl_terakhir   DATE,
  -- checklist boolean
  serah_laptop        BOOLEAN DEFAULT FALSE,
  serah_id_card       BOOLEAN DEFAULT FALSE,
  serah_seragam       BOOLEAN DEFAULT FALSE,
  serah_kunci         BOOLEAN DEFAULT FALSE,
  cabut_akses_sistem  BOOLEAN DEFAULT FALSE,
  cabut_akses_email   BOOLEAN DEFAULT FALSE,
  exit_interview      BOOLEAN DEFAULT FALSE,
  urus_bpjs           BOOLEAN DEFAULT FALSE,
  urus_surat_referensi BOOLEAN DEFAULT FALSE,
  -- catatan
  catatan        TEXT,
  status         TEXT CHECK (status IN ('Proses','Selesai')) DEFAULT 'Proses',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id)
);
CREATE INDEX IF NOT EXISTS idx_offboard_emp ON offboarding(employee_id);

-- #13 PENILAIAN KINERJA (KPI)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS kpi_penilaian (
  id             BIGSERIAL PRIMARY KEY,
  employee_id    TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  nama           TEXT,
  periode        TEXT NOT NULL,             -- "Q1 2026" / "Jan 2026"
  tipe           TEXT CHECK (tipe IN ('Bulanan','Kuartalan','Tahunan')) DEFAULT 'Bulanan',
  -- skor per aspek (1–100)
  skor_kualitas       INT CHECK (skor_kualitas BETWEEN 0 AND 100),
  skor_kuantitas      INT CHECK (skor_kuantitas BETWEEN 0 AND 100),
  skor_kehadiran      INT CHECK (skor_kehadiran BETWEEN 0 AND 100),
  skor_sikap          INT CHECK (skor_sikap BETWEEN 0 AND 100),
  skor_inisiatif      INT CHECK (skor_inisiatif BETWEEN 0 AND 100),
  -- rata-rata otomatis
  skor_total     INT GENERATED ALWAYS AS (
    (COALESCE(skor_kualitas,0) + COALESCE(skor_kuantitas,0) +
     COALESCE(skor_kehadiran,0) + COALESCE(skor_sikap,0) +
     COALESCE(skor_inisiatif,0)) / 5
  ) STORED,
  predikat       TEXT,                      -- A/B/C/D dihitung di frontend
  catatan        TEXT,
  penilai        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, periode, tipe)
);
CREATE INDEX IF NOT EXISTS idx_kpi_emp     ON kpi_penilaian(employee_id);
CREATE INDEX IF NOT EXISTS idx_kpi_periode ON kpi_penilaian(periode);

-- ═══════════════════════════════════════════════════════════
-- AUTO-UPDATE updated_at untuk tabel baru
-- ═══════════════════════════════════════════════════════════
DO $$ BEGIN
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $t$
  BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
  $t$ LANGUAGE plpgsql;
EXCEPTION WHEN duplicate_function THEN NULL; END $$;

DROP TRIGGER IF EXISTS set_ts_cuti_saldo      ON cuti_saldo;
CREATE TRIGGER set_ts_cuti_saldo      BEFORE UPDATE ON cuti_saldo      FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
DROP TRIGGER IF EXISTS set_ts_cuti_pengajuan  ON cuti_pengajuan;
CREATE TRIGGER set_ts_cuti_pengajuan  BEFORE UPDATE ON cuti_pengajuan  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
DROP TRIGGER IF EXISTS set_ts_offboarding     ON offboarding;
CREATE TRIGGER set_ts_offboarding     BEFORE UPDATE ON offboarding     FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
DROP TRIGGER IF EXISTS set_ts_kpi             ON kpi_penilaian;
CREATE TRIGGER set_ts_kpi             BEFORE UPDATE ON kpi_penilaian   FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ═══════════════════════════════════════════════════════════
-- RLS untuk semua tabel baru
-- ═══════════════════════════════════════════════════════════
ALTER TABLE employee_history    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuti_saldo          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuti_pengajuan      ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_daily    ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE offboarding         ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_penilaian       ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE t TEXT; BEGIN
  FOREACH t IN ARRAY ARRAY['employee_history','cuti_saldo','cuti_pengajuan',
    'attendance_daily','employee_documents','offboarding','kpi_penilaian'] LOOP
    EXECUTE format('CREATE POLICY "r_%s" ON %I FOR SELECT USING (is_active_hr_user())', t, t);
    EXECUTE format('CREATE POLICY "i_%s" ON %I FOR INSERT WITH CHECK (can_write())', t, t);
    EXECUTE format('CREATE POLICY "u_%s" ON %I FOR UPDATE USING (can_write())', t, t);
    EXECUTE format('CREATE POLICY "d_%s" ON %I FOR DELETE USING (can_write())', t, t);
  END LOOP;
END $$;
