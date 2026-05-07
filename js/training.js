// ═══════════════════════════════════════════════════════════
// TRAINING.JS — Training & Pengembangan SDM
// ═══════════════════════════════════════════════════════════
import { loadTraining, createTraining, updateTraining, deleteTraining } from './supabase.js';
import { animateRowsIn, animateCount } from './animations.js';

let trainingData = [];
let empData      = [];
let _filterText  = '';
let _filterStatus= '';
let _page        = 1;
const PAGE_SIZE  = 20;

export async function initTraining(employees) {
  empData = employees;
  await refreshTraining();
}

async function refreshTraining() {
  try {
    trainingData = await loadTraining();
  } catch(e) {
    trainingData = [];
  }
  _buildStats();
  _renderTable();
}

function _buildStats() {
  const done   = trainingData.filter(t => t.status === 'Selesai');
  const plan   = trainingData.filter(t => t.status === 'Direncanakan');
  const total  = trainingData.reduce((s,t) => s + (t.biaya||0), 0);
  const avgVal = done.length ? Math.round(done.filter(t=>t.nilai_akhir).reduce((s,t)=>s+(t.nilai_akhir||0),0) / Math.max(1,done.filter(t=>t.nilai_akhir).length)) : 0;

  const el = document.getElementById('training-stats');
  if (!el) return;
  const CARDS = [
    { cls:'kpi-1', label:'Total Training',      val:trainingData.length },
    { cls:'kpi-3', label:'Direncanakan',         val:plan.length },
    { cls:'kpi-4', label:'Selesai',              val:done.length },
    { cls:'kpi-2', label:'Total Biaya Training', val:'Rp ' + _fmt(total) },
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
  const tbody = document.getElementById('training-tbody');
  const pagEl = document.getElementById('training-pagination');
  if (!tbody) return;

  const filtered = trainingData.filter(t =>
    (!_filterText   || (t.nama_karyawan||'').toLowerCase().includes(_filterText) || (t.nama_training||'').toLowerCase().includes(_filterText)) &&
    (!_filterStatus || t.status === _filterStatus)
  );

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#8c6c64;padding:28px">Tidak ada data training.</td></tr>`;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((_page-1)*PAGE_SIZE, _page*PAGE_SIZE);
  const startIdx   = (_page-1)*PAGE_SIZE;
  const statusColors = {
    'Direncanakan':{ bg:'#eff6ff', color:'#1d4ed8' },
    'Berlangsung': { bg:'#fef3c7', color:'#d97706' },
    'Selesai':     { bg:'#dcfce7', color:'#15803d' },
    'Batal':       { bg:'#fee2e2', color:'#b91c1c' },
  };

  tbody.innerHTML = pageData.map((t, i) => {
    const sc = statusColors[t.status] || { bg:'#f3f4f6', color:'#374151' };
    return `<tr>
      <td>${startIdx+i+1}</td>
      <td><b>${t.nama_karyawan||'—'}</b></td>
      <td>${t.nama_training||'—'}</td>
      <td style="font-size:11px">${t.jenis||'—'}</td>
      <td style="font-size:12px;color:#8c6c64">${t.penyelenggara||'—'}</td>
      <td style="font-size:11px">${t.tgl_mulai||''}${t.tgl_selesai&&t.tgl_selesai!==t.tgl_mulai?' – '+t.tgl_selesai:''}</td>
      <td style="font-size:12px">${t.biaya ? 'Rp '+_fmt(t.biaya) : '—'}</td>
      <td><span style="padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:${sc.bg};color:${sc.color}">${t.status}</span></td>
      <td>
        <button class="btn btn-ghost" style="padding:2px 7px;font-size:11px" onclick="window.editTraining(${t.id})">Edit</button>
        <button class="btn btn-ghost" style="padding:2px 7px;font-size:11px;color:#8d1e18" onclick="window.deleteTrainingEntry(${t.id})">Hapus</button>
      </td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));

  if (pagEl && totalPages > 1) {
    const btn = (p, lbl, active) => `<button onclick="window._trPage(${p})" style="padding:4px 9px;border-radius:7px;border:${active?'1.5px solid #8d1e18':'1px solid rgba(141,30,24,.2)'};background:${active?'#8d1e18':'white'};color:${active?'white':'#303030'};cursor:pointer;font-size:11px;font-family:Manrope,sans-serif">${lbl}</button>`;
    const pages = [];
    if (_page>1) pages.push(btn(_page-1,'‹',false));
    for (let p=Math.max(1,_page-2);p<=Math.min(totalPages,_page+2);p++) pages.push(btn(p,p,p===_page));
    if (_page<totalPages) pages.push(btn(_page+1,'›',false));
    pagEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;flex-wrap:wrap;gap:8px"><span style="font-size:12px;color:#8c6c64">Menampilkan ${startIdx+1}–${Math.min(startIdx+PAGE_SIZE,filtered.length)} dari ${filtered.length}</span><div style="display:flex;gap:4px">${pages.join('')}</div></div>`;
  } else if (pagEl) {
    pagEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;padding:8px 0">${filtered.length} record</div>`;
  }
}

window._trPage = p => { _page = p; _renderTable(); };
window.filterTraining = q => { _filterText = q.toLowerCase(); _page = 1; _renderTable(); };
window.filterTrainingStatus = s => { _filterStatus = s; _page = 1; _renderTable(); };

window.deleteTrainingEntry = async (id) => {
  if (!confirm('Hapus data training ini?')) return;
  try { await deleteTraining(id); trainingData = trainingData.filter(t => t.id !== id); _renderTable(); }
  catch(e) { alert('❌ ' + e.message); }
};

let _editTrainingId = null;
window.editTraining = function(id) {
  _editTrainingId = id;
  const t = trainingData.find(x => x.id === id);
  if (!t) return;
  const sv = (elId, val) => { const el = document.getElementById(elId); if(el) el.value = val||''; };
  const sel = document.getElementById('tr-emp-sel');
  if (sel) sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
    empData.map(e => `<option value="${e.employee_id}" ${e.employee_id===t.employee_id?'selected':''}>${e.name}</option>`).join('');
  sv('tr-nama-training', t.nama_training);
  sv('tr-jenis',         t.jenis);
  sv('tr-penyelenggara', t.penyelenggara);
  sv('tr-tgl-mulai',     t.tgl_mulai);
  sv('tr-tgl-selesai',   t.tgl_selesai);
  sv('tr-biaya',         t.biaya);
  sv('tr-nilai',         t.nilai_akhir);
  sv('tr-status',        t.status);
  sv('tr-keterangan',    t.keterangan);
  sv('tr-sertifikat',    t.sertifikat_url);
  document.getElementById('modal-training')?.classList.add('open');
};

window.openTrainingModal = function() {
  _editTrainingId = null;
  const sel = document.getElementById('tr-emp-sel');
  if (sel) sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
    empData.map(e => `<option value="${e.employee_id}">${e.name}</option>`).join('');
  ['tr-nama-training','tr-jenis','tr-penyelenggara','tr-tgl-mulai','tr-tgl-selesai','tr-biaya','tr-nilai','tr-keterangan','tr-sertifikat'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  const stEl = document.getElementById('tr-status'); if(stEl) stEl.value = 'Direncanakan';
  document.getElementById('modal-training')?.classList.add('open');
};

window.saveTraining = async function() {
  const g  = id => document.getElementById(id)?.value?.trim() || '';
  const sel= document.getElementById('tr-emp-sel');
  const empId = sel?.value;
  const empName = sel?.options[sel.selectedIndex]?.text || '';
  if (!empId || !g('tr-nama-training')) { alert('Karyawan dan nama training wajib diisi!'); return; }
  const payload = {
    employee_id:    empId,
    nama_karyawan:  empName,
    nama_training:  g('tr-nama-training'),
    jenis:          g('tr-jenis')         || 'Internal',
    penyelenggara:  g('tr-penyelenggara') || null,
    tgl_mulai:      g('tr-tgl-mulai')     || null,
    tgl_selesai:    g('tr-tgl-selesai')   || null,
    biaya:          parseInt(g('tr-biaya'))||0,
    nilai_akhir:    parseInt(g('tr-nilai'))||null,
    status:         g('tr-status')        || 'Direncanakan',
    keterangan:     g('tr-keterangan')    || null,
    sertifikat_url: g('tr-sertifikat')    || null,
  };
  try {
    if (_editTrainingId) await updateTraining(_editTrainingId, payload);
    else await createTraining(payload);
    await refreshTraining();
    document.getElementById('modal-training')?.classList.remove('open');
  } catch(e) { alert('❌ ' + e.message); }
};
