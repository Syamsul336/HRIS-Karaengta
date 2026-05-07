// ═══════════════════════════════════════════════════════════
// ABSENSI.JS — Attendance stats, dynamic month filter (#5)
// ═══════════════════════════════════════════════════════════
import { animateCount, animateRowsIn, animateProgressBars } from './animations.js';
import { loadAttendanceByBulan, loadAttendanceBulanList } from './supabase.js';

const SVG_USERS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
const SVG_CHECK = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const SVG_CLOCK = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
const SVG_CROSS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

let currentAttBulan = null;

export async function initAbsensi(attDataInitial) {
  try {
    const bulanList = await loadAttendanceBulanList();
    const sel = document.getElementById('att-bulan-sel');
    if (sel) {
      sel.innerHTML = '<option value="">-- Semua Bulan --</option>';
      bulanList.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b; opt.textContent = b;
        sel.appendChild(opt);
      });
      sel.onchange = async () => {
        currentAttBulan = sel.value || null;
        const data = await loadAttendanceByBulan(currentAttBulan);
        _renderAbsensi(data);
        const sub = document.querySelector('#page-absensi .section-sub');
        if (sub) sub.textContent = currentAttBulan
          ? 'Rekap kehadiran karyawan — ' + currentAttBulan
          : 'Rekap kehadiran karyawan — semua periode';
      };
    }
  } catch (e) { console.error('Gagal load bulan list:', e); }
  _renderAbsensi(attDataInitial);
}

function _renderAbsensi(attData) {
  _buildStats(attData);
  _buildWarning(attData);
  _buildTable(attData);
}

function _buildStats(attData) {
  const totalHadir     = attData.reduce((s, a) => s + a.total_hadir, 0);
  const totalTerlambat = attData.reduce((s, a) => s + a.terlambat,   0);
  const totalSakit     = attData.reduce((s, a) => s + a.sakit,       0);
  const CARDS = [
    { cls:'kpi-1', icon:SVG_USERS, label:'Karyawan Tercatat', val:attData.length, id:'att-st-1' },
    { cls:'kpi-3', icon:SVG_CHECK, label:'Total Hadir (hari)', val:totalHadir,    id:'att-st-2' },
    { cls:'kpi-2', icon:SVG_CLOCK, label:'Total Terlambat',   val:totalTerlambat, id:'att-st-3' },
    { cls:'kpi-5', icon:SVG_CROSS, label:'Total Sakit (hari)', val:totalSakit,    id:'att-st-4' },
  ];
  const statsEl = document.getElementById('att-stats');
  if (statsEl) {
    statsEl.innerHTML = CARDS.map((c, i) =>
      `<div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
        <div class="stat-accent"></div>
        <div class="stat-card-icon">${c.icon}</div>
        <div class="stat-label-new">${c.label}</div>
        <div class="stat-num-new" id="${c.id}" data-val="${c.val}">0</div>
      </div>`
    ).join('');
    requestAnimationFrame(() => CARDS.forEach(c => animateCount(document.getElementById(c.id), c.val, 900)));
  }
}

function _buildWarning(attData) {
  const issues = attData.filter(a => a.terlambat > 0 || a.alpha > 0 || a.sakit >= 3);
  const warnEl = document.getElementById('att-warning');
  if (!warnEl) return;
  if (!issues.length) { warnEl.style.display = 'none'; return; }

  const byAlpha     = issues.filter(a => a.alpha > 0).length;
  const byTerlambat = issues.filter(a => a.terlambat > 3).length;
  const bySakit     = issues.filter(a => a.sakit >= 3).length;

  const chips = issues.map(a => {
    const tags = [];
    if (a.alpha > 0)       tags.push(`<span style="background:#fee2e2;color:#991b1b;font-size:10px;padding:1px 5px;border-radius:4px">Alpha</span>`);
    if (a.terlambat > 3)   tags.push(`<span style="background:#fef3c7;color:#92400e;font-size:10px;padding:1px 5px;border-radius:4px">${a.terlambat}x Telat</span>`);
    if (a.sakit >= 3)      tags.push(`<span style="background:#dbeafe;color:#1e40af;font-size:10px;padding:1px 5px;border-radius:4px">${a.sakit}h Sakit</span>`);
    return `<div style="display:inline-flex;align-items:center;gap:4px;background:white;border:1px solid #fbbf24;border-radius:8px;padding:4px 8px;margin:3px;white-space:nowrap">
      <span style="font-size:12px;font-weight:600;color:#78350f">${a.full_name}</span>${tags.join('')}
    </div>`;
  }).join('');

  warnEl.className = 'info-box warning';
  warnEl.style.display = '';
  warnEl.innerHTML = `
    <div style="width:100%">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0;flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          ${SVG_CROSS}
          <strong>${issues.length} karyawan</strong> perlu diperhatikan &nbsp;
          <span style="font-size:11px;opacity:.75">Alpha: <b>${byAlpha}</b> &nbsp;·&nbsp; Sering Telat: <b>${byTerlambat}</b> &nbsp;·&nbsp; Sakit ≥3h: <b>${bySakit}</b></span>
        </div>
        <button id="att-warn-toggle-btn"
          onclick="const c=document.getElementById('att-warn-chips');const open=c.style.maxHeight&&c.style.maxHeight!=='0px';c.style.maxHeight=open?'0px':'600px';document.getElementById('att-warn-toggle-btn').textContent=open?'▼ Lihat Detail':'▲ Tutup';"
          style="background:rgba(0,0,0,0.08);border:none;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;color:#78350f;flex-shrink:0">
          ▼ Lihat Detail
        </button>
      </div>
      <div id="att-warn-chips" style="max-height:0;overflow:hidden;transition:max-height .4s ease">
        <div style="display:flex;flex-wrap:wrap;padding-top:10px">${chips}</div>
      </div>
    </div>`;
}

