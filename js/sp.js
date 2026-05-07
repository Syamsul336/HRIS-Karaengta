// ═══════════════════════════════════════════════════════════
// SP.JS — Surat Peringatan list & table
// ═══════════════════════════════════════════════════════════
import { badgeSP } from './utils.js';
import { animateCount } from './animations.js';

const SVG_TOTAL = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
const SVG_WARN1 = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
const SVG_WARN2 = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
const SVG_CAL   = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

let spData = [];

export function initSP(data) {
  spData = data;
  const sp1   = spData.filter(s => s.jenis_sp === 'SP 1').length;
  const sp2   = spData.filter(s => s.jenis_sp === 'SP 2').length;
  const byOkt = spData.filter(s => s.bulan.includes('Okt')).length;

  const CARDS = [
    { cls:'kpi-1', icon:SVG_TOTAL, label:'Total SP',   val:spData.length, id:'sp-st-1' },
    { cls:'kpi-3', icon:SVG_WARN1, label:'SP 1',       val:sp1,           id:'sp-st-2' },
    { cls:'kpi-2', icon:SVG_WARN2, label:'SP 2',       val:sp2,           id:'sp-st-3' },
    { cls:'kpi-4', icon:SVG_CAL,   label:'SP Oktober', val:byOkt,         id:'sp-st-4' },
  ];

  const statsEl = document.getElementById('sp-stats');
  if (statsEl) {
    statsEl.innerHTML = CARDS.map((c, i) =>
      `<div class="stat-card-new ${c.cls} anim-slide-up delay-${i + 1}">
        <div class="stat-accent"></div>
        <div class="stat-card-icon">${c.icon}</div>
        <div class="stat-label-new">${c.label}</div>
        <div class="stat-num-new" id="${c.id}" data-val="${c.val}">0</div>
      </div>`
    ).join('');
    requestAnimationFrame(() => CARDS.forEach(c => animateCount(document.getElementById(c.id), c.val, 900)));
  }

  const badge = document.getElementById('badge-sp');
  if (badge) badge.textContent = spData.length;

  buildSpList(spData);
}

let _spTablePage = 1;
const _spTablePageSize = 15;
let _spCurrentData = [];

export function buildSpList(data) {
  _spCurrentData = data;
  _spTablePage = 1;
  _renderSpPage();
}

function _renderSpPage() {
  const data = _spCurrentData;
  const listEl = document.getElementById('sp-list');
  const tbody  = document.getElementById('sp-tbody');
  const pagEl  = document.getElementById('sp-table-pagination');

  if (listEl) {
    // Show first 10 in the card list view
    const listData = data.slice(0, 10);
    listEl.innerHTML = (listData.length ? listData : []).map(s =>
      `<div class="sp-card">
        <div class="sp-icon ${s.jenis_sp.includes('1') ? 'sp1' : 'sp2'}">
          ${s.jenis_sp.includes('1')
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'
          }
        </div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${s.name}</div>
          <div style="font-size:12px;color:var(--text-hint)">${s.position} · ${s.level}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${s.employee_id} · ${s.bulan}</div>
        </div>
        ${badgeSP(s.jenis_sp)}
      </div>`
    ).join('') + (data.length > 10 ? `<div style="text-align:center;padding:10px;font-size:12px;color:#8c6c64">+${data.length-10} SP lainnya — lihat di Tabel Lengkap</div>` : '');
    if (!data.length) listEl.innerHTML = '<div style="color:#8c6c64;font-size:13px;padding:18px;text-align:center">Tidak ada surat peringatan.</div>';
  }

  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#8c6c64;padding:28px">Tidak ada data SP.</td></tr>`;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(data.length / _spTablePageSize);
  const startIdx   = (_spTablePage - 1) * _spTablePageSize;
  const pageData   = data.slice(startIdx, startIdx + _spTablePageSize);

  tbody.innerHTML = pageData.map((s, i) =>
    `<tr>
      <td>${startIdx + i + 1}</td>
      <td style="font-size:11px;color:#8c6c64;font-weight:700">${s.employee_id}</td>
      <td><b>${s.name}</b></td>
      <td style="font-size:12px">${s.position}</td>
      <td>${s.level}</td>
      <td>${badgeSP(s.jenis_sp)}</td>
      <td><span class="badge badge-gray">${s.bulan}</span></td>
      <td><button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusSP(${s.id})">Hapus</button></td>
    </tr>`
  ).join('');

  if (pagEl) {
    if (totalPages > 1) {
      const pages = [];
      if (_spTablePage > 1) pages.push(`<button onclick="window._spGoPage(${_spTablePage-1})" style="${_spBtnStyle(false)}">‹</button>`);
      for (let p = Math.max(1,_spTablePage-2); p <= Math.min(totalPages,_spTablePage+2); p++) {
        pages.push(`<button onclick="window._spGoPage(${p})" style="${_spBtnStyle(p===_spTablePage)}">${p}</button>`);
      }
      if (_spTablePage < totalPages) pages.push(`<button onclick="window._spGoPage(${_spTablePage+1})" style="${_spBtnStyle(false)}">›</button>`);
      pagEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;flex-wrap:wrap;gap:8px">
        <div style="font-size:12px;color:#8c6c64">Menampilkan <b>${startIdx+1}–${Math.min(startIdx+_spTablePageSize,data.length)}</b> dari <b>${data.length}</b> SP</div>
        <div style="display:flex;gap:4px">${pages.join('')}</div>
      </div>`;
    } else {
      pagEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;padding:8px 0">${data.length} surat peringatan</div>`;
    }
  }
}
function _spBtnStyle(a) { return a ? 'padding:5px 10px;border-radius:7px;border:1.5px solid #8d1e18;background:#8d1e18;color:white;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif;font-weight:700' : 'padding:5px 10px;border-radius:7px;border:1px solid rgba(141,30,24,.2);background:white;color:#303030;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif'; }
window._spGoPage = function(p) { _spTablePage = p; _renderSpPage(); };

