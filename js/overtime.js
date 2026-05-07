// ═══════════════════════════════════════════════════════════
// OVERTIME.JS — Lembur karyawan
// ═══════════════════════════════════════════════════════════
import { loadOvertime, createOvertime, updateOvertime, deleteOvertime } from './supabase.js';
import { animateRowsIn, animateCount } from './animations.js';

let overtimeData = [];
let empData      = [];
let _filterText  = '';
let _filterStatus= '';
let _page        = 1;
const PAGE_SIZE  = 20;

export async function initOvertime(employees) {
  empData = employees;
  await refreshOvertime();
}

async function refreshOvertime() {
  try {
    overtimeData = await loadOvertime();
  } catch(e) {
    overtimeData = [];
  }
  _buildStats();
  _renderTable();
}

function _buildStats() {
  const approved = overtimeData.filter(o => o.status === 'Disetujui');
  const pending  = overtimeData.filter(o => o.status === 'Pending');
  const totalJam = approved.reduce((s, o) => s + (parseFloat(o.durasi_jam)||0), 0);
  const totalNom = approved.reduce((s, o) => s + (o.total_nominal||0), 0);

  const el = document.getElementById('overtime-stats');
  if (!el) return;
  const CARDS = [
    { cls:'kpi-1', label:'Total Pengajuan', val:overtimeData.length },
    { cls:'kpi-3', label:'Pending Approval',val:pending.length },
    { cls:'kpi-4', label:'Total Jam Disetujui', val:Math.round(totalJam) },
    { cls:'kpi-2', label:'Total Nominal (Rp)', val:'Rp ' + _fmt(totalNom) },
  ];
  el.innerHTML = CARDS.map((c,i) => `
    <div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
      <div class="stat-accent"></div>
      <div class="stat-label-new">${c.label}</div>
      <div class="stat-num-new" style="font-size:32px">${c.val}</div>
    </div>`).join('');
}

function _fmt(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'jt';
  return n.toLocaleString('id-ID');
}