let _attPage = 1;
const _attPageSize = 25;
let _attFullData = [];

function _buildTable(attData) {
  _attFullData = attData;
  _attPage = 1;
  _renderAttPage();
}

function _renderAttPage() {
  const attData = _attFullData;
  const tbody = document.getElementById('att-tbody');
  const paginationEl = document.getElementById('att-pagination');
  if (!tbody) return;
  if (!attData.length) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;color:#8c6c64;padding:28px">' +
      (currentAttBulan ? 'Tidak ada data absensi untuk ' + currentAttBulan : 'Pilih bulan untuk melihat data absensi.') +
      '</td></tr>';
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }
  const totalPages = Math.ceil(attData.length / _attPageSize);
  const pageData = attData.slice((_attPage-1)*_attPageSize, _attPage*_attPageSize);
  const startIdx = (_attPage-1)*_attPageSize;
  tbody.innerHTML = pageData.map((a, i) => {
    const pct   = Math.round((a.total_hadir / 31) * 100);
    const clr   = pct < 85 ? '#8d1e18' : pct < 95 ? '#8c6c64' : '#2d6a4f';
    const bgClr = pct < 85 ? '#8d1e18' : pct < 95 ? '#8c6c64' : '#fad442';
    return '<tr>' +
      '<td>' + (i+1) + '</td>' +
      '<td style="font-size:11px;color:#8c6c64;font-weight:700">' + (a.employee_id||'—') + '</td>' +
      '<td><b>' + a.full_name + '</b></td><td>' + (a.branch||'—') + '</td>' +
      '<td style="font-weight:700">' + a.total_hadir + '</td>' +
      '<td>' + (a.terlambat>0 ? '<span class="badge badge-sp1">'+a.terlambat+'x</span>' : '—') + '</td>' +
      '<td>' + (a.cuti>0  ? '<span class="badge badge-yellow">'+a.cuti+'h</span>'   : '—') + '</td>' +
      '<td>' + (a.sakit>0 ? '<span class="badge badge-probation">'+a.sakit+'h</span>' : '—') + '</td>' +
      '<td>' + (a.izin>0  ? '<span class="badge badge-gray">'+a.izin+'h</span>'    : '—') + '</td>' +
      '<td>' + (a.alpha>0 ? '<span class="badge badge-resign">'+a.alpha+'h</span>' : '—') + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-weight:700;color:' + clr + '">' + pct + '%</span>' +
        '<div class="progress-bar" style="width:70px"><div class="progress-fill" style="width:' + pct + '%;background:' + bgClr + '"></div></div>' +
      '</div></td></tr>';
  }).join('');
  requestAnimationFrame(() => {
    animateRowsIn(tbody);
    animateProgressBars(document.getElementById('att-table-el'));
  });
  // Render pagination
  if (paginationEl && totalPages > 1) {
    const pages = [];
    if (_attPage > 1) pages.push(`<button onclick="_attGoPage(${_attPage-1})" style="padding:5px 12px;border:1px solid rgba(141,30,24,.2);border-radius:8px;background:white;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif">‹</button>`);
    for (let p = Math.max(1,_attPage-2); p <= Math.min(totalPages,_attPage+2); p++) {
      pages.push(`<button onclick="_attGoPage(${p})" style="padding:5px 12px;border-radius:8px;border:1.5px solid ${p===_attPage?'#8d1e18':'rgba(141,30,24,.2)'};background:${p===_attPage?'#8d1e18':'white'};color:${p===_attPage?'white':'inherit'};cursor:pointer;font-size:12px;font-family:Manrope,sans-serif;font-weight:${p===_attPage?'700':'500'}">${p}</button>`);
    }
    if (_attPage < totalPages) pages.push(`<button onclick="_attGoPage(${_attPage+1})" style="padding:5px 12px;border:1px solid rgba(141,30,24,.2);border-radius:8px;background:white;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif">›</button>`);
    paginationEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;flex-wrap:wrap;gap:8px">
      <div style="font-size:12px;color:#8c6c64">Menampilkan ${startIdx+1}–${Math.min(startIdx+_attPageSize, attData.length)} dari ${attData.length}</div>
      <div style="display:flex;gap:5px">${pages.join('')}</div>
    </div>`;
  } else if (paginationEl) {
    paginationEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;margin-top:10px">${attData.length} karyawan</div>`;
  }
}
window._attGoPage = function(p) { _attPage = p; _renderAttPage(); window.scrollTo({top: document.getElementById('att-table-el')?.offsetTop - 100, behavior:'smooth'}); };
