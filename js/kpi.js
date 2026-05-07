// ═══════════════════════════════════════════════════════════
// KPI.JS — Penilaian Kinerja (#13)
// ═══════════════════════════════════════════════════════════
import { loadKpi, upsertKpi, deleteKpi } from './supabase.js';
import { animateRowsIn, animateCount } from './animations.js';

let kpiData  = [];
let empData  = [];
let filterEmpId = '';

export async function initKpi(employees) {
  empData = employees;
  const selFilter = document.getElementById('kpi-emp-filter');
  if (selFilter) {
    selFilter.innerHTML = '<option value="">-- Semua Karyawan --</option>' +
      employees.map(e=>`<option value="${e.employee_id}">${e.name}</option>`).join('');
    selFilter.onchange = () => { filterEmpId = selFilter.value; refreshKpi(); };
  }
  const selModal = document.getElementById('kpi-emp-sel');
  if (selModal) {
    selModal.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.map(e=>`<option value="${e.employee_id}" data-name="${e.name}">${e.name}</option>`).join('');
  }
  await refreshKpi();
}

async function refreshKpi() {
  kpiData = await loadKpi(filterEmpId || null);
  _buildStats();
  buildKpiTable(kpiData);
}

function _buildStats() {
  const scores = kpiData.map(k => k.skor_total||0);
  const avg    = scores.length ? Math.round(scores.reduce((s,v)=>s+v,0)/scores.length) : 0;
  const a = scores.filter(s=>s>=85).length;
  const b = scores.filter(s=>s>=70&&s<85).length;
  const c = scores.filter(s=>s<70).length;

  const statsEl = document.getElementById('kpi-stats');
  if (!statsEl) return;
  const CARDS = [
    { cls:'kpi-1', label:'Total Penilaian',   val:kpiData.length, id:'kpi-st-1' },
    { cls:'kpi-3', label:'Rata-rata Skor',    val:avg,            id:'kpi-st-2' },
    { cls:'kpi-4', label:'Predikat A (≥85)',  val:a,              id:'kpi-st-3' },
    { cls:'kpi-2', label:'Perlu Perhatian',   val:c,              id:'kpi-st-4' },
  ];
  statsEl.innerHTML = CARDS.map((c,i)=>
    `<div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
      <div class="stat-accent"></div>
      <div class="stat-label-new">${c.label}</div>
      <div class="stat-num-new" id="${c.id}" data-val="${c.val}">0</div>
    </div>`
  ).join('');
  requestAnimationFrame(()=> CARDS.forEach(c=>animateCount(document.getElementById(c.id), c.val, 800)));
}

export function buildKpiTable(data) {
  const tbody = document.getElementById('kpi-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#8c6c64;padding:28px">Belum ada penilaian kinerja.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((k, i) => {
    const emp  = empData.find(e => e.employee_id === k.employee_id);
    const skor = k.skor_total || 0;
    const pred = skor>=85?'A':skor>=70?'B':skor>=55?'C':'D';
    const clr  = skor>=85?'#2d6a4f':skor>=70?'#1d4e89':skor>=55?'#854d0e':'#8d1e18';
    const predCls = skor>=85?'badge-aktif':skor>=70?'badge-contract':skor>=55?'badge-yellow':'badge-resign';
    return `<tr>
      <td>${i+1}</td>
      <td><b>${emp?.name||k.nama||k.employee_id}</b></td>
      <td>${k.periode}</td>
      <td><span class="badge badge-gray">${k.tipe}</span></td>
      <td style="text-align:center">${k.skor_kualitas??'—'}</td>
      <td style="text-align:center">${k.skor_kuantitas??'—'}</td>
      <td style="text-align:center">${k.skor_kehadiran??'—'}</td>
      <td style="text-align:center">${k.skor_sikap??'—'}</td>
      <td style="text-align:center">${k.skor_inisiatif??'—'}</td>
      <td style="text-align:center;font-weight:800;color:${clr};font-size:16px">${skor}</td>
      <td><span class="badge ${predCls}" style="font-size:13px;font-weight:800">${pred}</span></td>
      <td>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px" onclick="window.openEditKpi(${k.id})">Edit</button>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusKpi(${k.id})">Hapus</button>
      </td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));
}

let _editingKpiId = null;
export function openEditKpi(id) {
  const k = kpiData.find(x => x.id === id);
  if (!k) return;
  _editingKpiId = id;
  const setVal = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val??''; };
  setVal('kpi-emp-sel', k.employee_id);
  setVal('kpi-periode', k.periode);
  setVal('kpi-tipe', k.tipe);
  setVal('kpi-kualitas',   k.skor_kualitas);
  setVal('kpi-kuantitas',  k.skor_kuantitas);
  setVal('kpi-kehadiran',  k.skor_kehadiran);
  setVal('kpi-sikap',      k.skor_sikap);
  setVal('kpi-inisiatif',  k.skor_inisiatif);
  setVal('kpi-penilai',    k.penilai);
  setVal('kpi-catatan',    k.catatan);
  document.getElementById('modal-kpi')?.classList.add('open');
}

export async function saveKpi(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const n = id => parseInt(document.getElementById(id)?.value)||null;
  const empSel = document.getElementById('kpi-emp-sel');
  const nama   = empSel?.options[empSel.selectedIndex]?.dataset?.name ||
    empData.find(e=>e.employee_id===empSel?.value)?.name || '';

  const payload = {
    employee_id:    g('kpi-emp-sel'),
    nama,
    periode:        g('kpi-periode'),
    tipe:           g('kpi-tipe') || 'Bulanan',
    skor_kualitas:  n('kpi-kualitas'),
    skor_kuantitas: n('kpi-kuantitas'),
    skor_kehadiran: n('kpi-kehadiran'),
    skor_sikap:     n('kpi-sikap'),
    skor_inisiatif: n('kpi-inisiatif'),
    penilai:        g('kpi-penilai'),
    catatan:        g('kpi-catatan'),
  };
  if (!payload.employee_id || !payload.periode) { alert('Karyawan dan periode wajib diisi!'); return; }

  try {
    await upsertKpi(payload);
    _editingKpiId = null;
    await refreshKpi();
    document.getElementById('modal-kpi')?.classList.remove('open');
    alert('✅ Penilaian kinerja disimpan!');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusKpi(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const k = kpiData.find(x => x.id === id);
  if (!confirm(`Hapus penilaian ${k?.nama||id} periode ${k?.periode||''}?`)) return;
  try {
    await deleteKpi(id);
    kpiData = kpiData.filter(x => x.id !== id);
    _buildStats();
    buildKpiTable(kpiData);
  } catch (e) { alert('❌ ' + e.message); }
}
