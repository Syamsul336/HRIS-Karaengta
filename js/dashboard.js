// ═══════════════════════════════════════════════════════════
// DASHBOARD.JS — KPI stats, donut chart, bar chart, tables
// ═══════════════════════════════════════════════════════════
import { normalizeStatus, initials, avatarColor } from './utils.js';
import { animateCount, observeReveal, animateBarsIn, animateRowsIn, animateProgressBars, animateDonutIn, runPageAnimations } from './animations.js';
import { getRekStage, stageLabel } from './rekrutmen.js';

export function buildDashboard({ empData, rekData, attData, spData }) {
  // Hitung KPI — status di DB: 'Aktif' / 'Resign' (case-insensitive via normalizeStatus)
  const aktif    = empData.filter(e => normalizeStatus(e.status) === 'aktif').length;
  const resign   = empData.filter(e => normalizeStatus(e.status) === 'resign').length;
  const kandidat = rekData.length;
  const joined   = rekData.filter(r => r.join).length;
  const spCount  = spData.length;

  // Set nilai 0 dulu ke DOM sebelum animasi dimulai
  // (mencegah elemen masih berisi '—' dari HTML awal saat count-up dijalankan)
  const KPI = [
    { id: 'st-aktif',    val: aktif    },
    { id: 'st-resign',   val: resign   },
    { id: 'st-kandidat', val: kandidat },
    { id: 'st-join',     val: joined   },
    { id: 'st-sp',       val: spCount  },
  ];
  KPI.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  });

  // Jalankan animasi di frame berikutnya agar DOM sudah ter-render dengan nilai 0
  requestAnimationFrame(() => {
    KPI.forEach(({ id, val }) => animateCount(document.getElementById(id), val, 900));
  });

  const sub = document.getElementById('st-aktif-sub');
  if (sub) sub.textContent = empData.length + ' total terdaftar';
  const sub2 = document.getElementById('st-kandidat-sub');
  if (sub2) sub2.textContent = joined + ' sudah bergabung';

  _buildDonut(empData);
  _buildBarChart(rekData);
  _buildRecentRek(rekData);
  _buildKontrakExpiry(empData);
  _buildAttDashTable(attData);

  requestAnimationFrame(() => {
    observeReveal();
    runPageAnimations('dashboard');
  });
}

function _buildDonut(empData) {
  const byStatus = {};
  empData.forEach(e => {
    const key = (e.status || '').trim();
    byStatus[key] = (byStatus[key] || 0) + 1;
  });
  const COLORS = { 'Aktif':'#fad442','aktif':'#fad442','Resign':'#8d1e18','resign':'#8d1e18','Probation':'#a93226','probation':'#a93226' };
  const total = empData.length;
  let offset = 0;
  const R = 38, C = 2 * Math.PI * R;
  let circles = '';
  const legend = document.getElementById('donut-legend');
  if (!legend) return;
  legend.innerHTML = '';
  Object.entries(byStatus).forEach(([k, v]) => {
    const pct   = v / total;
    const dash  = pct * C;
    const color = COLORS[k] || '#1d4e89';
    circles += `<circle cx="50" cy="50" r="${R}" fill="none" stroke="${color}" stroke-width="14" stroke-dasharray="${dash} ${C - dash}" stroke-dashoffset="${-offset * C}" transform="rotate(-90 50 50)" style="transition:all .5s"/>`;
    offset  += pct;
    legend.innerHTML += `<div class="legend-item"><div class="legend-dot" style="background:${color}"></div><span>${k}</span><span class="legend-val">${v}</span></div>`;
  });
  const svg = document.getElementById('donut-svg');
  if (svg) {
    svg.setAttribute('width', '110');
    svg.setAttribute('height', '110');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.innerHTML = `<circle cx="50" cy="50" r="${R}" fill="none" stroke="rgba(141,30,24,0.10)" stroke-width="14"/>${circles}`;
  }
}

