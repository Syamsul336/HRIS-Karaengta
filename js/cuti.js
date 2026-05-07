// ═══════════════════════════════════════════════════════════
// CUTI.JS — Rekap Cuti Tahunan & Pengajuan (#7)
// ═══════════════════════════════════════════════════════════
import { loadCutiSaldo, upsertCutiSaldo, loadCutiPengajuan, createCutiPengajuan, updateCutiPengajuan, deleteCutiPengajuan } from './supabase.js';
import { animateCount } from './animations.js';

let saldoData    = [];
let pengajuanData= [];
let empData      = [];
let currentTahun = new Date().getFullYear();

export async function initCuti(employees) {
  empData = employees;
  // Isi dropdown tahun
  const selTahun = document.getElementById('cuti-tahun-sel');
  if (selTahun) {
    const now = new Date().getFullYear();
    selTahun.innerHTML = [now+1, now, now-1].map(y =>
      `<option value="${y}" ${y===currentTahun?'selected':''}>${y}</option>`
    ).join('');
    selTahun.onchange = () => { currentTahun = +selTahun.value; refreshCuti(); };
  }
  // Isi dropdown karyawan di modal
  const selEmp = document.getElementById('ct-emp-sel');
  if (selEmp) {
    selEmp.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.map(e => `<option value="${e.employee_id}" data-name="${e.name}">${e.name}</option>`).join('');
  }
  const csSel = document.getElementById('cs-emp-sel');
  if (csSel) {
    csSel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.map(e => `<option value="${e.employee_id}">${e.name}</option>`).join('');
  }
  await refreshCuti();
}

async function refreshCuti() {
  [saldoData, pengajuanData] = await Promise.all([
    loadCutiSaldo(currentTahun),
    loadCutiPengajuan()
  ]);
  _buildStats();
  buildSaldoTable();
  buildPengajuanTable();
}

function _buildStats() {
  const totalJatah   = saldoData.reduce((s, c) => s + c.jatah, 0);
  const totalTerpakai= saldoData.reduce((s, c) => s + c.terpakai, 0);
  const totalSisa    = saldoData.reduce((s, c) => s + c.sisa, 0);
  const pending      = pengajuanData.filter(p => p.status === 'Pending').length;

  const statsEl = document.getElementById('cuti-stats');
  if (!statsEl) return;
  const CARDS = [
    { cls:'kpi-1', label:'Karyawan Tercatat', val:saldoData.length,  id:'ct-st-1' },
    { cls:'kpi-3', label:'Total Jatah (hari)', val:totalJatah,       id:'ct-st-2' },
    { cls:'kpi-4', label:'Sudah Terpakai',     val:totalTerpakai,    id:'ct-st-3' },
    { cls:'kpi-2', label:'Menunggu Persetujuan',val:pending,         id:'ct-st-4' },
  ];
  statsEl.innerHTML = CARDS.map((c,i) =>
    `<div class="stat-card-new ${c.cls} anim-slide-up delay-${i+1}">
      <div class="stat-accent"></div>
      <div class="stat-label-new">${c.label}</div>
      <div class="stat-num-new" id="${c.id}" data-val="${c.val}">0</div>
    </div>`
  ).join('');
  requestAnimationFrame(() => CARDS.forEach(c => animateCount(document.getElementById(c.id), c.val, 800)));
}

