// ═══════════════════════════════════════════════════════════
// KARYAWAN.JS — Employee cards & table
// ═══════════════════════════════════════════════════════════
import { normalizeStatus, initials, avatarColor, badgeEmpStatus, badgeEmpType } from './utils.js';
import { animateRowsIn } from './animations.js';

let empData        = [];
let empFilterText  = '';
let empFilterStatus= '';
let empFilterOrg   = '';

export function initKaryawan(data) {
  empData = data;
  const orgs = [...new Set(empData.map(e => e.organization_name))].sort();
  ['filter-org', 'filter-org-table'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Semua Unit</option>';
    orgs.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o;
      sel.appendChild(opt);
    });
  });
  buildEmpCards(empData);
  buildEmpTable(empData);
}

export function buildEmpCards(data) {
  const grid = document.getElementById('emp-card-grid');
  if (!grid) return;
  grid.innerHTML = data.map(e => {
    const ac       = avatarColor(e.employee_id);
    const isResign = normalizeStatus(e.status) === 'resign';
    return `<div class="emp-card" style="${isResign ? 'opacity:.65;' : ''}">
      <div class="emp-avatar" style="background:${ac}20;border-color:${ac}">
        <span style="color:${ac}">${initials(e.name)}</span>
      </div>
      <div class="emp-name">${e.name}</div>
      <div class="emp-pos">${e.position}</div>
      <div class="emp-meta">${badgeEmpStatus(e.status)} ${badgeEmpType(e.employment_status)}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;color:#8c6c64">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><rect x="9" y="12" width="6" height="10"/><rect x="8" y="6" width="3" height="3"/><rect x="13" y="6" width="3" height="3"/></svg>
        ${e.branch} &nbsp;·&nbsp;
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ${e.join_date}
      </div>
      ${e.end_date ? `<div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#8c6c64;margin-top:2px">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        s/d ${e.end_date}
      </div>` : ''}
    </div>`;
  }).join('');
}

let _empTablePage = 1;
const _empTablePageSize = 20;
let _empTableData = [];

export function buildEmpTable(data) {
  _empTableData = data;
  _empTablePage = 1;
  _renderEmpTablePage();
}

function _renderEmpTablePage() {
  const data = _empTableData;
  const tbody = document.getElementById('emp-tbody');
  const pagEl = document.getElementById('emp-table-pagination');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#8c6c64;padding:28px">Tidak ada data karyawan.</td></tr>`;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }
  const totalPages = Math.ceil(data.length / _empTablePageSize);
  const startIdx = (_empTablePage - 1) * _empTablePageSize;
  const pageData = data.slice(startIdx, startIdx + _empTablePageSize);

  tbody.innerHTML = pageData.map(e => {
    const ac = avatarColor(e.employee_id);
    return `<tr>
      <td><span style="font-size:11px;font-weight:700;color:#8c6c64">${e.employee_id}</span></td>
      <td><div style="display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:${ac}30;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;border:1.5px solid ${ac}">
          <span style="color:${ac}">${initials(e.name)}</span>
        </div><b>${e.name}</b>
      </div></td>
      <td>${e.organization_name}</td>
      <td style="font-size:12px">${e.position}</td>
      <td>${e.branch}</td>
      <td>${badgeEmpStatus(e.status)}</td>
      <td>${badgeEmpType(e.employment_status)}</td>
      <td>${e.join_date}</td>
      <td>${e.end_date || '—'}</td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));

  if (pagEl) {
    if (totalPages > 1) {
      const pages = [];
      if (_empTablePage > 1) pages.push(`<button onclick="window._empGoPage(${_empTablePage-1})" style="${_empBtnStyle(false)}">‹</button>`);
      for (let p = Math.max(1,_empTablePage-2); p <= Math.min(totalPages,_empTablePage+2); p++) {
        pages.push(`<button onclick="window._empGoPage(${p})" style="${_empBtnStyle(p===_empTablePage)}">${p}</button>`);
      }
      if (_empTablePage < totalPages) pages.push(`<button onclick="window._empGoPage(${_empTablePage+1})" style="${_empBtnStyle(false)}">›</button>`);
      pagEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;flex-wrap:wrap;gap:8px">
        <div style="font-size:12px;color:#8c6c64">Menampilkan <b>${startIdx+1}–${Math.min(startIdx+_empTablePageSize,data.length)}</b> dari <b>${data.length}</b> karyawan</div>
        <div style="display:flex;gap:4px">${pages.join('')}</div>
      </div>`;
    } else {
      pagEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;padding:8px 0">${data.length} karyawan</div>`;
    }
  }
}
function _empBtnStyle(a) { return a ? 'padding:5px 10px;border-radius:7px;border:1.5px solid #8d1e18;background:#8d1e18;color:white;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif;font-weight:700' : 'padding:5px 10px;border-radius:7px;border:1px solid rgba(141,30,24,.2);background:white;color:#303030;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif'; }
window._empGoPage = function(p) { _empTablePage = p; _renderEmpTablePage(); };