function _buildBarChart(rekData) {
  const byPos = {};
  rekData.forEach(r => { if (r.posisi) byPos[r.posisi] = (byPos[r.posisi] || 0) + 1; });
  const sorted = Object.entries(byPos).sort((a,b) => b[1]-a[1]).slice(0, 10);
  const maxV   = sorted.length ? sorted[0][1] : 1;
  const BAR_COLORS = ['#8d1e18','#c0392b','#a93226','#fad442','#e6b800','#7a1a14','#e74c3c','#3d0e0a','#d4a017','#8c6c64'];
  const chart    = document.getElementById('posisi-chart');
  const legendEl = document.getElementById('posisi-legend');
  if (!chart || !legendEl) return;
  chart.innerHTML = ''; legendEl.innerHTML = '';
  sorted.forEach(([k, v], i) => {
    const h = Math.max(6, (v / maxV) * 86);
    const c = BAR_COLORS[i % BAR_COLORS.length];
    const shortK = k.length > 14 ? k.slice(0,13)+'…' : k;
    chart.innerHTML +=
      `<div class="bar-item" title="${k}: ${v} kandidat">` +
        `<div class="bar-val" style="color:${c}">${v}</div>` +
        `<div class="bar-track"><div class="bar" data-height="${h}" style="background:${c};border-radius:6px 6px 0 0"></div></div>` +
        `<div class="bar-lbl" title="${k}">${shortK}</div>` +
      `</div>`;
    legendEl.innerHTML += `<div style="display:flex;align-items:center;gap:5px;font-size:11px;overflow:hidden" title="${k}"><div style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0"></div><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px">${k}</span></div>`;
  });
  requestAnimationFrame(() => animateBarsIn(chart));
}

function _buildRecentRek(rekData) {
  const rec = [...rekData]
    .sort((a, b) => new Date(b.update_date.split('/').reverse().join('-')) - new Date(a.update_date.split('/').reverse().join('-')))
    .slice(0, 5);
  const stageColors = { applied:'rgba(141,30,24,.08)', screening:'#FFFDF0', interview:'#e8f5e9', ttd:'#e8f0fe', join:'rgba(141,30,24,.10)' };
  const el = document.getElementById('rek-recent');
  if (!el) return;
  el.innerHTML = rec.map(r => {
    const stage = getRekStage(r);
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(141,30,24,0.08)">
      <div style="width:34px;height:34px;border-radius:10px;background:${stageColors[stage] || 'rgba(141,30,24,.08)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;border:2px solid rgba(141,30,24,.15);color:var(--red)">${initials(r.nama)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.nama}</div>
        <div style="font-size:11px;color:#8c6c64">${r.posisi}</div>
      </div>
      <span class="badge badge-yellow" style="font-size:10px">${stageLabel(stage)}</span>
    </div>`;
  }).join('');
}

function _buildKontrakExpiry(empData) {
  const today    = new Date();
  const expiring = empData.filter(e => {
    if (normalizeStatus(e.status) !== 'aktif') return false;
    if (!e.end_date) return false;
    const d    = new Date(e.end_date);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60;
  }).sort((a, b) => new Date(a.end_date) - new Date(b.end_date));

  const el = document.getElementById('kontrak-expiry');
  if (!el) return;
  el.innerHTML = expiring.length
    ? expiring.map(e => {
        const diff   = Math.round((new Date(e.end_date) - today) / (1000 * 60 * 60 * 24));
        const danger = diff <= 14;
        return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(141,30,24,0.08)">
          <div style="width:10px;height:10px;border-radius:50%;background:${danger ? '#8d1e18' : '#fad442'};flex-shrink:0"></div>
          <div style="flex:1"><div style="font-size:13px;font-weight:700">${e.name}</div>
          <div style="font-size:11px;color:#8c6c64">${e.position}</div></div>
          <span class="badge ${danger ? 'badge-resign' : 'badge-yellow'}" style="font-size:10px">${diff}h lagi</span>
        </div>`;
      }).join('')
    : `<div style="color:var(--text-muted);font-size:13px;padding:8px 0">Tidak ada kontrak yang akan berakhir dalam 60 hari.</div>`;
}