export function switchSpTab(name, el) {
  document.querySelectorAll('#page-sp .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const filtered = name === 'all' ? spData : spData.filter(s => s.bulan.toLowerCase().includes(name));
  buildSpList(filtered);
}

// ── SEARCH & FILTER ──────────────────────────────────────
let _spSearchQuery = '';
let _spFilterJenisVal = '';

window._spSearch = function(q) {
  _spSearchQuery = q.toLowerCase();
  _applySpFilter();
};
window._spFilterJenis = function(j) {
  _spFilterJenisVal = j;
  _applySpFilter();
};
function _applySpFilter() {
  const filtered = spData.filter(s =>
    (!_spSearchQuery   || s.name.toLowerCase().includes(_spSearchQuery) || s.employee_id.toLowerCase().includes(_spSearchQuery)) &&
    (!_spFilterJenisVal || s.jenis_sp === _spFilterJenisVal)
  );
  buildSpList(filtered);
}

// ═══════════════════════════════════════════════════════════
// CRUD — TAMBAH & HAPUS SP (#2)
// ═══════════════════════════════════════════════════════════
import { createSP, deleteSP } from './supabase.js';

export function openAddSPModal() {
  ['sp-emp-id','sp-name','sp-position','sp-bulan','sp-keterangan'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('modal-sp')?.classList.add('open');
}

export async function saveAddSP(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    employee_id: g('sp-emp-id'),
    name:        g('sp-name'),
    position:    g('sp-position'),
    jenis_sp:    g('sp-jenis') || 'SP 1',
    level:       g('sp-level') || 'Staff',
    gender:      g('sp-gender')|| 'Laki-laki',
    bulan:       g('sp-bulan'),
    keterangan:  g('sp-keterangan'),
  };
  if (!payload.employee_id || !payload.bulan) { alert('ID karyawan dan bulan wajib diisi!'); return; }
  try {
    await createSP(payload);
    const { loadSP } = await import('./supabase.js');
    spData = await loadSP();
    buildSpList(spData);
    document.getElementById('badge-sp').textContent = spData.length;
    document.getElementById('modal-sp')?.classList.remove('open');
    alert('✅ Surat Peringatan berhasil ditambahkan!');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusSP(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const s = spData.find(x => x.id === id);
  if (!confirm('Hapus SP ' + (s?.jenis_sp||'') + ' untuk ' + (s?.name||id) + '?')) return;
  try {
    await deleteSP(id);
    spData = spData.filter(x => x.id !== id);
    buildSpList(spData);
    document.getElementById('badge-sp').textContent = spData.length;
  } catch (e) { alert('❌ Gagal hapus: ' + e.message); }
}