export function filterEmp(v)       { empFilterText   = v.toLowerCase(); _applyFilter(); }
export function filterEmpStatus(v) { empFilterStatus = v;               _applyFilter(); }
export function filterEmpOrg(v)    { empFilterOrg    = v;               _applyFilter(); }

function _applyFilter() {
  const f = empData.filter(e =>
    (!empFilterText   || (e.name || '').toLowerCase().includes(empFilterText)) &&
    (!empFilterStatus || normalizeStatus(e.status) === normalizeStatus(empFilterStatus)) &&
    (!empFilterOrg    || e.organization_name === empFilterOrg)
  );
  buildEmpCards(f);
  buildEmpTable(f);
}

export function switchEmpTab(name, el) {
  document.querySelectorAll('#page-karyawan .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('emp-cards').classList.toggle('active', name === 'cards');
  document.getElementById('emp-table').classList.toggle('active', name === 'table');
  if (name === 'table') requestAnimationFrame(() => animateRowsIn(document.querySelector('#emp-tbody')));
}

// ── MODAL TAB SWITCHING ─────────────────────────────────
export function switchEmpModalTab(name, btn) {
  ['data','kontak','gaji'].forEach(t => {
    const panel = document.getElementById('ee-panel-' + t);
    const tabBtn = document.getElementById('ee-tab-' + t);
    if (panel) panel.style.display = t === name ? '' : 'none';
    if (tabBtn) {
      tabBtn.style.background = t === name ? '#8d1e18' : 'transparent';
      tabBtn.style.color      = t === name ? 'white' : 'rgba(141,30,24,0.7)';
    }
  });
}
window.switchEmpModalTab = switchEmpModalTab;

// ═══════════════════════════════════════════════════════════
// CRUD — EDIT & HAPUS KARYAWAN (#2)
// ═══════════════════════════════════════════════════════════
import { updateEmployee, deleteEmployee } from './supabase.js';

let _editingEmpId = null;

export function openEditEmpModal(employee_id) {
  _editingEmpId = employee_id;
  const e = empData.find(x => x.employee_id === employee_id);
  if (!e) return;
  const sv = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

  // Tab 1: Data Pekerjaan
  sv('ee-name',        e.name);
  sv('ee-position',    e.position);
  sv('ee-org',         e.organization_name);
  sv('ee-branch',      e.branch);
  sv('ee-gender',      e.gender      || 'Laki-laki');
  sv('ee-status',      e.status      || 'Aktif');
  sv('ee-emp-status',  e.employment_status || 'Contract');
  sv('ee-pendidikan',  e.pendidikan  || '');
  sv('ee-join-date',   e.join_date   || '');
  sv('ee-end-date',    e.end_date    || '');
  sv('ee-tempat-lahir',e.tempat_lahir|| '');
  sv('ee-tgl-lahir',   e.tgl_lahir   || '');
  sv('ee-alamat',      e.alamat      || '');

  // Tab 2: Kontak & Legal
  sv('ee-telepon',  e.no_telepon  || '');
  sv('ee-email',    e.email       || '');
  sv('ee-nik',      e.nik         || '');
  sv('ee-bpjs-kes', e.no_bpjs_kes || '');
  sv('ee-bpjs-tk',  e.no_bpjs_tk  || '');
  sv('ee-kd-nama',  e.kontak_darurat_nama || '');
  sv('ee-kd-hub',   e.kontak_darurat_hub  || '');
  sv('ee-kd-hp',    e.kontak_darurat_hp   || '');

  // Tab 3: Gaji & Bank
  sv('ee-gaji-pokok',   e.gaji_pokok           || 0);
  sv('ee-tj-makan',     e.tunjangan_makan      || 0);
  sv('ee-tj-transport', e.tunjangan_transport  || 0);
  sv('ee-tj-lain',      e.tunjangan_tetap_lain || 0);
  sv('ee-nama-bank',    e.nama_bank    || '');
  sv('ee-no-rek',       e.no_rekening  || '');
  sv('ee-atas-nama',    e.atas_nama_rek || '');

  // Reset to first tab
  switchEmpModalTab('data', document.getElementById('ee-tab-data'));
  document.getElementById('modal-emp-edit')?.classList.add('open');
}

export async function saveEditEmp(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g  = id => document.getElementById(id)?.value?.trim() || '';
  const gn = id => parseInt(document.getElementById(id)?.value || 0) || 0;
  const payload = {
    // Tab 1: Data Pekerjaan
    name:               g('ee-name'),
    position:           g('ee-position'),
    organization_name:  g('ee-org'),
    branch:             g('ee-branch'),
    gender:             g('ee-gender'),
    status:             g('ee-status'),
    employment_status:  g('ee-emp-status'),
    pendidikan:         g('ee-pendidikan')  || null,
    join_date:          g('ee-join-date')   || null,
    end_date:           g('ee-end-date')    || null,
    tempat_lahir:       g('ee-tempat-lahir')|| null,
    tgl_lahir:          g('ee-tgl-lahir')   || null,
    alamat:             g('ee-alamat')      || null,
    // Tab 2: Kontak & Legal
    no_telepon:             g('ee-telepon')  || null,
    email:                  g('ee-email')   || null,
    nik:                    g('ee-nik')     || null,
    no_bpjs_kes:            g('ee-bpjs-kes')|| null,
    no_bpjs_tk:             g('ee-bpjs-tk') || null,
    kontak_darurat_nama:    g('ee-kd-nama') || null,
    kontak_darurat_hub:     g('ee-kd-hub')  || null,
    kontak_darurat_hp:      g('ee-kd-hp')   || null,
    // Tab 3: Gaji & Bank
    gaji_pokok:             gn('ee-gaji-pokok'),
    tunjangan_makan:        gn('ee-tj-makan'),
    tunjangan_transport:    gn('ee-tj-transport'),
    tunjangan_tetap_lain:   gn('ee-tj-lain'),
    nama_bank:              g('ee-nama-bank')  || null,
    no_rekening:            g('ee-no-rek')     || null,
    atas_nama_rek:          g('ee-atas-nama')  || null,
  };
  if (!payload.name) { alert('Nama wajib diisi!'); return; }
  try {
    await updateEmployee(_editingEmpId, payload);
    empData = await (await import('./supabase.js')).loadEmployees();
    buildEmpCards(empData);
    buildEmpTable(empData);
    document.getElementById('modal-emp-edit')?.classList.remove('open');
    alert('✅ Data karyawan diperbarui!');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusEmp(employee_id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const e = empData.find(x => x.employee_id === employee_id);
  if (!confirm('Hapus karyawan "' + (e?.name||employee_id) + '"? Semua data absensi & SP terkait juga akan dihapus.')) return;
  try {
    await deleteEmployee(employee_id);
    empData = empData.filter(x => x.employee_id !== employee_id);
    buildEmpCards(empData);
    buildEmpTable(empData);
  } catch (e) { alert('❌ Gagal hapus: ' + e.message); }
}
