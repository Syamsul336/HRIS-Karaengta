// ═══════════════════════════════════════════════════════════
// USER-MANAGEMENT.JS — Manajemen Akun HR (#10)
// ═══════════════════════════════════════════════════════════
import { loadHrUsers, updateHrUser } from './supabase.js';

let usersData = [];

export async function initUserManagement() {
  usersData = await loadHrUsers();
  buildUserTable(usersData);
}

export function buildUserTable(data) {
  const tbody = document.getElementById('user-tbody');
  if (!tbody) return;
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#8c6c64;padding:28px">Belum ada data user HR.</td></tr>`;
    return;
  }
  const ROLE_CLS = { admin:'badge-resign', hr_manager:'badge-sp1', hr_staff:'badge-contract', viewer:'badge-gray' };
  tbody.innerHTML = data.map((u, i) => `<tr>
    <td>${i+1}</td>
    <td><b>${u.full_name||'—'}</b></td>
    <td style="font-size:12px;color:#8c6c64">${u.email}</td>
    <td><span class="badge ${ROLE_CLS[u.role]||'badge-gray'}">${u.role}</span></td>
    <td><span class="badge ${u.is_active?'badge-aktif':'badge-resign'}">${u.is_active?'Aktif':'Nonaktif'}</span></td>
    <td>
      <select class="select-filter" style="font-size:11px;padding:3px 6px" onchange="window.changeUserRole('${u.id}',this.value)">
        ${['admin','hr_manager','hr_staff','viewer'].map(r =>
          `<option value="${r}" ${u.role===r?'selected':''}>${r}</option>`
        ).join('')}
      </select>
      <button class="btn btn-ghost" style="padding:3px 8px;font-size:11px;margin-left:4px;color:${u.is_active?'#8d1e18':'#2d6a4f'}"
        onclick="window.toggleUserActive('${u.id}',${!u.is_active})">
        ${u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
    </td>
  </tr>`).join('');
}

export async function changeUserRole(id, role, canWrite) {
  if (!canWrite) { alert('Hanya admin yang bisa mengubah role.'); return; }
  try {
    await updateHrUser(id, { role });
    usersData = await loadHrUsers();
    buildUserTable(usersData);
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}

export async function toggleUserActive(id, isActive, canWrite) {
  if (!canWrite) { alert('Hanya admin yang bisa mengubah status akun.'); return; }
  const u = usersData.find(x => x.id === id);
  const action = isActive ? 'aktifkan' : 'nonaktifkan';
  if (!confirm(`${action.charAt(0).toUpperCase()+action.slice(1)} akun ${u?.full_name||u?.email}?`)) return;
  try {
    await updateHrUser(id, { is_active: isActive });
    usersData = await loadHrUsers();
    buildUserTable(usersData);
  } catch (e) { alert('❌ Gagal: ' + e.message); }
}
