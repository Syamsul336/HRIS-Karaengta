// ═══════════════════════════════════════════════════════════
// APP.JS — Entry point. Auth, load data, semua modul v3.1
// OPTIMASI: lazy load — data hanya dimuat saat halaman dibuka
// ═══════════════════════════════════════════════════════════
import { requireAuth, logout, loadEmployees, loadRecruitment, loadAttendance, loadSP,
  loadAttendanceBulanList, loadPayrollBulanList } from './supabase.js';
import { runPageAnimations, observeReveal } from './animations.js';
import { buildDashboard }   from './dashboard.js';
import { initRekrutmen, switchRekTab, filterRek, filterRekPos, saveKandidat,
  openEditRekModal, saveEditRek, hapusRek, updateRekStage, POSISI_LIST } from './rekrutmen.js';
import { initKaryawan, switchEmpTab, filterEmp, filterEmpStatus, filterEmpOrg,
  openEditEmpModal, saveEditEmp, hapusEmp } from './karyawan.js';
import { initAbsensi }  from './absensi.js';
import { initSP, switchSpTab, openAddSPModal, saveAddSP, hapusSP } from './sp.js';
import { initPayroll, loadPayrollBulan, openInputGajiModal, savePayroll,
  hapusPayroll, openSlipGaji, exportPayrollExcel } from './payroll.js';
import { initJobOpenings, buildJobBoard, buildCandidateProfiles,
  openJobModal, saveJob, hapusJob, openKandidatProfile, saveKandidatProfile } from './job-openings.js';
import { initRiwayat, filterRiwayatEmp, saveHistory, hapusHistory } from './riwayat.js';
import { initCuti, saveCutiSaldo, saveCutiPengajuan, approveCuti, hapusCuti } from './cuti.js';
import { initAnalytics } from './analytics.js';
import { initAbsensiHarian, openInputHarian, saveDailyAbs, hapusDailyAbs, aggregateToMonthly } from './absensi-harian.js';
import { initUserManagement, changeUserRole, toggleUserActive } from './user-management.js';
import { initDokumen, saveDocument, hapusDoc } from './dokumen.js';
import { initOffboarding, openOffboardModal, openOffboardEdit, saveOffboard, hapusOffboard } from './offboarding.js';
import { initKpi, openEditKpi, saveKpi, hapusKpi } from './kpi.js';
import { initOvertime } from './overtime.js';
import { initTraining } from './training.js';

// ── AUTH ──────────────────────────────────────────────────
const authResult = await requireAuth();
if (!authResult) throw new Error('Not authenticated');
const { session, hrUser } = authResult;
const canWrite = ['admin','hr_manager','hr_staff'].includes(hrUser.role);
const isAdmin  = hrUser.role === 'admin';

// ── LAZY LOAD STATE ───────────────────────────────────────
// Halaman yang sudah diinit — tidak perlu init ulang
const _inited = new Set(['dashboard']); // dashboard diinit saat boot

// Map page → init function (dipanggil pertama kali halaman dibuka)
const _pageInit = {
  'rekrutmen':      async () => { /* sudah diinit di boot */ },
  'karyawan':       async () => { /* sudah diinit di boot */ },
  'absensi':        async () => { /* sudah diinit di boot */ },
  'sp':             async () => { /* sudah diinit di boot */ },
  'job-openings':   async () => { await initJobOpenings(window._rek || []); },
  'payroll':        async () => {
    let bl = [];
    try {
      bl = await loadPayrollBulanList();
    } catch(e) {
      console.error('[Payroll] Gagal load daftar bulan:', e.message);
    }
    initPayroll(window._emp || [], bl);
  },
  'riwayat':        async () => { await initRiwayat(window._emp || []); },
  'cuti':           async () => { await initCuti(window._emp || []); },
  'analytics':      async () => { await initAnalytics(); },
  'absensi-harian': async () => { await initAbsensiHarian(window._emp || []); },
  'dokumen':        async () => { await initDokumen(window._emp || []); },
  'offboarding':    async () => { await initOffboarding(window._emp || []); },
  'kpi':            async () => { await initKpi(window._emp || []); },
  'users':          async () => { if (isAdmin) await initUserManagement(); },
  'overtime':       async () => { await initOvertime(window._emp || []); },
  'training':       async () => { await initTraining(window._emp || []); },
};

