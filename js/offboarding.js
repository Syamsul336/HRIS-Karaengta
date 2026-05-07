// ═══════════════════════════════════════════════════════════
// OFFBOARDING.JS — Checklist Offboarding (#12) + Filter
// ═══════════════════════════════════════════════════════════
import { loadOffboarding, upsertOffboarding, deleteOffboarding } from './supabase.js';

let offboardData  = [];
let empData       = [];
let editingId     = null;
let _filterText   = '';
let _filterStatus = '';

const CHECKLIST_FIELDS = [
  { key:'serah_laptop',         label:'Serah terima laptop / perangkat' },
  { key:'serah_id_card',        label:'Serah terima ID card / badge' },
  { key:'serah_seragam',        label:'Serah terima seragam / atribut' },
  { key:'serah_kunci',          label:'Serah terima kunci / akses fisik' },
  { key:'cabut_akses_sistem',   label:'Cabut akses sistem / aplikasi' },
  { key:'cabut_akses_email',    label:'Cabut akses email kerja' },
  { key:'exit_interview',       label:'Exit interview selesai' },
  { key:'urus_bpjs',            label:'Urusan BPJS diselesaikan' },
  { key:'urus_surat_referensi', label:'Surat referensi kerja diterbitkan' },
];

export async function initOffboarding(employees) {
  empData = employees;
  const sel = document.getElementById('ob-emp-sel');
  if (sel) {
    sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.map(e => `<option value="${e.employee_id}" data-name="${e.name}">${e.name} — ${e.position||''}</option>`).join('');
  }
  offboardData = await loadOffboarding();
  _buildStats();
  _applyFilter();
}

function _buildStats() {
  const el = document.getElementById('offboard-stats');
  if (!el) return;
  const total   = offboardData.length;
  const proses  = offboardData.filter(o => o.status === 'Proses').length;
  const selesai = offboardData.filter(o => o.status === 'Selesai').length;
  const avgPct  = total
    ? Math.round(offboardData.reduce((s, o) => {
        const done = CHECKLIST_FIELDS.filter(f => o[f.key]).length;
        return s + (done / CHECKLIST_FIELDS.length) * 100;
      }, 0) / total)
    : 0;

  el.innerHTML = [
    { cls:'kpi-1', label:'Total Offboarding', val: total },
    { cls:'kpi-3', label:'Sedang Proses',     val: proses },
    { cls:'kpi-4', label:'Selesai',           val: selesai },
    { cls:'kpi-2', label:'Rata-rata Progres', val: avgPct + '%' },
  ].map((c, i) => `
    <div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
      <div class="stat-accent"></div>
      <div class="stat-label-new">${c.label}</div>
      <div class="stat-num-new" style="font-size:${String(c.val).length>4?'26px':'38px'}">${c.val}</div>
    </div>`).join('');
}

window.filterOffboard = q => { _filterText = q.toLowerCase(); _applyFilter(); };
window.filterOffboardStatus = s => { _filterStatus = s; _applyFilter(); };

function _applyFilter() {
  const filtered = offboardData.filter(ob => {
    const emp  = empData.find(e => e.employee_id === ob.employee_id);
    const name = (emp?.name || ob.nama || '').toLowerCase();
    if (_filterText   && !name.includes(_filterText))  return false;
    if (_filterStatus && ob.status !== _filterStatus)  return false;
    return true;
  });
  buildOffboardTable(filtered);
}