function _renderTable() {
  const tbody = document.getElementById('overtime-tbody');
  const pagEl = document.getElementById('overtime-pagination');
  if (!tbody) return;

  const filtered = overtimeData.filter(o =>
    (!_filterText   || (o.full_name||'').toLowerCase().includes(_filterText)) &&
    (!_filterStatus || o.status === _filterStatus)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#8c6c64;padding:28px">Tidak ada data lembur.</td></tr>`;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((_page-1)*PAGE_SIZE, _page*PAGE_SIZE);
  const startIdx   = (_page-1)*PAGE_SIZE;

  tbody.innerHTML = pageData.map((o, i) => {
    const statusColor = o.status==='Disetujui' ? '#15803d' : o.status==='Ditolak' ? '#8d1e18' : '#d97706';
    const statusBg    = o.status==='Disetujui' ? '#dcfce7' : o.status==='Ditolak' ? '#fee2e2' : '#fef3c7';
    return `<tr>
      <td>${startIdx+i+1}</td>
      <td><b>${o.full_name||'—'}</b></td>
      <td style="font-size:12px">${o.tanggal||'—'}</td>
      <td style="font-size:12px">${o.jam_mulai||'—'}</td>
      <td style="font-size:12px">${o.jam_selesai||'—'}</td>
      <td style="font-weight:700">${o.durasi_jam ? (+o.durasi_jam).toFixed(1)+' jam' : '—'}</td>
      <td style="font-size:12px">${o.jenis||'Biasa'}</td>
      <td><span style="padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:${statusBg};color:${statusColor}">${o.status}</span></td>
      <td style="white-space:nowrap">
        ${o.status==='Pending' ? `
          <button class="btn btn-ghost" style="padding:2px 7px;font-size:11px;color:#15803d" onclick="window.approveOvertime(${o.id})">✓ Setuju</button>
          <button class="btn btn-ghost" style="padding:2px 7px;font-size:11px;color:#8d1e18" onclick="window.rejectOvertime(${o.id})">✗ Tolak</button>
        ` : ''}
        <button class="btn btn-ghost" style="padding:2px 7px;font-size:11px;color:#8d1e18" onclick="window.deleteOvertimeEntry(${o.id})">Hapus</button>
      </td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));

  if (pagEl && totalPages > 1) {
    const btn = (p, lbl, active) => `<button onclick="window._otPage(${p})" style="padding:4px 9px;border-radius:7px;border:${active?'1.5px solid #8d1e18':'1px solid rgba(141,30,24,.2)'};background:${active?'#8d1e18':'white'};color:${active?'white':'#303030'};cursor:pointer;font-size:11px;font-family:Manrope,sans-serif">${lbl}</button>`;
    const pages = [];
    if (_page>1) pages.push(btn(_page-1,'‹',false));
    for (let p=Math.max(1,_page-2);p<=Math.min(totalPages,_page+2);p++) pages.push(btn(p,p,p===_page));
    if (_page<totalPages) pages.push(btn(_page+1,'›',false));
    pagEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;flex-wrap:wrap;gap:8px"><span style="font-size:12px;color:#8c6c64">Menampilkan ${startIdx+1}–${Math.min(startIdx+PAGE_SIZE,filtered.length)} dari ${filtered.length}</span><div style="display:flex;gap:4px">${pages.join('')}</div></div>`;
  } else if (pagEl) {
    pagEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;padding:8px 0">${filtered.length} record</div>`;
  }
}

window._otPage = p => { _page = p; _renderTable(); };

window.filterOvertime = q => { _filterText = q.toLowerCase(); _page = 1; _renderTable(); };
window.filterOvertimeStatus = s => { _filterStatus = s; _page = 1; _renderTable(); };

window.approveOvertime = async (id) => {
  try { await updateOvertime(id, { status:'Disetujui' }); await refreshOvertime(); }
  catch(e) { alert('❌ ' + e.message); }
};
window.rejectOvertime = async (id) => {
  if (!confirm('Tolak pengajuan lembur ini?')) return;
  try { await updateOvertime(id, { status:'Ditolak' }); await refreshOvertime(); }
  catch(e) { alert('❌ ' + e.message); }
};
window.deleteOvertimeEntry = async (id) => {
  if (!confirm('Hapus data lembur ini?')) return;
  try { await deleteOvertime(id); overtimeData = overtimeData.filter(o => o.id !== id); _renderTable(); }
  catch(e) { alert('❌ ' + e.message); }
};

// ── ADD MODAL ─────────────────────────────────────────────
window.openOvertimeModal = function() {
  const modal = document.getElementById('modal-overtime');
  if (!modal) return;
  // populate emp select
  const sel = document.getElementById('ot-emp-sel');
  if (sel) sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
    empData.map(e => `<option value="${e.employee_id}" data-name="${e.name}">${e.name}</option>`).join('');
  const today = new Date().toISOString().slice(0,10);
  const dtEl = document.getElementById('ot-tanggal'); if (dtEl) dtEl.value = today;
  modal.classList.add('open');
};

window.saveOvertime = async function() {
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const sel = document.getElementById('ot-emp-sel');
  const empId = sel?.value;
  const empName = sel?.options[sel.selectedIndex]?.dataset?.name || '';
  if (!empId) { alert('Pilih karyawan!'); return; }
  const payload = {
    employee_id:  empId,
    full_name:    empName,
    tanggal:      g('ot-tanggal') || null,
    jam_mulai:    g('ot-jam-mulai') || null,
    jam_selesai:  g('ot-jam-selesai') || null,
    tarif_per_jam:parseInt(g('ot-tarif')) || 0,
    jenis:        g('ot-jenis') || 'Biasa',
    keterangan:   g('ot-keterangan') || null,
    status:       'Pending',
  };
  try {
    await createOvertime(payload);
    await refreshOvertime();
    document.getElementById('modal-overtime')?.classList.remove('open');
  } catch(e) { alert('❌ ' + e.message); }
};
