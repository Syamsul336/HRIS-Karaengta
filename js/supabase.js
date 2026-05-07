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
  // Supabase default limit = 1000 baris — pakai pagination loop agar semua data terambil
  const PAGE = 1000;
  let all = [], from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recruitment')
      .select('*')
      .order('applied', { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    all = all.concat(data);
    if (data.length < PAGE) break;   // halaman terakhir
    from += PAGE;
  }
  // Konversi field DATE jadi dd/mm/yyyy untuk kompatibilitas dengan kode lama
  return all.map(r => ({
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
    join:           isoToDmy(r.join_date)
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

// ═══════════════════════════════════════════════════════════
// CRUD — JOB OPENINGS
// ═══════════════════════════════════════════════════════════
export async function loadJobOpenings() {
  const { data, error } = await supabase
    .from('job_openings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
export async function createJobOpening(payload) {
  const { data, error } = await supabase.from('job_openings').insert(payload).select().single();
  if (error) throw error;
  return data;
}
export async function updateJobOpening(id, payload) {
  const { data, error } = await supabase.from('job_openings')
    .update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
export async function deleteJobOpening(id) {
  const { error } = await supabase.from('job_openings').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — CANDIDATE SKILLS
// ═══════════════════════════════════════════════════════════
export async function loadCandidateSkills() {
  const { data, error } = await supabase.from('candidate_skills').select('*');
  if (error) throw error;
  return data;
}
export async function upsertCandidateSkill(payload) {
  const { data, error } = await supabase.from('candidate_skills')
    .upsert(payload, { onConflict: 'recruitment_id' }).select().single();
  if (error) throw error;
  return data;
}
export async function deleteCandidateSkill(id) {
  const { error } = await supabase.from('candidate_skills').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — PAYROLL
// ═══════════════════════════════════════════════════════════
export async function loadPayroll(bulan = null) {
  let q = supabase.from('payroll').select('*').order('full_name');
  if (bulan) q = q.eq('bulan', bulan);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}
export async function upsertPayroll(payload) {
  const { data, error } = await supabase.from('payroll')
    .upsert(payload, { onConflict: 'employee_id,bulan' }).select().single();
  if (error) throw error;
  return data;
}
export async function deletePayroll(id) {
  const { error } = await supabase.from('payroll').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// ATTENDANCE — filter by bulan (fitur #5 filter dinamis)
// ═══════════════════════════════════════════════════════════
export async function loadAttendanceByBulan(bulan = null) {
  let q = supabase.from('attendance').select('*').order('full_name');
  if (bulan) q = q.eq('bulan', bulan);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}
export async function loadAttendanceBulanList() {
  const { data, error } = await supabase.from('attendance').select('bulan').order('bulan');
  if (error) throw error;
  return [...new Set(data.map(d => d.bulan))];
}

// Ambil daftar bulan dari tabel payroll (untuk dropdown di modul Penggajian)
export async function loadPayrollBulanList() {
  const { data, error } = await supabase.from('payroll').select('bulan').order('bulan');
  if (error) throw error;
  const bulanOrder = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const unique = [...new Set(data.map(d => d.bulan))];
  return unique.sort((a, b) => {
    const [ma, ya] = [a.slice(0,3), a.match(/\d{4}/)?.[0]||'0'];
    const [mb, yb] = [b.slice(0,3), b.match(/\d{4}/)?.[0]||'0'];
    if (ya !== yb) return ya.localeCompare(yb);
    return bulanOrder.indexOf(ma) - bulanOrder.indexOf(mb);
  });
}

// ═══════════════════════════════════════════════════════════
// CRUD — RIWAYAT KARYAWAN (#6)
// ═══════════════════════════════════════════════════════════
export async function loadEmployeeHistory(employee_id = null) {
  let q = supabase.from('employee_history').select('*').order('tgl_perubahan', { ascending: false });
  if (employee_id) q = q.eq('employee_id', employee_id);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createHistory(payload) {
  const { data, error } = await supabase.from('employee_history').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function deleteHistory(id) {
  const { error } = await supabase.from('employee_history').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — CUTI (#7)
// ═══════════════════════════════════════════════════════════
export async function loadCutiSaldo(tahun = null) {
  let q = supabase.from('cuti_saldo').select('*, employees(name, position)').order('employee_id');
  if (tahun) q = q.eq('tahun', tahun);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function upsertCutiSaldo(payload) {
  const { data, error } = await supabase.from('cuti_saldo')
    .upsert(payload, { onConflict: 'employee_id,tahun' }).select().single();
  if (error) throw error; return data;
}
export async function loadCutiPengajuan(status = null) {
  let q = supabase.from('cuti_pengajuan').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createCutiPengajuan(payload) {
  const { data, error } = await supabase.from('cuti_pengajuan').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function updateCutiPengajuan(id, payload) {
  const { data, error } = await supabase.from('cuti_pengajuan')
    .update(payload).eq('id', id).select().single();
  if (error) throw error; return data;
}
export async function deleteCutiPengajuan(id) {
  const { error } = await supabase.from('cuti_pengajuan').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — ABSENSI HARIAN (#9)
// ═══════════════════════════════════════════════════════════
export async function loadDailyAttendance(tanggal = null) {
  let q = supabase.from('attendance_daily').select('*').order('full_name');
  if (tanggal) q = q.eq('tanggal', tanggal);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function upsertDailyAttendance(payload) {
  const { data, error } = await supabase.from('attendance_daily')
    .upsert(payload, { onConflict: 'employee_id,tanggal' }).select().single();
  if (error) throw error; return data;
}
export async function deleteDailyAttendance(id) {
  const { error } = await supabase.from('attendance_daily').delete().eq('id', id);
  if (error) throw error;
}
export async function aggregateDailyToMonthly(employee_id, bulan_str) {
  // bulan_str: "2026-01" → query semua hari di bulan itu lalu upsert ke attendance
  const [year, month] = bulan_str.split('-');
  const from = `${year}-${month}-01`;
  const to   = new Date(+year, +month, 0).toISOString().slice(0,10);
  const { data, error } = await supabase.from('attendance_daily')
    .select('*').eq('employee_id', employee_id).gte('tanggal', from).lte('tanggal', to);
  if (error) throw error;
  const totals = { total_hadir:0, terlambat:0, sakit:0, izin:0, cuti:0, alpha:0 };
  data.forEach(d => {
    if (d.status === 'Hadir' || d.status === 'Telat') totals.total_hadir++;
    if (d.status === 'Telat')  totals.terlambat++;
    if (d.status === 'Sakit')  totals.sakit++;
    if (d.status === 'Izin')   totals.izin++;
    if (d.status === 'Cuti')   totals.cuti++;
    if (d.status === 'Alpha')  totals.alpha++;
  });
  const bulanLabel = new Date(+year, +month-1, 1)
    .toLocaleDateString('id-ID', { month:'short' }) + ` (${year})`;
  const { error: e2 } = await supabase.from('attendance')
    .upsert({ employee_id, bulan: bulanLabel, ...totals }, { onConflict: 'employee_id,bulan' });
  if (e2) throw e2;
  return totals;
}

// ═══════════════════════════════════════════════════════════
// CRUD — HR USERS / MANAJEMEN USER (#10)
// ═══════════════════════════════════════════════════════════
export async function loadHrUsers() {
  const { data, error } = await supabase.from('hr_users').select('*').order('created_at');
  if (error) throw error; return data;
}
export async function updateHrUser(id, payload) {
  const { data, error } = await supabase.from('hr_users')
    .update(payload).eq('id', id).select().single();
  if (error) throw error; return data;
}

// ═══════════════════════════════════════════════════════════
// CRUD — DOKUMEN KARYAWAN (#11)
// ═══════════════════════════════════════════════════════════
export async function loadDocuments(employee_id = null) {
  let q = supabase.from('employee_documents').select('*').order('created_at', { ascending: false });
  if (employee_id) q = q.eq('employee_id', employee_id);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createDocument(payload) {
  const { data, error } = await supabase.from('employee_documents').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function deleteDocument(id) {
  const { error } = await supabase.from('employee_documents').delete().eq('id', id);
  if (error) throw error;
}
export async function uploadDocumentFile(file, employee_id) {
  const ext  = file.name.split('.').pop();
  const path = `documents/${employee_id}/${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from('hris-docs').upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('hris-docs').getPublicUrl(path);
  return { url: publicUrl, path, name: file.name, size: file.size };
}

// ═══════════════════════════════════════════════════════════
// CRUD — OFFBOARDING (#12)
// ═══════════════════════════════════════════════════════════
export async function loadOffboarding() {
  const { data, error } = await supabase.from('offboarding').select('*').order('tgl_resign', { ascending: false });
  if (error) throw error; return data;
}
export async function upsertOffboarding(payload) {
  const { data, error } = await supabase.from('offboarding')
    .upsert(payload, { onConflict: 'employee_id' }).select().single();
  if (error) throw error; return data;
}
export async function deleteOffboarding(id) {
  const { error } = await supabase.from('offboarding').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — KPI PENILAIAN (#13)
// ═══════════════════════════════════════════════════════════
export async function loadKpi(employee_id = null) {
  let q = supabase.from('kpi_penilaian').select('*').order('created_at', { ascending: false });
  if (employee_id) q = q.eq('employee_id', employee_id);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function upsertKpi(payload) {
  const { data, error } = await supabase.from('kpi_penilaian')
    .upsert(payload, { onConflict: 'employee_id,periode,tipe' }).select().single();
  if (error) throw error; return data;
}
export async function deleteKpi(id) {
  const { error } = await supabase.from('kpi_penilaian').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// ANALYTICS — agregasi data untuk chart (#8)
// ═══════════════════════════════════════════════════════════
export async function loadAnalyticsData() {
  const [emp, rek, att, sp, kpi] = await Promise.all([
    supabase.from('employees').select('status, employment_status, gender, organization_name, join_date, date_resign').then(r => r.data || []),
    (async () => {
      const PAGE = 1000; let all = [], from = 0;
      while (true) {
        const { data } = await supabase.from('recruitment')
          .select('posisi, applied, join_date, lokasi')
          .range(from, from + PAGE - 1);
        if (!data || data.length === 0) break;
        all = all.concat(data);
        if (data.length < PAGE) break;
        from += PAGE;
      }
      return all;
    })(),
    supabase.from('attendance').select('bulan, total_hadir, alpha, terlambat').then(r => r.data || []),
    supabase.from('employee_sp').select('jenis_sp, bulan').then(r => r.data || []),
    supabase.from('kpi_penilaian').select('skor_total, periode, tipe').then(r => r.data || []),
  ]);
  return { emp, rek, att, sp, kpi };
}

// ═══════════════════════════════════════════════════════════
// CRUD — OVERTIME / LEMBUR (v3.1)
// ═══════════════════════════════════════════════════════════
export async function loadOvertime(employee_id = null) {
  let q = supabase.from('overtime').select('*').order('tanggal', { ascending: false });
  if (employee_id) q = q.eq('employee_id', employee_id);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createOvertime(payload) {
  const { data, error } = await supabase.from('overtime').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function updateOvertime(id, payload) {
  const { data, error } = await supabase.from('overtime').update(payload).eq('id', id).select().single();
  if (error) throw error; return data;
}
export async function deleteOvertime(id) {
  const { error } = await supabase.from('overtime').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — TRAINING & PENGEMBANGAN (v3.1)
// ═══════════════════════════════════════════════════════════
export async function loadTraining(employee_id = null) {
  let q = supabase.from('training_program').select('*').order('tgl_mulai', { ascending: false });
  if (employee_id) q = q.eq('employee_id', employee_id);
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createTraining(payload) {
  const { data, error } = await supabase.from('training_program').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function updateTraining(id, payload) {
  const { data, error } = await supabase.from('training_program').update(payload).eq('id', id).select().single();
  if (error) throw error; return data;
}
export async function deleteTraining(id) {
  const { error } = await supabase.from('training_program').delete().eq('id', id);
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════
// CRUD — HR CALENDAR (v3.1)
// ═══════════════════════════════════════════════════════════
export async function loadHrCalendar(year = null) {
  let q = supabase.from('hr_calendar').select('*').order('tanggal');
  if (year) q = q.gte('tanggal', year + '-01-01').lte('tanggal', year + '-12-31');
  const { data, error } = await q; if (error) throw error; return data;
}
export async function createHrCalendar(payload) {
  const { data, error } = await supabase.from('hr_calendar').insert(payload).select().single();
  if (error) throw error; return data;
}
export async function deleteHrCalendar(id) {
  const { error } = await supabase.from('hr_calendar').delete().eq('id', id);
  if (error) throw error;
}