export function buildSaldoTable() {
  const tbody = document.getElementById('cuti-saldo-tbody');
  if (!tbody) return;
  if (!saldoData.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#8c6c64;padding:24px">Belum ada data saldo cuti tahun ${currentTahun}. Klik "+ Set Saldo" untuk mulai.</td></tr>`;
    return;
  }
  tbody.innerHTML = saldoData.map((c, i) => {
    const pct = Math.round((c.terpakai / c.jatah) * 100);
    const clr = pct > 90 ? '#8d1e18' : pct > 70 ? '#854d0e' : '#2d6a4f';
    return `<tr>
      <td>${i+1}</td>
      <td><b>${c.employees?.name || c.employee_id}</b><div style="font-size:10px;color:#8c6c64">${c.employee_id} · ${c.employees?.position||''}</div></td>
      <td style="font-weight:700;text-align:center">${c.jatah}</td>
      <td style="font-weight:700;text-align:center;color:#8d1e18">${c.terpakai}</td>
      <td style="font-weight:700;text-align:center;color:${clr}">${c.sisa}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${clr}"></div></div>
          <span style="font-size:11px;color:${clr}">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

export function buildPengajuanTable() {
  const tbody = document.getElementById('cuti-pengajuan-tbody');
  if (!tbody) return;
  if (!pengajuanData.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#8c6c64;padding:24px">Belum ada pengajuan cuti.</td></tr>`;
    return;
  }
  const STATUS_CLS = { Pending:'badge-yellow', Disetujui:'badge-aktif', Ditolak:'badge-resign' };
  tbody.innerHTML = pengajuanData.map((p, i) => `<tr>
    <td>${i+1}</td>
    <td><b>${p.nama||p.employee_id}</b></td>
    <td>${p.jenis_cuti}</td>
    <td>${p.tgl_mulai}</td>
    <td>${p.tgl_selesai}</td>
    <td style="text-align:center;font-weight:700">${p.jumlah_hari} hari</td>
    <td><span class="badge ${STATUS_CLS[p.status]}">${p.status}</span></td>
    <td>
      ${p.status==='Pending' ? `
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#2d6a4f" onclick="window.approveCuti(${p.id},'Disetujui')">✓</button>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.approveCuti(${p.id},'Ditolak')">✗</button>
      ` : ''}
      <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusCuti(${p.id})">Hapus</button>
    </td>
  </tr>`).join('');
}

export async function saveCutiSaldo(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const empId = document.getElementById('cs-emp-sel')?.value;
  const jatah = parseInt(document.getElementById('cs-jatah')?.value) || 12;
  const terpakai = parseInt(document.getElementById('cs-terpakai')?.value) || 0;
  if (!empId) { alert('Pilih karyawan!'); return; }
  try {
    await upsertCutiSaldo({ employee_id: empId, tahun: currentTahun, jatah, terpakai });
    await refreshCuti();
    document.getElementById('modal-cuti-saldo')?.classList.remove('open');
    alert('✅ Saldo cuti disimpan!');
  } catch (e) { alert('❌ ' + e.message); }
}

export async function saveCutiPengajuan(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const empSel = document.getElementById('ct-emp-sel');
  const nama = empSel?.options[empSel.selectedIndex]?.dataset?.name || '';
  const payload = {
    employee_id: g('ct-emp-sel'),
    nama,
    tgl_mulai:   g('ct-tgl-mulai'),
    tgl_selesai: g('ct-tgl-selesai'),
    jenis_cuti:  g('ct-jenis') || 'Tahunan',
    alasan:      g('ct-alasan'),
    status:      'Pending'
  };
  if (!payload.employee_id || !payload.tgl_mulai || !payload.tgl_selesai) {
    alert('Karyawan, tanggal mulai, dan tanggal selesai wajib diisi!'); return;
  }
  try {
    await createCutiPengajuan(payload);
    await refreshCuti();
    document.getElementById('modal-cuti-pengajuan')?.classList.remove('open');
    alert('✅ Pengajuan cuti diajukan!');
  } catch (e) { alert('❌ ' + e.message); }
}

export async function approveCuti(id, status, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  try {
    const p = pengajuanData.find(x => x.id === id);
    await updateCutiPengajuan(id, { status });
    // Jika disetujui, update saldo
    if (status === 'Disetujui' && p) {
      const saldo = saldoData.find(s => s.employee_id === p.employee_id && s.tahun === currentTahun);
      if (saldo) {
        await upsertCutiSaldo({ employee_id: p.employee_id, tahun: currentTahun, jatah: saldo.jatah, terpakai: saldo.terpakai + p.jumlah_hari });
      }
    }
    await refreshCuti();
  } catch (e) { alert('❌ ' + e.message); }
}

export async function hapusCuti(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus pengajuan cuti ini?')) return;
  try { await deleteCutiPengajuan(id); await refreshCuti(); }
  catch (e) { alert('❌ ' + e.message); }
}
