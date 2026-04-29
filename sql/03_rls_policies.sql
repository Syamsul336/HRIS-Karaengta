-- ═══════════════════════════════════════════════════════════
-- KARAENGTA HRIS — RLS Policies & Auth Setup
-- Jalankan SETELAH 01_schema.sql dan 02_seed.sql
-- ═══════════════════════════════════════════════════════════

-- 1. TABEL hr_users — mapping auth.users ke role HR
-- ═══════════════════════════════════════════════════════════
-- Supabase sudah punya auth.users (built-in). Kita extend dengan role.
CREATE TABLE IF NOT EXISTS hr_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        TEXT CHECK (role IN ('admin','hr_manager','hr_staff','viewer')) DEFAULT 'viewer',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- 2. AUTO-CREATE hr_users entry saat signup baru
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO hr_users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'viewer',     -- default role: viewer (read-only)
    FALSE         -- default tidak aktif, harus diaktifkan admin manual
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- 3. HELPER FUNCTION — cek apakah user aktif & punya akses
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION is_active_hr_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM hr_users
    WHERE id = auth.uid()
      AND is_active = TRUE
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_write()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM hr_users
    WHERE id = auth.uid()
      AND is_active = TRUE
      AND role IN ('admin','hr_manager','hr_staff')
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;


-- 4. ENABLE RLS pada semua tabel HRIS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE employees    ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment  ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_sp  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_users     ENABLE ROW LEVEL SECURITY;


-- 5. POLICIES — hr_users
-- ═══════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "users_can_read_own"  ON hr_users;
DROP POLICY IF EXISTS "active_users_read"   ON hr_users;

CREATE POLICY "users_can_read_own" ON hr_users
  FOR SELECT USING (auth.uid() = id);

-- Admin bisa lihat semua user
CREATE POLICY "admin_read_all_users" ON hr_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hr_users
      WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
    )
  );


-- 6. POLICIES — employees, recruitment, attendance, employee_sp
-- ═══════════════════════════════════════════════════════════
-- Pattern: SELECT untuk semua user aktif, INSERT/UPDATE/DELETE untuk hr_staff+

-- EMPLOYEES
DROP POLICY IF EXISTS "active_read_employees"   ON employees;
DROP POLICY IF EXISTS "writers_insert_employees" ON employees;
DROP POLICY IF EXISTS "writers_update_employees" ON employees;
DROP POLICY IF EXISTS "writers_delete_employees" ON employees;

CREATE POLICY "active_read_employees"    ON employees FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_employees" ON employees FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_employees" ON employees FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_employees" ON employees FOR DELETE USING (can_write());

-- RECRUITMENT
DROP POLICY IF EXISTS "active_read_recruitment"   ON recruitment;
DROP POLICY IF EXISTS "writers_insert_recruitment" ON recruitment;
DROP POLICY IF EXISTS "writers_update_recruitment" ON recruitment;
DROP POLICY IF EXISTS "writers_delete_recruitment" ON recruitment;

CREATE POLICY "active_read_recruitment"    ON recruitment FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_recruitment" ON recruitment FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_recruitment" ON recruitment FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_recruitment" ON recruitment FOR DELETE USING (can_write());

-- ATTENDANCE
DROP POLICY IF EXISTS "active_read_attendance"   ON attendance;
DROP POLICY IF EXISTS "writers_insert_attendance" ON attendance;
DROP POLICY IF EXISTS "writers_update_attendance" ON attendance;
DROP POLICY IF EXISTS "writers_delete_attendance" ON attendance;

CREATE POLICY "active_read_attendance"    ON attendance FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_attendance" ON attendance FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_attendance" ON attendance FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_attendance" ON attendance FOR DELETE USING (can_write());

-- EMPLOYEE_SP
DROP POLICY IF EXISTS "active_read_sp"   ON employee_sp;
DROP POLICY IF EXISTS "writers_insert_sp" ON employee_sp;
DROP POLICY IF EXISTS "writers_update_sp" ON employee_sp;
DROP POLICY IF EXISTS "writers_delete_sp" ON employee_sp;

CREATE POLICY "active_read_sp"    ON employee_sp FOR SELECT USING (is_active_hr_user());
CREATE POLICY "writers_insert_sp" ON employee_sp FOR INSERT WITH CHECK (can_write());
CREATE POLICY "writers_update_sp" ON employee_sp FOR UPDATE USING (can_write());
CREATE POLICY "writers_delete_sp" ON employee_sp FOR DELETE USING (can_write());


-- ═══════════════════════════════════════════════════════════
-- CARA SETUP USER ADMIN PERTAMA (lakukan setelah signup)
-- ═══════════════════════════════════════════════════════════
-- 1. Daftar lewat halaman login.html (atau Supabase Auth UI)
-- 2. Jalankan query berikut di SQL Editor untuk aktifkan & jadikan admin:
--
-- UPDATE hr_users
-- SET role = 'admin', is_active = TRUE
-- WHERE email = 'email-anda@example.com';
--
-- 3. Setelah itu, login dengan email tsb akan punya akses penuh
