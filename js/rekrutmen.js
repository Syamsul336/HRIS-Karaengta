// ═══════════════════════════════════════════════════════════
// REKRUTMEN.JS — Pipeline sederhana & tabel kandidat
// ═══════════════════════════════════════════════════════════
import { animateRowsIn } from './animations.js';
import { createRecruitment, loadRecruitment, updateRecruitment, deleteRecruitment } from './supabase.js';

// ── 8 TAHAPAN REKRUTMEN ───────────────────────────────────
export const STAGES = [
  { key:'applied',       label:'Applied',        color:'#5c3d2e', bg:'#fdf4ee', pill:'#8c6c64', pillTxt:'#fff' },
  { key:'screening',     label:'Screening CV',   color:'#7a5200', bg:'#fffbeb', pill:'#d97706', pillTxt:'#fff' },
  { key:'psikotest',     label:'Psikotest',      color:'#5b21b6', bg:'#f5f0ff', pill:'#7c3aed', pillTxt:'#fff' },
  { key:'interview_hr',  label:'Interview HR',   color:'#1a5c2a', bg:'#f0faf2', pill:'#16a34a', pillTxt:'#fff' },
  { key:'interview_user',label:'Interview User', color:'#1046a0', bg:'#eff6ff', pill:'#2563eb', pillTxt:'#fff' },
  { key:'training',      label:'Training',       color:'#7c2d00', bg:'#fff8f0', pill:'#ea580c', pillTxt:'#fff' },
  { key:'ttd',           label:'TTD Kontrak',    color:'#1d4e89', bg:'#eff6ff', pill:'#0369a1', pillTxt:'#fff' },
  { key:'join',          label:'Bergabung',      color:'#7a0c07', bg:'#fff1f0', pill:'#8d1e18', pillTxt:'#fff' },
];

// Daftar resmi posisi Karaengta
export const POSISI_LIST = [
  'Admin Operasional','Business Development Executive','Captain Frontliner',
  'Captain Store','Captain Store Bantimurung','Captain Store Batas Kota','Captain Store Tambua',
  'Content Creator','Customer Service (Social Media)','Design Graphic','Driver',
  'Finance Manager','HRD Manager','Internal Audit','Manager Operasional',
  'Marketing Executive','Marketing Manager','Office Boy','Operational Manager',
  'Sales Executive','Social Media Specialist','Staff Accounting','Staff Frontliner',
  'Staff Frontliner (Shift Malam)','Staff General Affair','Staff HRD','Staff Produksi',
  'Staff Purchasing','Staff QC','Supervisor Produksi','Supervisor Store Batas Kota',
  'Supervisor Store Tambua','Supervisor Store/Pelayanan',
  'Supervisor Supply Chain & Production Control','Supervisor Supply Chain Management',
  'Teknisi','Training and Development Officer',
];

export function getRekStage(r) {
  if (r.join || r.join_date)  return 'join';
  if (r.ttd_kontrak)          return 'ttd';
  if (r.training)             return 'training';
  if (r.interview_user)       return 'interview_user';
  if (r.interview_hr)         return 'interview_hr';
  if (r.tes_tertulis)         return 'psikotest';
  if (r.screening_cv)         return 'screening';
  return 'applied';
}

export function stageLabel(key) {
  const s = STAGES.find(s => s.key === key);
  return s ? s.label : key;
}

let rekData      = [];
let rekFilter    = '';
let rekFilterPos = '';

// ── INIT ─────────────────────────────────────────────────
export function initRekrutmen(data) {
  rekData = data;

  // Isi semua dropdown posisi
  ['rek-filter-posisi','f-posisi-sel','fe-posisi-sel'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const isFilter = id.includes('filter');
    sel.innerHTML = `<option value="">${isFilter ? 'Semua Posisi' : '-- Pilih Posisi --'}</option>` +
      POSISI_LIST.map(p => `<option value="${p}">${p}</option>`).join('');
  });

  buildPipeline();
  buildRekTable(rekData);
  const badge = document.getElementById('badge-rekrutmen');
  if (badge) badge.textContent = rekData.length;
}

// ── PIPELINE — desain baru: SEARCH + STAGE TABS + CARDS ──
// ── PIPELINE STATE ──────────────────────────────────────
let _pipelineStage  = 'applied';
let _pipelineSearch = '';
let _pipelineOpenPos = {};   // posisi accordion state: { [posisi]: bool }

