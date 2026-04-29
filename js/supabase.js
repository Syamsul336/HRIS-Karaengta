// ═══════════════════════════════════════════════════════════
// SUPABASE CLIENT + DATA LAYER
// ═══════════════════════════════════════════════════════════
// CATATAN: file ini diimport sebagai ES module oleh dashboard.html.
// SUPABASE_URL dan SUPABASE_ANON_KEY dibaca dari window.* yang
// di-set oleh js/config.js (script biasa yang harus di-load DULUAN
// sebelum module ini, lewat <script src="./js/config.js"></script>).
// ═══════════════════════════════════════════════════════════
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL      = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY ||
    SUPABASE_URL.includes('YOUR-PROJECT-REF') ||
    SUPABASE_ANON_KEY === 'YOUR-ANON-KEY-HERE') {
  alert('⚠️ Konfigurasi Supabase belum diisi.\n\nBuka js/config.js dan ganti SUPABASE_URL & SUPABASE_ANON_KEY dengan kredensial dari Supabase Dashboard (Project Settings → API).');
  throw new Error('Supabase config missing or still placeholder');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════════
// AUTH GUARD — dipanggil di awal dashboard
// ═══════════════════════════════════════════════════════════
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = './login.html';
    return null;
  }
  // Cek apakah user aktif
  const { data: hrUser, error } = await supabase
    .from('hr_users').select('*').eq('id', session.user.id).single();

  if (error || !hrUser || !hrUser.is_active) {
    await supabase.auth.signOut();
    window.location.href = './login.html';
    return null;
  }
  return { session, hrUser };
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = './login.html';
}

// ═══════════════════════════════════════════════════════════
// HELPER — konversi DATE dari Supabase (yyyy-mm-dd) ke dd/mm/yyyy
// ═══════════════════════════════════════════════════════════
export function isoToDmy(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function dmyToIso(dmy) {
  if (!dmy) return null;
  const [d, m, y] = dmy.split('/');
  return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
}

// ═══════════════════════════════════════════════════════════
// DATA LOADERS — ganti const empData = [...] di file lama
// ═══════════════════════════════════════════════════════════
export async function loadEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('employee_id');
  if (error) throw error;
  return data;
}

export async function loadRecruitment() {
  const { data, error } = await supabase
    .from('recruitment')
    .select('*')
    .order('applied', { ascending: false });
  if (error) throw error;
  // Konversi field DATE jadi dd/mm/yyyy untuk kompatibilitas dengan kode lama
  return data.map(r => ({
    ...r,
    create_date:    isoToDmy(r.create_date),
    update_date:    isoToDmy(r.update_date),
    applied:        isoToDmy(r.applied),
    screening_cv:   isoToDmy(r.screening_cv),
    tes_tertulis:   isoToDmy(r.tes_tertulis),
    interview_hr:   isoToDmy(r.interview_hr),
    interview_user: isoToDmy(r.interview_user),
    training:       isoToDmy(r.training),
    ttd_kontrak:    isoToDmy(r.ttd_kontrak),
    join:           isoToDmy(r.join_date)   // alias utk kompatibilitas kode lama
  }));
}

export async function loadAttendance() {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('full_name');
  if (error) throw error;
  return data;
}

export async function loadSP() {
  const { data, error } = await supabase
    .from('employee_sp')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════
// CRUD — EMPLOYEES
// ═══════════════════════════════════════════════════════════
export async function createEmployee(payload) {
  const { data, error } = await supabase.from('employees').insert(payload).select().single();
  if (error) throw error;
  return data;
}
export async function updateEmployee(employee_id, payload) {
  const { data, error } = await supabase.from('employees')
    .update(payload).eq('employee_id', employee_id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteEmployee(employee_id) {
  const { error } = await supabase.from('employees').delete().eq('employee_id', employee_id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — RECRUITMENT
// ═══════════════════════════════════════════════════════════
export async function createRecruitment(payload) {
  // Konversi tanggal dd/mm/yyyy → ISO sebelum insert
  const ISO_FIELDS = ['create_date','update_date','applied','screening_cv','tes_tertulis',
                      'interview_hr','interview_user','training','ttd_kontrak','join_date'];
  const clean = { ...payload };
  ISO_FIELDS.forEach(f => {
    if (clean[f] && clean[f].includes('/')) clean[f] = dmyToIso(clean[f]);
  });
  const { data, error } = await supabase.from('recruitment').insert(clean).select().single();
  if (error) throw error;
  return data;
}
export async function updateRecruitment(id, payload) {
  const { data, error } = await supabase.from('recruitment')
    .update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteRecruitment(id) {
  const { error } = await supabase.from('recruitment').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — ATTENDANCE
// ═══════════════════════════════════════════════════════════
export async function upsertAttendance(payload) {
  const { data, error } = await supabase.from('attendance')
    .upsert(payload, { onConflict: 'employee_id,bulan' }).select().single();
  if (error) throw error;
  return data;
}
export async function deleteAttendance(id) {
  const { error } = await supabase.from('attendance').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — EMPLOYEE_SP
// ═══════════════════════════════════════════════════════════
export async function createSP(payload) {
  const { data, error } = await supabase.from('employee_sp').insert(payload).select().single();
  if (error) throw error;
  return data;
}
export async function deleteSP(id) {
  const { error } = await supabase.from('employee_sp').delete().eq('id', id);
  if (error) throw error;
}
