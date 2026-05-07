// ═══════════════════════════════════════════════════════════
// ANALYTICS.JS — Dashboard Analitik dengan Chart.js (#8)
// ═══════════════════════════════════════════════════════════
import { loadAnalyticsData } from './supabase.js';

let charts = {};

export async function initAnalytics() {
  try {
    const data = await loadAnalyticsData();
    _renderKpiCards(data);
    // Render charts setelah CDN Chart.js siap
    if (window.Chart) {
      _renderAllCharts(data);
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = () => _renderAllCharts(data);
      document.head.appendChild(s);
    }
  } catch (e) {
    console.error('Analytics error:', e);
    const el = document.getElementById('analytics-error');
    if (el) { el.style.display='block'; el.textContent = 'Gagal memuat data analitik: ' + e.message; }
  }
}

function _renderKpiCards(data) {
  const { emp, rek } = data;
  const aktif  = emp.filter(e => (e.status||'').toLowerCase() === 'aktif').length;
  const resign = emp.filter(e => (e.status||'').toLowerCase() === 'resign').length;
  const turnover = emp.length ? Math.round((resign / emp.length) * 100) : 0;
  const avgHadir = data.att.length
    ? Math.round(data.att.reduce((s,a) => s+(a.total_hadir||0), 0) / data.att.length)
    : 0;

  const el = document.getElementById('analytics-kpi');
  if (!el) return;
  el.innerHTML = [
    { label:'Total Karyawan', val:emp.length,    sub:'Aktif: '+aktif,         cls:'kpi-1' },
    { label:'Turnover Rate',  val:turnover+'%',  sub:resign+' resign',         cls:'kpi-2' },
    { label:'Total Rekrutmen',val:rek.length,    sub:'Pipeline aktif',         cls:'kpi-3' },
    { label:'Rata-rata Hadir',val:avgHadir+' hr',sub:'per bulan per karyawan', cls:'kpi-4' },
  ].map((c,i) => `<div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
    <div class="stat-accent"></div>
    <div class="stat-label-new">${c.label}</div>
    <div class="stat-num-new" style="font-size:28px">${c.val}</div>
    <div class="stat-sub-new">${c.sub}</div>
  </div>`).join('');
}

function _destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

function _renderAllCharts(data) {
  _chartRekrutmenTren(data.rek);
  _chartStatusKaryawan(data.emp);
  _chartDistribusiOrg(data.emp);
  _chartKehadiran(data.att);
  _chartSP(data.sp);
  _chartKpiSkor(data.kpi);
}

const MERAH   = '#8D1E18';
const KUNING  = '#FAD442';
const HIJAU   = '#2d6a4f';
const BIRU    = '#1d4e89';
const ORANGE  = '#854d0e';

function _chartRekrutmenTren(rek) {
  _destroyChart('tren');
  const ctx = document.getElementById('chart-rekrutmen-tren');
  if (!ctx) return;
  // Group by bulan applied
  const byBulan = {};
  rek.forEach(r => {
    if (!r.applied) return;
    const key = r.applied.slice(0,7); // "2025-10"
    byBulan[key] = (byBulan[key]||0) + 1;
  });
  const labels = Object.keys(byBulan).sort().slice(-12);
  const vals   = labels.map(k => byBulan[k]);
  const labelsNice = labels.map(k => {
    const [y,m] = k.split('-');
    return new Date(+y,+m-1,1).toLocaleDateString('id-ID',{month:'short',year:'2-digit'});
  });
  charts.tren = new Chart(ctx, {
    type: 'bar',
    data: { labels: labelsNice, datasets: [{ label:'Kandidat Masuk', data: vals, backgroundColor: MERAH, borderRadius: 6 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
      scales:{ x:{ grid:{ display:false } }, y:{ beginAtZero:true, ticks:{ stepSize:1 } } } }
  });
}

function _chartStatusKaryawan(emp) {
  _destroyChart('status');
  const ctx = document.getElementById('chart-status-karyawan');
  if (!ctx) return;
  const byStatus = {};
  emp.forEach(e => { const k=(e.status||'Tidak Diketahui').trim(); byStatus[k]=(byStatus[k]||0)+1; });
  const COLORS = { Aktif:HIJAU, Resign:MERAH, Cuti:KUNING, Suspend:ORANGE };
  const labels = Object.keys(byStatus);
  charts.status = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets:[{ data: labels.map(k=>byStatus[k]),
      backgroundColor: labels.map(k=>COLORS[k]||BIRU), borderWidth:2, borderColor:'#fff' }] },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{ font:{ size:12 } } } } }
  });
}

