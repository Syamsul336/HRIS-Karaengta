// ═══════════════════════════════════════════════════════════
// DOKUMEN.JS — Dokumen Karyawan (#11)
// ═══════════════════════════════════════════════════════════
import { loadDocuments, createDocument, deleteDocument, uploadDocumentFile } from './supabase.js';
import { animateRowsIn } from './animations.js';

let docsData  = [];
let empData   = [];
let filterEmpId = '';

export async function initDokumen(employees) {
  empData = employees;
  const sel = document.getElementById('doc-emp-filter');
  if (sel) {
    sel.innerHTML = '<option value="">-- Semua Karyawan --</option>' +
      employees.map(e => `<option value="${e.employee_id}">${e.name}</option>`).join('');
    sel.onchange = () => { filterEmpId = sel.value; refreshDocs(); };
  }
  const selModal = document.getElementById('doc-emp-sel');
  if (selModal) {
    selModal.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
      employees.map(e => `<option value="${e.employee_id}">${e.name}</option>`).join('');
  }
  await refreshDocs();
}

async function refreshDocs() {
  docsData = await loadDocuments(filterEmpId || null);
  buildDocsTable(docsData);
}

function buildDocsTable(data) {
  const tbody = document.getElementById('doc-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#8c6c64;padding:28px">
      Belum ada dokumen. Klik "+ Upload Dokumen" untuk mulai.
    </td></tr>`;
    return;
  }
  const JENIS_CLS = { KTP:'badge-contract', Ijazah:'badge-aktif', 'BPJS Kesehatan':'badge-sp1',
    'BPJS TK':'badge-probation', Kontrak:'badge-resign', Foto:'badge-yellow', Sertifikat:'badge-gray', Lainnya:'badge-gray' };
  const fmtSize = s => s > 1048576 ? (s/1048576).toFixed(1)+'MB' : Math.round(s/1024)+'KB';
  tbody.innerHTML = data.map((d, i) => {
    const emp = empData.find(e => e.employee_id === d.employee_id);
    return `<tr>
      <td>${i+1}</td>
      <td><b>${emp?.name||d.employee_id}</b></td>
      <td><span class="badge ${JENIS_CLS[d.jenis]||'badge-gray'}">${d.jenis}</span></td>
      <td style="font-size:12px">${d.nama_dokumen}</td>
      <td style="font-size:11px;color:#8c6c64">${d.file_size ? fmtSize(d.file_size) : '—'}</td>
      <td>
        <a href="${d.file_url}" target="_blank" class="btn btn-ghost" style="padding:3px 8px;font-size:11px">Lihat</a>
        <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;color:#8d1e18" onclick="window.hapusDoc(${d.id})">Hapus</button>
      </td>
    </tr>`;
  }).join('');
  requestAnimationFrame(() => animateRowsIn(tbody));
}

export async function saveDocument(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const fileInput = document.getElementById('doc-file');
  const empId = g('doc-emp-sel');
  const nama  = g('doc-nama');
  const jenis = g('doc-jenis') || 'Lainnya';

  if (!empId || !nama) { alert('Karyawan dan nama dokumen wajib diisi!'); return; }

  const btn = document.querySelector('#modal-dokumen .btn-secondary');
  try {
    let file_url = g('doc-url-manual');
    let file_name = '', file_size = 0;

    if (fileInput?.files?.length) {
      const file = fileInput.files[0];
      if (file.size > 10 * 1024 * 1024) { alert('File maksimal 10MB!'); return; }
      if (btn) { btn.textContent = 'Mengupload...'; btn.disabled = true; }
      const uploaded = await uploadDocumentFile(file, empId);
      file_url  = uploaded.url;
      file_name = uploaded.name;
      file_size = uploaded.size;
    }

    if (!file_url) { alert('Upload file atau masukkan URL dokumen!'); return; }

    await createDocument({ employee_id: empId, nama_dokumen: nama, jenis, file_url, file_name, file_size, keterangan: g('doc-keterangan') });
    await refreshDocs();
    document.getElementById('modal-dokumen')?.classList.remove('open');
    alert('✅ Dokumen berhasil disimpan!');
  } catch (e) {
    alert('❌ Gagal: ' + e.message);
  } finally {
    if (btn) { btn.textContent = 'Simpan'; btn.disabled = false; }
  }
}

export async function hapusDoc(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus dokumen ini?')) return;
  try { await deleteDocument(id); await refreshDocs(); }
  catch (e) { alert('❌ ' + e.message); }
}