export function buildOffboardTable(data) {
  const container = document.getElementById('offboard-list');
  if (!container) return;

  if (!data.length) {
    const msg = (_filterText || _filterStatus)
      ? 'Tidak ada data yang cocok dengan filter.'
      : 'Belum ada proses offboarding. Klik "+ Mulai Offboarding" untuk memulai.';
    container.innerHTML = `<div style="text-align:center;color:#8c6c64;padding:48px 24px;font-size:13px">
      <div style="font-size:32px;margin-bottom:10px">📋</div>${msg}</div>`;
    return;
  }

  container.innerHTML = data.map(ob => {
    const emp   = empData.find(e => e.employee_id === ob.employee_id);
    const done  = CHECKLIST_FIELDS.filter(f => ob[f.key]).length;
    const pct   = Math.round((done / CHECKLIST_FIELDS.length) * 100);
    const barClr = pct === 100 ? '#2d6a4f' : pct >= 60 ? '#d97706' : '#8d1e18';
    const statusBadge = ob.status === 'Selesai'
      ? `<span class="badge badge-aktif">Selesai</span>`
      : `<span class="badge badge-yellow">Proses</span>`;

    return `
    <div class="card mb-20" style="border-left:4px solid ${barClr}">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(141,30,24,.08)">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:46px;height:46px;border-radius:14px;background:rgba(141,30,24,.1);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#8d1e18;flex-shrink:0">
            ${(emp?.name||ob.nama||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
          </div>
          <div>
            <div style="font-size:15px;font-weight:700;color:#1a1a1a">${emp?.name||ob.nama||ob.employee_id}</div>
            <div style="font-size:12px;color:#8c6c64;margin-top:2px">${emp?.position||'—'} &nbsp;·&nbsp; Resign: <b>${ob.tgl_resign||'—'}</b> &nbsp;·&nbsp; Terakhir: <b>${ob.tgl_terakhir||'—'}</b></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          <div style="text-align:center;min-width:54px">
            <div style="font-size:22px;font-weight:800;color:${barClr};line-height:1">${pct}%</div>
            <div style="font-size:10px;color:#8c6c64;margin-top:1px">${done}/${CHECKLIST_FIELDS.length} item</div>
          </div>
          ${statusBadge}
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" onclick="window.openOffboardEdit('${ob.employee_id}')">Edit</button>
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px;color:#8d1e18" onclick="window.hapusOffboard(${ob.id})">Hapus</button>
        </div>
      </div>

      <div style="height:6px;background:rgba(141,30,24,.1);border-radius:99px;margin-bottom:14px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${barClr};border-radius:99px"></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
        ${CHECKLIST_FIELDS.map(f => `
          <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:9px;background:${ob[f.key]?'rgba(45,106,79,.08)':'rgba(141,30,24,.04)'};border:1px solid ${ob[f.key]?'rgba(45,106,79,.2)':'rgba(141,30,24,.08)'}">
            <span style="font-size:15px;flex-shrink:0">${ob[f.key] ? '✅' : '⬜'}</span>
            <span style="font-size:12px;color:${ob[f.key]?'#2d6a4f':'#8c6c64'};line-height:1.3">${f.label}</span>
          </div>`).join('')}
      </div>

      ${ob.catatan ? `<div style="margin-top:12px;padding:10px 12px;background:#fffdf0;border-radius:9px;border-left:3px solid #d97706;font-size:12px;color:#7a5200"><b>Catatan:</b> ${ob.catatan}</div>` : ''}
    </div>`;
  }).join('');
}

export function openOffboardModal(empId = null) {
  editingId = null;
  const sel = document.getElementById('ob-emp-sel');
  if (sel && empId) sel.value = empId;
  ['ob-tgl-resign','ob-tgl-terakhir','ob-catatan'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  CHECKLIST_FIELDS.forEach(f => {
    const cb = document.getElementById('ob-'+f.key); if (cb) cb.checked = false;
  });
  const st = document.getElementById('ob-status'); if (st) st.value = 'Proses';
  document.getElementById('modal-offboard')?.classList.add('open');
}

export async function openOffboardEdit(empId) {
  const ob = offboardData.find(x => x.employee_id === empId);
  if (!ob) { openOffboardModal(empId); return; }
  editingId = ob.id;
  const sel = document.getElementById('ob-emp-sel');
  if (sel) sel.value = ob.employee_id;
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v||''; };
  setVal('ob-tgl-resign', ob.tgl_resign);
  setVal('ob-tgl-terakhir', ob.tgl_terakhir);
  setVal('ob-catatan', ob.catatan);
  setVal('ob-status', ob.status);
  CHECKLIST_FIELDS.forEach(f => {
    const cb = document.getElementById('ob-'+f.key); if (cb) cb.checked = !!ob[f.key];
  });
  document.getElementById('modal-offboard')?.classList.add('open');
}

export async function saveOffboard(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g   = id => document.getElementById(id)?.value?.trim() || '';
  const chk = key => !!document.getElementById('ob-'+key)?.checked;
  const empSel  = document.getElementById('ob-emp-sel');
  const empName = empSel?.options[empSel.selectedIndex]?.dataset?.name ||
    empData.find(e => e.employee_id === empSel?.value)?.name || '';

  const payload = {
    employee_id: g('ob-emp-sel'), nama: empName,
    tgl_resign: g('ob-tgl-resign')||null, tgl_terakhir: g('ob-tgl-terakhir')||null,
    catatan: g('ob-catatan'), status: g('ob-status')||'Proses',
    ...Object.fromEntries(CHECKLIST_FIELDS.map(f => [f.key, chk(f.key)]))
  };
  if (!payload.employee_id) { alert('Pilih karyawan!'); return; }
  if (CHECKLIST_FIELDS.filter(f => payload[f.key]).length === CHECKLIST_FIELDS.length)
    payload.status = 'Selesai';

  try {
    await upsertOffboarding(payload);
    offboardData = await loadOffboarding();
    _buildStats(); _applyFilter();
    document.getElementById('modal-offboard')?.classList.remove('open');
    alert('✅ Checklist offboarding disimpan!');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusOffboard(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus data offboarding ini?')) return;
  try {
    await deleteOffboarding(id);
    offboardData = offboardData.filter(x => x.id !== id);
    _buildStats(); _applyFilter();
  } catch (e) { alert('❌ ' + e.message); }
}
