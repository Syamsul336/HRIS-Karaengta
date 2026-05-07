// ═══════════════════════════════════════════════════════════
// PAYROLL.JS — Kalkulasi gaji, slip gaji, export Excel
// ═══════════════════════════════════════════════════════════
import { animateCount } from './animations.js';
import { loadPayroll, upsertPayroll, deletePayroll, loadAttendanceByBulan } from './supabase.js';

let payrollData = [];
let empData     = [];
let currentBulan = '';

export function initPayroll(employees, bulanList) {
  empData = employees;

  const sel = document.getElementById('payroll-bulan-sel');
  if (!sel) { _buildStats([]); _buildTable([]); return; }

  sel.innerHTML = '<option value="">-- Pilih Bulan --</option>';
  bulanList.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    sel.appendChild(opt);
  });
  sel.onchange = () => loadPayrollBulan(sel.value);

  // Auto-select bulan terbaru agar stat cards langsung terisi
  if (bulanList.length > 0) {
    const latest = bulanList[bulanList.length - 1];
    sel.value = latest;
    loadPayrollBulan(latest);
  } else {
    _buildStats([]);
    _buildTable([]);
  }
}

export async function loadPayrollBulan(bulan) {
  if (!bulan) return;
  currentBulan = bulan;
  try {
    payrollData = await loadPayroll(bulan);
    _buildStats(payrollData);
    _buildTable(payrollData);
  } catch (e) {
    alert('Gagal load payroll: ' + e.message);
  }
}

function _buildStats(data) {
  const totalBersih  = data.reduce((s, p) => s + (p.gaji_bersih || 0), 0);
  const totalPokok   = data.reduce((s, p) => s + (p.gaji_pokok  || 0), 0);
  const totalPotongan= data.reduce((s, p) => s + (p.total_potongan || 0), 0);
  const countFinal   = data.filter(p => p.status === 'final').length;

  const fmt = n => 'Rp ' + n.toLocaleString('id-ID');

  const els = [
    { id: 'pay-st-karyawan', val: data.length,     fmt: v => v, label: 'Karyawan' },
    { id: 'pay-st-total',    val: totalBersih,      fmt: fmt,    label: 'Total Gaji Bersih' },
    { id: 'pay-st-pokok',    val: totalPokok,       fmt: fmt,    label: 'Total Gaji Pokok' },
    { id: 'pay-st-potongan', val: totalPotongan,    fmt: fmt,    label: 'Total Potongan' },
  ];

  const statsEl = document.getElementById('pay-stats');
  if (!statsEl) return;

  const COLORS = ['kpi-1','kpi-3','kpi-4','kpi-2'];
  statsEl.innerHTML = els.map((e, i) =>
    `<div class="stat-card-new ${COLORS[i]} anim-slide-up delay-${i+1}">
      <div class="stat-accent"></div>
      <div class="stat-label-new">${e.label}</div>
      <div class="stat-num-new" id="${e.id}" data-val="${e.val}" style="font-size:${e.val > 999999 ? '22px' : '38px'}">${e.fmt(e.val)}</div>
    </div>`
  ).join('');
}