// ── NAVIGATION ────────────────────────────────────────────
async function navTo(page, el) {
  document.querySelectorAll('.page').forEach(p     => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  el.classList.add('active');
  closeSidebar();
  window.scrollTo(0, 0);

  // Lazy init: jalankan hanya jika belum pernah dibuka
  if (!_inited.has(page) && _pageInit[page]) {
    _inited.add(page); // tandai dulu, cegah double-init
    try {
      _showPageLoader(page);
      await _pageInit[page]();
    } catch (e) {
      console.error('Lazy init error for', page, e);
      _inited.delete(page); // reset supaya bisa dicoba ulang
    } finally {
      _hidePageLoader(page);
    }
  }

  requestAnimationFrame(() => runPageAnimations(page));
}

function _showPageLoader(page) {
  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  let loader = pageEl.querySelector('.page-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `<div class="page-loader-dots"><span></span><span></span><span></span></div><div class="page-loader-text">Memuat data...</div>`;
    pageEl.prepend(loader);
  }
  loader.style.display = 'flex';
}

function _hidePageLoader(page) {
  const loader = document.getElementById('page-' + page)?.querySelector('.page-loader');
  if (loader) loader.style.display = 'none';
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }

// ── DATA LOADER (hanya data inti) ─────────────────────────
async function _retry(fn, label, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fn();
      if (!Array.isArray(r)) throw new Error('Data ' + label + ' tidak valid');
      return r;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
}

async function loadCoreData() {
  // Hanya 4 tabel inti yang dibutuhkan dashboard — paralel dengan timeout
  const withTimeout = (promise, ms, label) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout: ${label} (${ms}ms)`)), ms))
    ]);

  const [rekData, empData, attData, spData] = await Promise.all([
    withTimeout(_retry(loadRecruitment, 'rekrutmen'), 10000, 'rekrutmen'),
    withTimeout(_retry(loadEmployees,   'karyawan'),  10000, 'karyawan'),
    withTimeout(_retry(loadAttendance,  'absensi'),   10000, 'absensi'),
    withTimeout(_retry(loadSP,          'SP'),        10000, 'SP'),
  ]);
  return { rekData, empData, attData, spData };
}

// ── LOADING BAR ───────────────────────────────────────────
let _li = null, _lp = 0;
function showLoading() {
  const wrap = document.getElementById('loading-bar-wrap');
  const bar  = document.getElementById('loading-bar');
  const ov   = document.getElementById('loading-overlay');
  if (wrap) wrap.classList.add('active');
  if (ov)   ov.classList.remove('hidden');
  _lp = 0;
  if (bar) bar.style.width = '0%';
  _li = setInterval(() => {
    if (_lp < 85) { _lp += (85 - _lp) * 0.08; if (bar) bar.style.width = _lp + '%'; }
  }, 60);
}
function finishLoading() {
  clearInterval(_li);
  const wrap = document.getElementById('loading-bar-wrap');
  const bar  = document.getElementById('loading-bar');
  const ov   = document.getElementById('loading-overlay');
  if (bar) bar.style.width = '100%';
  setTimeout(() => {
    if (wrap) wrap.classList.remove('active');
    if (bar)  bar.style.width = '0%';
    if (ov)   { ov.classList.add('hidden'); setTimeout(() => { ov.style.display = 'none'; }, 400); }
  }, 300);
}

// ── INIT (hanya data inti — cepat) ───────────────────────
async function init() {
  showLoading();

  let rekData, empData, attData, spData;
  try {
    ({ rekData, empData, attData, spData } = await loadCoreData());
  } catch (err) {
    finishLoading();
    console.error('Load error:', err);
    // Tampilkan error yang bisa di-retry
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-overlay').innerHTML = `
      <div style="text-align:center;padding:24px">
        <div style="font-size:32px;margin-bottom:12px">⚠️</div>
        <div style="font-weight:700;color:#8d1e18;margin-bottom:8px">Gagal memuat data</div>
        <div style="font-size:13px;color:#8c6c64;margin-bottom:20px;max-width:280px">${err.message}</div>
        <button onclick="location.reload()" style="background:#8d1e18;color:white;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">🔄 Coba Lagi</button>
      </div>`;
    return;
  }

  finishLoading();

  // Simpan ke window untuk diakses lazy modules
  window._rek = rekData;
  window._emp = empData;
  window._att = attData;
  window._sp  = spData;
  window.empDataCache = empData;

  // Header user info
  const userBadge = document.getElementById('user-badge');
  if (userBadge) userBadge.textContent = hrUser.full_name || hrUser.email;
  const avatarEl = document.getElementById('header-avatar');
  if (avatarEl) {
    avatarEl.textContent = (hrUser.full_name || hrUser.email || 'HR').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  }
  const nameEl = document.querySelector('.header-user-name');
  const planEl = document.querySelector('.header-user-plan');
  if (nameEl) nameEl.textContent = hrUser.full_name || hrUser.email;
  if (planEl) planEl.textContent = hrUser.role;

  if (!canWrite) document.querySelectorAll('[data-requires-write]').forEach(el => el.style.display = 'none');
  if (!isAdmin)  document.querySelectorAll('[data-requires-admin]').forEach(el => el.style.display = 'none');

  // Isi dropdown posisi resmi di seluruh aplikasi
  const _fillPos = (id, allLabel) => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = `<option value="">${allLabel}</option>` +
      POSISI_LIST.map(p => `<option value="${p}">${p}</option>`).join('');
  };
  _fillPos('jf-title',                  '-- Pilih Posisi --');
  _fillPos('f-posisi-sel',              '-- Pilih Posisi --');
  _fillPos('fe-posisi-sel',             '-- Pilih Posisi --');

  // Init modul inti saja (dashboard, rekrutmen, karyawan, absensi, SP)
  buildDashboard({ empData, rekData, attData, spData });
  initRekrutmen(rekData);
  initKaryawan(empData);
  await initAbsensi(attData);
  initSP(spData);
  _inited.add('rekrutmen'); _inited.add('karyawan');
  _inited.add('absensi');   _inited.add('sp');
}

init();

// ── WINDOW BINDINGS ───────────────────────────────────────
window.logout = logout; window.navTo = navTo;
window.toggleSidebar = toggleSidebar; window.closeSidebar = closeSidebar;
window.closeModal = closeModal;

// Rekrutmen
window.switchRekTab     = switchRekTab;
window.filterRek        = filterRek;
window.filterRekPos     = filterRekPos;
window.openAddRekModal  = () => openModal('modal-rek');
window.saveKandidat     = () => saveKandidat(canWrite);
window.openEditRekModal = openEditRekModal;
window.saveEditRek      = () => saveEditRek(canWrite);
window.hapusRek        = id => hapusRek(id, canWrite);
window.updateRekStage  = (id, stage) => updateRekStage(id, stage, canWrite);

// Karyawan
window.switchEmpTab     = switchEmpTab;
window.filterEmp        = filterEmp;
window.filterEmpStatus  = filterEmpStatus;
window.filterEmpOrg     = filterEmpOrg;
window.openEditEmpModal = openEditEmpModal;
window.saveEditEmp      = () => saveEditEmp(canWrite);
window.hapusEmp         = id => hapusEmp(id, canWrite);

// SP
window.switchSpTab      = switchSpTab;
window.openAddSPModal   = () => openModal('modal-sp');
window.saveAddSP        = () => saveAddSP(canWrite);
window.hapusSP          = id => hapusSP(id, canWrite);

// Payroll
window.openInputGajiModal = () => openInputGajiModal(window.empDataCache || []);
window.savePayroll        = () => savePayroll(canWrite);
window.hapusPayroll       = id => hapusPayroll(id, canWrite);
window.openSlipGaji       = openSlipGaji;
window.exportPayrollExcel = exportPayrollExcel;

// Job Openings / ATS
window.openJobModal        = id => openJobModal(id);
window.saveJob             = () => saveJob(canWrite);
window.hapusJob            = id => hapusJob(id, canWrite);
window.openEditJob         = id => openJobModal(id);
window.openKandidatProfile = openKandidatProfile;
window.saveKandidatProfile = () => saveKandidatProfile(canWrite);

// Riwayat (#6)
window.filterRiwayatEmp = filterRiwayatEmp;
window.openAddRiwayat   = () => openModal('modal-riwayat');
window.saveHistory      = () => saveHistory(canWrite);
window.hapusHistory     = id => hapusHistory(id, canWrite);

// Cuti (#7)
window.openSetSaldo       = () => openModal('modal-cuti-saldo');
window.openAjukanCuti     = () => openModal('modal-cuti-pengajuan');
window.saveCutiSaldo      = () => saveCutiSaldo(canWrite);
window.saveCutiPengajuan  = () => saveCutiPengajuan(canWrite);
window.approveCuti        = (id, s) => approveCuti(id, s, canWrite);
window.hapusCuti          = id => hapusCuti(id, canWrite);

// Absensi Harian (#9)
window.openInputHarian    = () => openInputHarian(window.empDataCache || []);
window.saveDailyAbs       = () => saveDailyAbs(canWrite);
window.hapusDailyAbs      = id => hapusDailyAbs(id, canWrite);
window.aggregateToMonthly = () => aggregateToMonthly(canWrite);

// User Management (#10)
window.changeUserRole   = (id, role) => changeUserRole(id, role, canWrite);
window.toggleUserActive = (id, val)  => toggleUserActive(id, val, canWrite);

// Dokumen (#11)
window.hapusDoc          = id => hapusDoc(id, canWrite);
window.saveDocument      = () => saveDocument(canWrite);
window.openUploadDokumen = () => openModal('modal-dokumen');

// Offboarding (#12)
window.openOffboardModal = () => openOffboardModal();
window.openOffboardEdit  = id => openOffboardEdit(id);
window.saveOffboard      = () => saveOffboard(canWrite);
window.hapusOffboard     = id => hapusOffboard(id, canWrite);

// KPI (#13)
window.openAddKpi  = () => {
  ['kpi-emp-sel','kpi-periode','kpi-penilai','kpi-catatan'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  ['kpi-kualitas','kpi-kuantitas','kpi-kehadiran','kpi-sikap','kpi-inisiatif'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=80;});
  openModal('modal-kpi');
};
window.openEditKpi = openEditKpi;
window.saveKpi     = () => saveKpi(canWrite);
window.hapusKpi    = id => hapusKpi(id, canWrite);

// Tab helpers
window.switchJobTab = (name, el) => {
  document.querySelectorAll('#page-job-openings .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('job-tab-board').classList.toggle('active', name==='board');
  document.getElementById('job-tab-profiles').classList.toggle('active', name==='profiles');
};
window.switchCutiTab = (name, el) => {
  document.querySelectorAll('#page-cuti .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cuti-tab-saldo').classList.toggle('active', name==='saldo');
  document.getElementById('cuti-tab-pengajuan').classList.toggle('active', name==='pengajuan');
};
