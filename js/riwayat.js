// ═══════════════════════════════════════════════════════════
// RIWAYAT.JS — Mutasi / Promosi / Riwayat Karyawan (#6)
// ═══════════════════════════════════════════════════════════
import { loadEmployeeHistory, createHistory, deleteHistory } from './supabase.js';

let historyData = [];
let empData     = [];
let filterEmpId = '';

export async function initRiwayat(employees) {
  empData = employees;
  _fillEmpDropdown('riwayat-emp-filter');
  _fillEmpDropdown('rh-emp-sel');
  await refreshHistory();
}

async function refreshHistory() {
  historyData = await loadEmployeeHistory(filterEmpId || null);
  buildRiwayatTable(historyData);
}

function _fillEmpDropdown(id) {
  const sel = document.getElementById(id);
  if (!sel) return;
  const first = id.includes('filter') ? '<option value="">-- Semua Karyawan --</option>' : '<option value="">-- Pilih Karyawan --</option>';
  sel.innerHTML = first + empData.map(e =>
    `<option value="${e.employee_id}">${e.name} (${e.employee_id})</option>`
  ).join('');
}

export function buildRiwayatTable(data) {
  const tbody = document.getElementById('riwayat-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#8c6c64;padding:28px">Belum ada riwayat perubahan.</td></tr>`;
    return;
  }
  const JENIS_COLOR = { Promosi:'badge-aktif', Mutasi:'badge-contract', Demosi:'badge-resign', Status:'badge-yellow', Kontrak:'badge-probation', Lainnya:'badge-gray' };
  tbody.innerHTML = data.map((h, i) => {
    const emp = empData.find(e => e.employee_id === h.employee_id);
    return `<tr>
      <td>${i+1}</td>
      <td><b>${emp?.name || h.employee_id}</b><div style="font-size:10px;color:#8c6c64">${h.employee_id}</div></td>
      <td>${h.tgl_perubahan}</td>
      <td><span class="badge ${JENIS_COLOR[h.jenis]||'badge-gray'}">${h.jenis}</span></td>
      <td style="font-size:12px">${h.jabatan_lama||'—'} → ${h.jabatan_baru||'—'}</td>
      <td style="font-size:12px">${h.dept_lama||''} ${h.dept_baru&&h.dept_lama ? '→ '+h.dept_baru : h.dept_baru||''}</td>
      <td style="font-size:12px;max-width:200px;white-space:pre-wrap">${h.keterangan||'—'}</td>
      <td><button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusHistory(${h.id})">Hapus</button></td>
    </tr>`;
  }).join('');
}

export function filterRiwayatEmp(val) {
  filterEmpId = val;
  refreshHistory();
}

export async function saveHistory(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    employee_id:   g('rh-emp-sel'),
    tgl_perubahan: g('rh-tgl')     || new Date().toISOString().slice(0,10),
    jenis:         g('rh-jenis'),
    jabatan_lama:  g('rh-jab-lama'),
    jabatan_baru:  g('rh-jab-baru'),
    dept_lama:     g('rh-dept-lama'),
    dept_baru:     g('rh-dept-baru'),
    status_lama:   g('rh-st-lama'),
    status_baru:   g('rh-st-baru'),
    keterangan:    g('rh-keterangan'),
    dicatat_oleh:  g('rh-pencatat'),
  };
  if (!payload.employee_id) { alert('Pilih karyawan!'); return; }
  try {
    await createHistory(payload);
    await refreshHistory();
    document.getElementById('modal-riwayat')?.classList.remove('open');
    alert('✅ Riwayat berhasil dicatat!');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusHistory(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus catatan riwayat ini?')) return;
  try { await deleteHistory(id); await refreshHistory(); }
  catch (e) { alert('❌ ' + e.message); }
}
