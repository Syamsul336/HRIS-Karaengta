-- Fix constraint employment_status agar menerima nilai 'Training'
-- Jalankan ini di Supabase SQL Editor SEBELUM import data

ALTER TABLE employees
  DROP CONSTRAINT IF EXISTS employees_employment_status_check;

ALTER TABLE employees
  ADD CONSTRAINT employees_employment_status_check
  CHECK (employment_status IN ('Contract', 'Probation', 'Permanent', 'Resigned', 'Training'));
