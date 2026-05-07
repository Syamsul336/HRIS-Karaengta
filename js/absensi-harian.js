// ═══════════════════════════════════════════════════════════
// ABSENSI-HARIAN.JS — Input Absensi per Hari (#9)
// ═══════════════════════════════════════════════════════════
import { loadDailyAttendance, upsertDailyAttendance, deleteDailyAttendance, aggregateDailyToMonthly } from './supabase.js';
import { animateRowsIn } from './animations.js';

let dailyData = [];
let empData   = [];
let currentTgl= new Date().toISOString().slice(0,10);

export async function initAbsensiHarian(employees) {
  empData = employees;
  const tglEl = document.getElementById('daily-tgl-input');
  if (tglEl) {
    tglEl.value = currentTgl;
    tglEl.onchange = () => { currentTgl = tglEl.value; refreshDaily(); };
  }
  await refreshDaily();
}

async function refreshDaily() {
  dailyData = await loadDailyAttendance(currentTgl);
  buildDailyTable(dailyData);
}

export function buildDailyTable(data) {
  const tbody = document.getElementById('daily-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#8c6c64;padding:28px">
      Belum ada data absensi untuk tanggal ini. Klik "+ Input Absensi" untuk mulai.
    </td></tr>`;
    return;
  }
  const STATUS_CLS = { Hadir:'badge-aktif', Alpha:'badge-resign', Sakit:'badge-probation', Izin:'badge-gray', Cuti:'badge-yellow', Telat:'badge-sp1' };
  tbody.innerHTML = data.map((d, i) => `<tr>
    <td>${i+1}</td>
    <td><b>${d.full_name}</b><div style="font-size:10px;color:#8c6c64">${d.employee_id}</div></td>
    <td><span class="badge ${STATUS_CLS[d.status]||'badge-gray'}">${d.status}</span></td>
    <td style="font-size:12px">${d.jam_masuk||'—'}</td>
    <td style="font-size:12px">${d.jam_keluar||'—'}</td>
    <td style="font-size:12px">${d.terlambat_menit ? d.terlambat_menit+' menit' : '—'}</td>
    <td>
      <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px" onclick="window.editDailyAbs(${d.id})">Edit</button>
      <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusDailyAbs(${d.id})">Hapus</button>
    </td>
  </tr>`).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));
}

export function openInputHarian(employees) {
  // Populate form
  const sel = document.getElementById('dh-emp-sel');
  if (sel) {
    sel.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.filter(e => e.status==='Aktif').map(e =>
        `<option value="${e.employee_id}" data-name="${e.name}">${e.name}</option>`
      ).join('');
  }
  const tgl = document.getElementById('dh-tanggal');
  if (tgl) tgl.value = currentTgl;
  // Reset fields
  ['dh-jam-masuk','dh-jam-keluar','dh-terlambat','dh-keterangan'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const statusEl = document.getElementById('dh-status');
  if (statusEl) statusEl.value = 'Hadir';
  document.getElementById('modal-daily-abs')?.classList.add('open');
}

export async function saveDailyAbs(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const empSel = document.getElementById('dh-emp-sel');
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    employee_id:    empSel?.value || '',
    full_name:      empSel?.options[empSel.selectedIndex]?.dataset?.name || '',
    tanggal:        g('dh-tanggal') || currentTgl,
    status:         g('dh-status') || 'Hadir',
    jam_masuk:      g('dh-jam-masuk')   || null,
    jam_keluar:     g('dh-jam-keluar')  || null,
    terlambat_menit:parseInt(g('dh-terlambat'))||0,
    keterangan:     g('dh-keterangan'),
  };
  if (!payload.employee_id) { alert('Pilih karyawan!'); return; }
  try {
    await upsertDailyAttendance(payload);
    await refreshDaily();
    document.getElementById('modal-daily-abs')?.classList.remove('open');
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function hapusDailyAbs(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus data absensi ini?')) return;
  try { await deleteDailyAttendance(id); await refreshDaily(); }
  catch (e) { alert('❌ ' + e.message); }
}

export async function aggregateToMonthly(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const bulanStr = currentTgl.slice(0,7); // "2026-01"
  const aktifEmps = empData.filter(e => e.status==='Aktif');
  if (!aktifEmps.length) { alert('Tidak ada karyawan aktif.'); return; }
  if (!confirm(`Rekap absensi harian bulan ${bulanStr} ke tabel absensi bulanan?\n(${aktifEmps.length} karyawan)`)) return;
  try {
    let berhasil = 0;
    for (const emp of aktifEmps) {
      try { await aggregateDailyToMonthly(emp.employee_id, bulanStr); berhasil++; }
      catch (e) { console.warn('Skip', emp.employee_id, e.message); }
    }
    alert(`✅ Rekap selesai! ${berhasil}/${aktifEmps.length} karyawan berhasil direkap.`);
  } catch (e) { alert('❌ ' + e.message); }
}