function _buildTable(data) {
  const tbody = document.getElementById('pay-tbody');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#8c6c64;padding:32px">
      ${currentBulan ? 'Belum ada data payroll untuk ' + currentBulan + '. Klik "+ Input Gaji" untuk mulai.' : 'Pilih bulan terlebih dahulu.'}
    </td></tr>`;
    return;
  }

  const fmt = n => 'Rp ' + (n||0).toLocaleString('id-ID');
  tbody.innerHTML = data.map((p, i) => `<tr>
    <td>${i+1}</td>
    <td><b>${p.full_name}</b><div style="font-size:11px;color:#8c6c64">${p.employee_id}</div></td>
    <td>${fmt(p.gaji_pokok)}</td>
    <td>${fmt(p.tunjangan_makan + p.tunjangan_transport + p.tunjangan_lain)}</td>
    <td style="color:#8d1e18">${fmt(p.total_potongan)}</td>
    <td style="font-weight:700;color:#2d6a4f">${fmt(p.gaji_bersih)}</td>
    <td><span class="badge ${p.status === 'final' ? 'badge-aktif' : 'badge-yellow'}">${p.status === 'final' ? 'Final' : 'Draft'}</span></td>
    <td>
      <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px" onclick="window.openSlipGaji(${p.id})">Slip</button>
      <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px" onclick="window.openEditPayroll(${p.id})">Edit</button>
      <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;color:#8d1e18" onclick="window.hapusPayroll(${p.id})">Hapus</button>
    </td>
  </tr>`).join('');
}

// ── MODAL INPUT GAJI ──────────────────────────────────────
export function openInputGajiModal(employees) {
  const modal = document.getElementById('modal-payroll');
  if (!modal) return;

  // Isi dropdown karyawan
  const sel = document.getElementById('pay-emp-sel');
  if (sel) {
    sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>';
    employees.filter(e => e.status === 'Aktif').forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.employee_id;
      opt.dataset.name = e.name;
      opt.textContent = `${e.name} (${e.employee_id})`;
      sel.appendChild(opt);
    });
  }

  // Set bulan default ke bulan terpilih
  const bulanEl = document.getElementById('pay-bulan-input');
  if (bulanEl && currentBulan) bulanEl.value = currentBulan;

  // Reset form
  ['pay-gaji-pokok','pay-tj-makan','pay-tj-transport','pay-tj-lain',
   'pay-pot-bpjs-kes','pay-pot-bpjs-tk','pay-pot-alpha','pay-pot-telat','pay-pot-lain']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });

  modal.classList.add('open');
}

export async function savePayroll(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }

  const sel   = document.getElementById('pay-emp-sel');
  const empId = sel?.value;
  const empName = sel?.options[sel.selectedIndex]?.dataset?.name || '';
  const bulan = document.getElementById('pay-bulan-input')?.value?.trim();

  if (!empId || !bulan) { alert('Pilih karyawan dan isi bulan!'); return; }

  const g  = id => parseInt(document.getElementById(id)?.value) || 0;
  const gp = g('pay-gaji-pokok');

  const payload = {
    employee_id: empId, full_name: empName, bulan,
    gaji_pokok: gp,
    tunjangan_makan:     g('pay-tj-makan'),
    tunjangan_transport: g('pay-tj-transport'),
    tunjangan_lain:      g('pay-tj-lain'),
    potongan_bpjs_kes:   g('pay-pot-bpjs-kes'),
    potongan_bpjs_tk:    g('pay-pot-bpjs-tk'),
    potongan_alpha:      g('pay-pot-alpha'),
    potongan_telat:      g('pay-pot-telat'),
    potongan_lain:       g('pay-pot-lain'),
    status: 'draft'
  };

  try {
    await upsertPayroll(payload);
    document.getElementById('modal-payroll').classList.remove('open');
    await loadPayrollBulan(bulan);
    alert('✅ Data gaji berhasil disimpan!');
  } catch (e) {
    alert('❌ Gagal simpan: ' + e.message);
  }
}

export async function hapusPayroll(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus data gaji ini?')) return;
  try {
    await deletePayroll(id);
    await loadPayrollBulan(currentBulan);
  } catch (e) {
    alert('❌ Gagal hapus: ' + e.message);
  }
}

// ── SLIP GAJI (cetak/print) ───────────────────────────────
export function openSlipGaji(id) {
  const p = payrollData.find(x => x.id === id);
  if (!p) return;
  const fmt = n => 'Rp ' + (n||0).toLocaleString('id-ID');

  const slip = `
    <html><head><title>Slip Gaji</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #222; max-width: 600px; margin: 0 auto; }
      h2 { color: #8d1e18; border-bottom: 2px solid #8d1e18; padding-bottom: 8px; }
      .row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
      .total { font-weight: bold; font-size: 16px; color: #2d6a4f; }
      .section { margin: 16px 0 8px; font-weight: bold; color: #555; font-size: 13px; text-transform: uppercase; }
    </style></head><body>
    <h2>Slip Gaji — ${p.bulan}</h2>
    <div class="row"><span>Nama</span><b>${p.full_name}</b></div>
    <div class="row"><span>ID Karyawan</span><span>${p.employee_id}</span></div>
    <div class="row"><span>Status</span><span>${p.status.toUpperCase()}</span></div>
    <div class="section">Pendapatan</div>
    <div class="row"><span>Gaji Pokok</span><span>${fmt(p.gaji_pokok)}</span></div>
    <div class="row"><span>Tunjangan Makan</span><span>${fmt(p.tunjangan_makan)}</span></div>
    <div class="row"><span>Tunjangan Transport</span><span>${fmt(p.tunjangan_transport)}</span></div>
    <div class="row"><span>Tunjangan Lain</span><span>${fmt(p.tunjangan_lain)}</span></div>
    <div class="row"><span><b>Total Pendapatan</b></span><b>${fmt(p.total_pendapatan)}</b></div>
    <div class="section">Potongan</div>
    <div class="row"><span>BPJS Kesehatan</span><span>${fmt(p.potongan_bpjs_kes)}</span></div>
    <div class="row"><span>BPJS Ketenagakerjaan</span><span>${fmt(p.potongan_bpjs_tk)}</span></div>
    <div class="row"><span>Potongan Alpha</span><span>${fmt(p.potongan_alpha)}</span></div>
    <div class="row"><span>Potongan Telat</span><span>${fmt(p.potongan_telat)}</span></div>
    <div class="row"><span>Potongan Lain</span><span>${fmt(p.potongan_lain)}</span></div>
    <div class="row"><span><b>Total Potongan</b></span><b style="color:#8d1e18">${fmt(p.total_potongan)}</b></div>
    <div class="row total"><span>GAJI BERSIH</span><span>${fmt(p.gaji_bersih)}</span></div>
    ${p.catatan ? `<div style="margin-top:16px;font-size:12px;color:#666">Catatan: ${p.catatan}</div>` : ''}
    </body></html>`;

  const win = window.open('', '_blank');
  win.document.write(slip);
  win.document.close();
  win.print();
}

// ── EXPORT EXCEL PAYROLL ──────────────────────────────────
export function exportPayrollExcel() {
  if (!payrollData.length) { alert('Tidak ada data untuk diekspor.'); return; }
  const fmt = n => n || 0;
  const rows = [
    ['No','ID','Nama','Bulan','Gaji Pokok','Tj. Makan','Tj. Transport','Tj. Lain',
     'Total Pendapatan','Pot. BPJS Kes','Pot. BPJS TK','Pot. Alpha','Pot. Telat','Pot. Lain',
     'Total Potongan','Gaji Bersih','Status'],
    ...payrollData.map((p, i) => [
      i+1, p.employee_id, p.full_name, p.bulan,
      fmt(p.gaji_pokok), fmt(p.tunjangan_makan), fmt(p.tunjangan_transport), fmt(p.tunjangan_lain),
      fmt(p.total_pendapatan),
      fmt(p.potongan_bpjs_kes), fmt(p.potongan_bpjs_tk), fmt(p.potongan_alpha), fmt(p.potongan_telat), fmt(p.potongan_lain),
      fmt(p.total_potongan), fmt(p.gaji_bersih), p.status
    ])
  ];

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `Payroll_${currentBulan.replace(/[^a-zA-Z0-9]/g,'_')}.csv`;
  a.click(); URL.revokeObjectURL(url);
}