// ── Attendance dashboard table (with month filter + row limit) ──
let _attAllData = [];

function _buildAttDashTable(attData) {
  _attAllData = attData;

  // Populate month filter with unique sorted months
  const bulanSel = document.getElementById('att-filter-bulan');
  const rowsSel  = document.getElementById('att-filter-rows');
  if (bulanSel) {
    const months = [...new Set(attData.map(a => a.bulan))].sort((a, b) => {
      // sort by parse: "Okt (2025)" → try to order chronologically
      const order = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
      const parse = s => { const m = s.match(/(\w+)\s*\((\d+)\)/); return m ? parseInt(m[2]) * 12 + order.indexOf(m[1]) : 0; };
      return parse(a) - parse(b);
    });
    // Clear existing options except the first "Semua Bulan"
    while (bulanSel.options.length > 1) bulanSel.remove(1);
    months.forEach(m => {
      const opt = document.createElement('option'); opt.value = m; opt.textContent = m;
      bulanSel.appendChild(opt);
    });
    // Default to most recent month
    if (months.length > 0) bulanSel.value = months[months.length - 1];

    bulanSel.addEventListener('change', _renderAttTable);
    rowsSel?.addEventListener('change', _renderAttTable);
  }

  _renderAttTable();
}

function _renderAttTable() {
  const bulan    = document.getElementById('att-filter-bulan')?.value || '';
  const rowLimit = parseInt(document.getElementById('att-filter-rows')?.value ?? '10');
  const el       = document.getElementById('att-dash-table');
  if (!el) return;

  let data = bulan ? _attAllData.filter(a => a.bulan === bulan) : _attAllData;
  const total = data.length;
  if (rowLimit > 0) data = data.slice(0, rowLimit);

  const rows = data.map(a => {
    // Gunakan jumlah hari kerja di bulan tersebut (fallback 31)
    const workDays = 31;
    const pct = Math.min(100, Math.round((a.total_hadir / workDays) * 100));
    const clr = pct < 85 ? '#8d1e18' : pct < 95 ? '#8c6c64' : '#2d6a4f';
    return `<tr>
      <td><b>${a.full_name}</b></td>
      <td>${a.total_hadir}</td>
      <td>${a.terlambat > 0 ? `<span class="badge badge-sp1">${a.terlambat}x</span>` : '—'}</td>
      <td>${a.sakit > 0 ? `<span class="badge badge-probation">${a.sakit}h</span>` : '—'}</td>
      <td>${a.alpha > 0 ? `<span class="badge badge-resign">${a.alpha}h</span>` : '—'}</td>
      <td><div style="display:flex;align-items:center;gap:8px">
        <span style="font-weight:700;color:${clr}">${pct}%</span>
        <div class="progress-bar" style="flex:1;max-width:80px">
          <div class="progress-fill" style="width:${pct}%;background:${pct < 85 ? '#8d1e18' : pct < 95 ? '#8c6c64' : '#fad442'}"></div>
        </div>
      </div></td>
    </tr>`;
  }).join('');

  const showing = rowLimit > 0 && rowLimit < total
    ? `<tfoot><tr><td colspan="6" style="text-align:center;font-size:11px;color:var(--text-hint);padding:8px">Menampilkan ${data.length} dari ${total} karyawan</td></tr></tfoot>`
    : '';

  el.innerHTML =
    '<thead><tr><th>Nama</th><th>Hadir</th><th>Terlambat</th><th>Sakit</th><th>Alpha</th><th>Kehadiran %</th></tr></thead>' +
    '<tbody>' + rows + '</tbody>' + showing;
}