export function buildPipeline() {
  const board = document.getElementById('pipeline-board');
  if (!board) return;

  // Count per tahap
  // TTD Kontrak = kumulatif (semua yang sudah ttd, termasuk yang sudah bergabung)
  // Stage lain tetap exclusive (kandidat dihitung hanya di stage tertinggi yang dicapai)
  const counts = {};
  STAGES.forEach(s => counts[s.key] = 0);
  rekData.forEach(r => {
    const s = getRekStage(r);
    if (counts[s] !== undefined) counts[s]++;
    // Jika kandidat sudah Bergabung, ikut dihitung juga di TTD Kontrak
    if (s === 'join' && r.ttd_kontrak) counts['ttd']++;
  });

  board.innerHTML = `
    <div class="pipeline-wrap" style="width:100%">
      <!-- Top bar: search + posisi filter + total -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
        <div style="position:relative;flex:1;min-width:200px;max-width:340px">
          <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#8c6c64;pointer-events:none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
          <input id="pipeline-search-inp" class="search-input" style="padding-left:30px;width:100%;box-sizing:border-box"
            type="text" placeholder="Cari nama kandidat..."
            oninput="window._pipelineFilter(this.value, null)">
        </div>
        <select class="select-filter" id="rek-filter-posisi" onchange="window._pipelineFilter(null, this.value)">
          <option value="">Semua Posisi</option>
        </select>
        <div style="margin-left:auto;font-size:12px;color:#8c6c64;font-weight:600;white-space:nowrap">
          ${rekData.length} kandidat
        </div>
      </div>

      <!-- Stage tabs: wrap into 2 rows naturally -->
      <div id="pipeline-stage-tabs" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid rgba(141,30,24,0.12)">
        ${STAGES.map((s, i) => `
          <button class="pipeline-stab${i===0?' pstab-active':''}"
            onclick="window._switchPipelineStage('${s.key}', this)"
            data-stage="${s.key}"
            style="display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:10px;
                   border:1.5px solid ${i===0?'#8d1e18':'rgba(141,30,24,0.2)'};
                   background:${i===0?'#8d1e18':'white'};
                   color:${i===0?'#fff':'#5c3d2e'};
                   cursor:pointer;font-size:12px;font-weight:700;font-family:Manrope,sans-serif;
                   transition:all .18s;white-space:nowrap;
                   box-shadow:${i===0?'0 2px 8px rgba(141,30,24,0.25)':'none'}">
            <span>${s.label}</span>
            <span style="background:${i===0?'rgba(255,255,255,0.22)':'rgba(141,30,24,0.1)'};
                         color:${i===0?'white':'#8d1e18'};
                         border-radius:20px;padding:1px 8px;font-size:11px;font-weight:800;min-width:22px;text-align:center">${counts[s.key]}</span>
          </button>
        `).join('')}
      </div>

      <!-- Accordion list per posisi -->
      <div id="pipeline-accordion-area">
        ${_buildAccordion('applied', '', {})}
      </div>
    </div>`;

  // init posisi dropdown
  const sel = document.getElementById('rek-filter-posisi');
  if (sel) {
    const posisiInData = [...new Set(rekData.map(r => r.posisi).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Semua Posisi</option>' +
      posisiInData.map(p => `<option value="${p}">${p}</option>`).join('');
    if (rekFilterPos) sel.value = rekFilterPos;
  }
}

// Build vertical accordion layout (no horizontal scroll)
function _buildAccordion(stageKey, search, openState) {
  const stage = STAGES.find(s => s.key === stageKey);
  if (!stage) return '';

  const filtered = rekData.filter(r => {
    // TTD Kontrak bersifat kumulatif: tampilkan yang sudah TTD ATAU sudah Bergabung (asal ttd_kontrak terisi)
    if (stageKey === 'ttd') {
      const inStage = getRekStage(r) === 'ttd' || (getRekStage(r) === 'join' && r.ttd_kontrak);
      if (!inStage) return false;
    } else {
      if (getRekStage(r) !== stageKey) return false;
    }
    if (rekFilterPos && r.posisi !== rekFilterPos) return false;
    if (search && !r.nama.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!filtered.length) {
    return `<div style="text-align:center;padding:48px 24px;color:#bbb">
      <div style="font-size:28px;margin-bottom:8px">🔍</div>
      <div style="font-weight:600;color:#8c6c64">Tidak ada kandidat di tahap ini</div>
      <div style="font-size:12px;color:#bbb;margin-top:4px">Kandidat akan muncul setelah tahap diperbarui</div>
    </div>`;
  }

  // Group by posisi, sort by count desc
  const byPos = {};
  filtered.forEach(r => {
    const p = r.posisi || '—';
    if (!byPos[p]) byPos[p] = [];
    byPos[p].push(r);
  });

  const sorted = Object.entries(byPos).sort((a,b) => b[1].length - a[1].length);

  return sorted.map(([pos, cands], posIdx) => {
    const posId   = 'pacc-' + pos.replace(/[^a-z0-9]/gi,'_') + '-' + posIdx;
    const isOpen  = openState[pos] !== false; // default open for first, closed rest
    const showOpen = posIdx === 0 ? true : (openState[pos] === true);

    // Paginate cards: 25 per page, show page 1 by default
    const pageSize = 25;
    const totalPages = Math.ceil(cands.length / pageSize);
    const pageCands  = cands.slice(0, pageSize);

    return `
    <div class="pipeline-accordion-block" id="${posId}-wrap" style="background:white;border-radius:14px;border:1.5px solid rgba(141,30,24,0.12);margin-bottom:10px;overflow:hidden">
      <!-- Accordion header (always visible) -->
      <div onclick="window._togglePosAccordion('${posId}')"
        style="display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;user-select:none;background:white;transition:background .2s" onmouseover="this.style.background='rgba(141,30,24,0.03)'" onmouseout="this.style.background='white'">
        <div style="width:36px;height:36px;border-radius:10px;background:${stage.pill};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="color:white;font-size:13px;font-weight:800">${cands.length}</span>
        </div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:#1a1a1a">${pos}</div>
          <div style="font-size:11px;color:#8c6c64;margin-top:1px">${cands.length} kandidat · Tahap: ${stage.label}</div>
        </div>
        <div id="${posId}-chevron" style="transition:transform .25s;transform:${showOpen?'rotate(180deg)':'rotate(0deg)'};color:#8c6c64;font-size:18px;font-weight:300">▾</div>
      </div>

      <!-- Accordion body -->
      <div id="${posId}-body" style="overflow:hidden;max-height:${showOpen?'9999px':'0'};transition:max-height .35s ease">
        <div style="padding:8px 14px 16px;background:#faf6f0;border-top:1px solid rgba(141,30,24,0.08)">
          <!-- 2-column card grid -->
          <div id="${posId}-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:${totalPages>1?'14px':'0'}">
            ${pageCands.map(r => _candidateCard(r, stage)).join('')}
          </div>
          ${totalPages > 1 ? `
          <div id="${posId}-pagination" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid rgba(141,30,24,0.08)">
            <span style="font-size:12px;color:#8c6c64">Menampilkan <b>1–${Math.min(pageSize,cands.length)}</b> dari <b>${cands.length}</b></span>
            <div style="display:flex;gap:4px" id="${posId}-pages">
              ${Array.from({length:Math.min(totalPages,5)},(_,i)=>`<button onclick="window._pagePosCards('${posId}',${i+1},${JSON.stringify(cands.map(r=>r.id))},'${stageKey}')" style="padding:4px 9px;border-radius:7px;border:${i===0?'1.5px solid #8d1e18':'1px solid rgba(141,30,24,0.2)'};background:${i===0?'#8d1e18':'white'};color:${i===0?'white':'#303030'};cursor:pointer;font-size:11px;font-family:Manrope,sans-serif;font-weight:${i===0?'700':'500'}">${i+1}</button>`).join('')}
              ${totalPages>5?`<span style="padding:4px 6px;font-size:11px;color:#8c6c64">…${totalPages}</span>`:''}
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function _candidateCard(r, stage) {
  const inits = r.nama.split(' ').slice(0,2).map(w => w[0]||'').join('').toUpperCase();
  const isMaros = r.lokasi?.includes('Dalam');

  return `
  <div onclick="window.openEditRekModal(${r.id})" title="Klik untuk edit"
    style="background:#fff;border-radius:12px;padding:0;cursor:pointer;
           box-shadow:0 1px 4px rgba(141,30,24,0.08);
           border:1.5px solid rgba(141,30,24,0.12);
           transition:all .18s;position:relative;overflow:hidden"
    onmouseover="this.style.boxShadow='0 4px 16px rgba(141,30,24,0.16)';this.style.borderColor='#8d1e18';this.style.transform='translateY(-2px)'"
    onmouseout="this.style.boxShadow='0 1px 4px rgba(141,30,24,0.08)';this.style.borderColor='rgba(141,30,24,0.12)';this.style.transform='translateY(0)'">

    <!-- Top accent bar — app red -->
    <div style="height:3px;background:#8d1e18;border-radius:12px 12px 0 0"></div>

    <div style="padding:13px 14px">
      <!-- Header row -->
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
        <!-- Avatar — red theme -->
        <div style="width:36px;height:36px;border-radius:10px;background:#8d1e18;
                    display:flex;align-items:center;justify-content:center;
                    font-size:12px;font-weight:800;color:#fff;flex-shrink:0;letter-spacing:-.5px">
          ${inits}
        </div>
        <!-- Name & meta -->
        <div style="min-width:0;flex:1">
          <div style="font-weight:700;font-size:13px;color:#1a1a1a;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3">
            ${r.nama}
          </div>
          <div style="font-size:11px;color:#8c6c64;margin-top:2px">
            ${r.umur ? r.umur+' thn' : ''}${r.umur && r.status?' · ':''}${r.status||''}
          </div>
        </div>
        <!-- Delete -->
        <button onclick="event.stopPropagation();window.hapusRek(${r.id})"
          style="background:transparent;border:none;color:#ccc;cursor:pointer;
                 padding:2px 6px;font-size:14px;border-radius:6px;flex-shrink:0;
                 transition:all .15s;line-height:1"
          onmouseover="this.style.background='rgba(141,30,24,0.08)';this.style.color='#8d1e18'"
          onmouseout="this.style.background='transparent';this.style.color='#ccc'"
          title="Hapus">×</button>
      </div>

      <!-- Tags row -->
      <div style="display:flex;align-items:center;gap:5px;margin-bottom:10px;flex-wrap:wrap">
        <span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#8c6c64">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
          ${r.applied||'—'}
        </span>
        <span style="font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;
                     background:${isMaros?'rgba(141,30,24,0.1)':'rgba(141,30,24,0.06)'};
                     color:${isMaros?'#8d1e18':'#5c3d2e'};
                     border:1px solid ${isMaros?'rgba(141,30,24,0.25)':'rgba(141,30,24,0.12)'}">
          ${isMaros?'Maros':'Luar Maros'}
        </span>
      </div>

      <!-- Stage dropdown — styled to match app -->
      <select style="font-size:11px;padding:6px 10px;width:100%;
                     background:#fff8f3;border:1.5px solid rgba(141,30,24,0.2);
                     border-radius:8px;font-family:Manrope,sans-serif;
                     color:#5c3d2e;cursor:pointer;outline:none;font-weight:600"
        onclick="event.stopPropagation()"
        onchange="window.updateRekStage(${r.id}, this.value)"
        onfocus="this.style.borderColor='#8d1e18'"
        onblur="this.style.borderColor='rgba(141,30,24,0.2)'">
        ${STAGES.map(s => `<option value="${s.key}" ${getRekStage(r)===s.key?'selected':''}>${s.label}</option>`).join('')}
      </select>
    </div>
  </div>`;
}

// ── TABEL REKRUTMEN ──────────────────────────────────────
let _rekTableData     = [];
let _rekTablePage     = 1;
let _rekTablePageSize = 50;

export function buildRekTable(data) {
  _rekTableData = data;
  _rekTablePage = 1;
  _renderRekTablePage();
}

// ── WINDOW FUNCTIONS (dipanggil dari inline HTML) ─────────
window._switchPipelineStage = function(stageKey, btn) {
  _pipelineStage = stageKey;
  // Style semua tombol
  document.querySelectorAll('.pipeline-stab').forEach(b => {
    const active = b.dataset.stage === stageKey;
    b.style.background  = active ? '#8d1e18' : 'white';
    b.style.borderColor = active ? '#8d1e18' : 'rgba(141,30,24,0.2)';
    b.style.color       = active ? '#fff'    : '#5c3d2e';
    b.style.boxShadow   = active ? '0 2px 8px rgba(141,30,24,0.25)' : 'none';
    b.classList.toggle('pstab-active', active);
    const badge = b.querySelector('span:last-child');
    if (badge) {
      badge.style.background = active ? 'rgba(255,255,255,0.22)' : 'rgba(141,30,24,0.1)';
      badge.style.color      = active ? 'white' : '#8d1e18';
    }
  });
  // Render accordion untuk stage baru
  const area = document.getElementById('pipeline-accordion-area');
  if (area) area.innerHTML = _buildAccordion(stageKey, _pipelineSearch, _pipelineOpenPos);
  // Sinkronisasi search input
  const inp = document.getElementById('pipeline-search-inp');
  if (inp) inp.value = _pipelineSearch;
};

window._pipelineFilter = function(search, posisi) {
  if (search !== null) _pipelineSearch = search;
  if (posisi !== null) rekFilterPos = posisi;
  const area = document.getElementById('pipeline-accordion-area');
  if (area) area.innerHTML = _buildAccordion(_pipelineStage, _pipelineSearch, _pipelineOpenPos);
};

window._togglePosAccordion = function(posId) {
  const body    = document.getElementById(posId + '-body');
  const chevron = document.getElementById(posId + '-chevron');
  if (!body) return;
  const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '0';
  body.style.maxHeight    = isOpen ? '0' : '9999px';
  if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
};

window._pagePosCards = function(posId, page, ids, stageKey) {
  const pageSize = 25;
  const stage    = STAGES.find(s => s.key === stageKey);
  if (!stage) return;
  const allCands = rekData.filter(r => ids.includes(r.id));
  const pageCands = allCands.slice((page-1)*pageSize, page*pageSize);
  const grid = document.getElementById(posId + '-grid');
  if (grid) grid.innerHTML = pageCands.map(r => _candidateCard(r, stage)).join('');
  // Update page button styles
  const pagesEl = document.getElementById(posId + '-pages');
  if (pagesEl) {
    pagesEl.querySelectorAll('button').forEach((btn, i) => {
      const p = i + 1;
      const active = p === page;
      btn.style.background  = active ? '#8d1e18' : 'white';
      btn.style.borderColor = active ? '#8d1e18' : 'rgba(141,30,24,0.2)';
      btn.style.color       = active ? 'white'   : '#303030';
      btn.style.fontWeight  = active ? '700'     : '500';
    });
  }
};

function _renderRekTablePage() {
  const data = _rekTableData;
  const tbody = document.getElementById('rek-tbody');
  const pagEl = document.getElementById('rek-table-pagination');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#8c6c64;padding:28px">Tidak ada kandidat.</td></tr>`;
    if (pagEl) pagEl.innerHTML = '';
    return;
  }
  const totalPages = Math.ceil(data.length / _rekTablePageSize);
  const startIdx = (_rekTablePage - 1) * _rekTablePageSize;
  const pageData = data.slice(startIdx, startIdx + _rekTablePageSize);

  tbody.innerHTML = pageData.map((r, i) => {
    const stage = STAGES.find(s => s.key === getRekStage(r)) || STAGES[0];
    return `<tr>
      <td>${startIdx + i + 1}</td>
      <td><b>${r.nama}</b><div style="font-size:10px;color:#8c6c64">${r.umur||''}${r.umur?' thn':''} · ${r.status||''}</div></td>
      <td style="font-size:12px">${r.posisi||'—'}</td>
      <td style="font-size:11px">${r.applied||'—'}</td>
      <td style="font-size:11px">${r.lokasi?.includes('Dalam')?'Maros':'Luar Maros'}</td>
      <td><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;background:${stage.pill};color:#fff">● ${stage.label}</span></td>
      <td>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px" onclick="window.openEditRekModal(${r.id})">Edit</button>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusRek(${r.id})">Hapus</button>
      </td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));

  // Pagination
  if (pagEl && totalPages > 1) {
    const pages = [];
    if (_rekTablePage > 1) pages.push(`<button onclick="window._rekGoPage(${_rekTablePage-1})" style="${_pagBtnStyle(false)}">‹ Prev</button>`);
    for (let p = Math.max(1,_rekTablePage-2); p <= Math.min(totalPages,_rekTablePage+2); p++) {
      pages.push(`<button onclick="window._rekGoPage(${p})" style="${_pagBtnStyle(p===_rekTablePage)}">${p}</button>`);
    }
    if (_rekTablePage < totalPages) pages.push(`<button onclick="window._rekGoPage(${_rekTablePage+1})" style="${_pagBtnStyle(false)}">Next ›</button>`);
    pagEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;flex-wrap:wrap;gap:8px">
      <div style="font-size:12px;color:#8c6c64">Menampilkan <b>${startIdx+1}–${Math.min(startIdx+_rekTablePageSize, data.length)}</b> dari <b>${data.length}</b> kandidat</div>
      <div style="display:flex;gap:5px">${pages.join('')}</div>
    </div>`;
  } else if (pagEl) {
    pagEl.innerHTML = `<div style="font-size:12px;color:#8c6c64;padding:8px 0">${data.length} kandidat</div>`;
  }
}

function _pagBtnStyle(active) {
  return active
    ? 'padding:5px 12px;border-radius:8px;border:1.5px solid #8d1e18;background:#8d1e18;color:white;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif;font-weight:700'
    : 'padding:5px 12px;border-radius:8px;border:1px solid rgba(141,30,24,.2);background:white;color:#303030;cursor:pointer;font-size:12px;font-family:Manrope,sans-serif';
}
window._rekGoPage = function(p) { _rekTablePage = p; _renderRekTablePage(); };

export function switchRekTab(name, el) {
  document.querySelectorAll('#page-rekrutmen .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('rek-pipeline').classList.toggle('active', name==='pipeline');
  document.getElementById('rek-table').classList.toggle('active', name==='table');
  if (name === 'table') requestAnimationFrame(() => animateRowsIn(document.getElementById('rek-tbody')));
}

export function filterRek(v) { rekFilter = v.toLowerCase(); _applyFilter(); }
export function filterRekPos(v) { rekFilterPos = v; buildPipeline(); _applyFilter(); }
function _applyFilter() {
  const f = rekData.filter(r =>
    (!rekFilter    || r.nama.toLowerCase().includes(rekFilter)) &&
    (!rekFilterPos || r.posisi === rekFilterPos)
  );
  buildRekTable(f);
}

// ── TAMBAH KANDIDAT ───────────────────────────────────────
export async function saveKandidat(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g  = id => document.getElementById(id)?.value?.trim() || '';
  const nama   = g('f-nama');
  const posisi = g('f-posisi-sel') || g('f-posisi');
  if (!nama || !posisi) { alert('Nama dan posisi wajib diisi!'); return; }
  const today  = new Date().toISOString().slice(0,10);
  const payload = {
    nama, posisi,
    alamat_domisili:    g('f-alamat'),
    umur:               parseInt(g('f-umur')) || null,
    status:             g('f-status') || 'Belum Menikah',
    pengumpulan_berkas: g('f-berkas') || 'Online',
    lokasi:             g('f-lokasi') || 'Luar Kabupaten Maros',
    applied:            g('f-applied') || today,
    no_telepon:         g('f-telepon') || null,
    email:              g('f-email')   || null,
    gender:             g('f-gender')  || null,
    sumber_lamaran:     g('f-sumber')  || null,
    create_date:        today, update_date: today,
  };
  try {
    await createRecruitment(payload);
    rekData = await loadRecruitment();
    buildPipeline();
    buildRekTable(rekData);
    document.getElementById('badge-rekrutmen').textContent = rekData.length;
    document.getElementById('modal-rek')?.classList.remove('open');
    ['f-nama','f-alamat','f-umur','f-applied'].forEach(id => { const el=document.getElementById(id); if(el)el.value=''; });
  } catch(e) { alert('❌ Gagal: ' + e.message); }
}

// ── EDIT KANDIDAT ─────────────────────────────────────────
let _editingRekId = null;
export function openEditRekModal(id) {
  _editingRekId = id;
  const r = rekData.find(x => x.id === id);
  if (!r) return;
  const setVal = (elId, val) => { const el=document.getElementById(elId); if(el) el.value=val||''; };
  setVal('fe-nama', r.nama);
  const fePos = document.getElementById('fe-posisi-sel');
  if (fePos) fePos.value = r.posisi || '';
  setVal('fe-alamat', r.alamat_domisili);
  setVal('fe-umur', r.umur);
  setVal('fe-status', r.status || 'Belum Menikah');
  setVal('fe-berkas', r.pengumpulan_berkas || 'Online');
  // New fields
  setVal('fe-telepon',    r.no_telepon     || '');
  setVal('fe-email',      r.email          || '');
  setVal('fe-gender',     r.gender         || '');
  setVal('fe-sumber',     r.sumber_lamaran || '');
  setVal('fe-skor-tes',   r.skor_tes       || '');
  setVal('fe-interviewer',r.interviewer    || '');
  setVal('fe-alasan',     r.alasan_penolakan || '');
  // Tanggal tahapan
  const stageMap = { 'fe-screening-cv': r.screening_cv, 'fe-tes-tertulis': r.tes_tertulis,
    'fe-interview-hr': r.interview_hr, 'fe-interview-user': r.interview_user,
    'fe-training': r.training, 'fe-ttd-kontrak': r.ttd_kontrak, 'fe-join-date': r.join||r.join_date };
  Object.entries(stageMap).forEach(([elId, val]) => {
    const el = document.getElementById(elId);
    if (el && val) el.value = val.includes('/') ? val.split('/').reverse().join('-') : val.slice(0,10);
  });
  document.getElementById('modal-rek-edit')?.classList.add('open');
}

export async function saveEditRek(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const nullIfEmpty = v => v || null;
  const payload = {
    nama:               g('fe-nama'),
    posisi:             g('fe-posisi-sel') || g('fe-posisi'),
    alamat_domisili:    g('fe-alamat'),
    umur:               parseInt(g('fe-umur')) || null,
    status:             g('fe-status'),
    pengumpulan_berkas: g('fe-berkas'),
    update_date:        new Date().toISOString().slice(0,10),
    // Stage dates
    screening_cv:       nullIfEmpty(g('fe-screening-cv')),
    tes_tertulis:       nullIfEmpty(g('fe-tes-tertulis')),
    interview_hr:       nullIfEmpty(g('fe-interview-hr')),
    interview_user:     nullIfEmpty(g('fe-interview-user')),
    training:           nullIfEmpty(g('fe-training')),
    ttd_kontrak:        nullIfEmpty(g('fe-ttd-kontrak')),
    join_date:          nullIfEmpty(g('fe-join-date')),
    // New fields
    no_telepon:         g('fe-telepon')      || null,
    email:              g('fe-email')        || null,
    gender:             g('fe-gender')       || null,
    sumber_lamaran:     g('fe-sumber')       || null,
    skor_tes:           parseInt(g('fe-skor-tes')) || null,
    interviewer:        g('fe-interviewer')  || null,
    alasan_penolakan:   g('fe-alasan')       || null,
  };
  if (!payload.nama) { alert('Nama wajib diisi!'); return; }
  try {
    await updateRecruitment(_editingRekId, payload);
    rekData = await loadRecruitment();
    buildPipeline();
    buildRekTable(rekData);
    document.getElementById('badge-rekrutmen').textContent = rekData.length;
    document.getElementById('modal-rek-edit')?.classList.remove('open');
  } catch(e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusRek(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const r = rekData.find(x => x.id === id);
  if (!confirm(`Hapus kandidat "${r?.nama||id}"?`)) return;
  try {
    await deleteRecruitment(id);
    rekData = rekData.filter(x => x.id !== id);
    buildPipeline();
    buildRekTable(rekData);
    document.getElementById('badge-rekrutmen').textContent = rekData.length;
  } catch(e) { alert('❌ ' + e.message); }
}

export async function updateRekStage(id, stageKey, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const r = rekData.find(x => x.id === id);
  if (!r) return;
  const today = new Date().toISOString().slice(0, 10);
  const fieldMap = {
    screening:      { screening_cv: today },
    psikotest:      { tes_tertulis: today },
    interview_hr:   { interview_hr: today },
    interview_user: { interview_user: today },
    training:       { training: today },
    ttd:            { ttd_kontrak: today },
    join:           { join: today },
  };
  const payload = fieldMap[stageKey] || {};
  try {
    const updated = await updateRecruitment(id, { ...payload, update_date: today });
    const idx = rekData.findIndex(x => x.id === id);
    if (idx !== -1) rekData[idx] = { ...rekData[idx], ...updated };
    buildPipeline();
  } catch(e) { alert('❌ Gagal update tahap: ' + e.message); }
}