function _chartDistribusiOrg(emp) {
  _destroyChart('org');
  const ctx = document.getElementById('chart-distribusi-org');
  if (!ctx) return;
  const byOrg = {};
  emp.forEach(e => { const k=e.organization_name||'Lainnya'; byOrg[k]=(byOrg[k]||0)+1; });
  const labels = Object.keys(byOrg);
  const PALETTE = [MERAH, KUNING, HIJAU, BIRU, ORANGE, '#8E44AD','#16A085'];
  charts.org = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets:[{ label:'Karyawan', data: labels.map(k=>byOrg[k]),
      backgroundColor: labels.map((_,i)=>PALETTE[i%PALETTE.length]), borderRadius:6 }] },
    options: { indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true } } }
  });
}

function _chartKehadiran(att) {
  _destroyChart('att');
  const ctx = document.getElementById('chart-kehadiran');
  if (!ctx) return;
  const byBulan = {};
  att.forEach(a => {
    if (!byBulan[a.bulan]) byBulan[a.bulan] = { hadir:0, alpha:0, terlambat:0, n:0 };
    byBulan[a.bulan].hadir    += a.total_hadir||0;
    byBulan[a.bulan].alpha    += a.alpha||0;
    byBulan[a.bulan].terlambat+= a.terlambat||0;
    byBulan[a.bulan].n++;
  });
  const labels = Object.keys(byBulan).sort().slice(-6);
  charts.att = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets:[
      { label:'Rata Hadir', data: labels.map(k=>byBulan[k].n?Math.round(byBulan[k].hadir/byBulan[k].n):0),
        borderColor:HIJAU, backgroundColor:HIJAU+'22', fill:true, tension:.4 },
      { label:'Rata Alpha', data: labels.map(k=>byBulan[k].n?Math.round(byBulan[k].alpha/byBulan[k].n):0),
        borderColor:MERAH, backgroundColor:MERAH+'22', fill:true, tension:.4 },
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'top' } }, scales:{ y:{ beginAtZero:true } } }
  });
}

function _chartSP(sp) {
  _destroyChart('sp');
  const ctx = document.getElementById('chart-sp');
  if (!ctx) return;
  const bySP = { 'SP 1':0, 'SP 2':0, 'SP 3':0 };
  sp.forEach(s => { if (bySP[s.jenis_sp]!==undefined) bySP[s.jenis_sp]++; });
  charts.sp = new Chart(ctx, {
    type: 'doughnut',
    data: { labels:['SP 1','SP 2','SP 3'],
      datasets:[{ data:[bySP['SP 1'],bySP['SP 2'],bySP['SP 3']],
        backgroundColor:[KUNING, ORANGE, MERAH], borderWidth:2, borderColor:'#fff' }] },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right' } } }
  });
}

function _chartKpiSkor(kpi) {
  _destroyChart('kpi');
  const ctx = document.getElementById('chart-kpi-skor');
  if (!ctx) return;
  if (!kpi.length) { ctx.closest('.card').style.display='none'; return; }
  // Distribusi predikat
  const PRED = { A:0, B:0, C:0, D:0 };
  kpi.forEach(k => {
    const s = k.skor_total||0;
    if (s>=85) PRED.A++; else if (s>=70) PRED.B++; else if (s>=55) PRED.C++; else PRED.D++;
  });
  charts.kpi = new Chart(ctx, {
    type: 'bar',
    data: { labels:['A (≥85)','B (≥70)','C (≥55)','D (<55)'],
      datasets:[{ label:'Karyawan', data:[PRED.A,PRED.B,PRED.C,PRED.D],
        backgroundColor:[HIJAU,BIRU,KUNING,MERAH], borderRadius:6 }] },
    options: { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 } } } }
  });
}
