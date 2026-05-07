// ═══════════════════════════════════════════════════════════
// UTILS.JS — Helper functions shared across all modules
// ═══════════════════════════════════════════════════════════

export function normalizeStatus(s) {
  return (s || '').toString().trim().toLowerCase();
}

export function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = ['#fad442','#8d1e18','#1d4e89','#2d6a4f','#8E44AD','#8c6c64','#16A085'];
export function avatarColor(id) {
  const n = parseInt((id || '').replace(/\D/g, '')) || 0;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export function badgeEmpStatus(s) {
  const ns = normalizeStatus(s);
  if (ns === 'aktif')  return `<span class="badge badge-aktif">Aktif</span>`;
  if (ns === 'resign') return `<span class="badge badge-resign">Resign</span>`;
  return `<span class="badge badge-gray">${s || ''}</span>`;
}

export function badgeEmpType(s) {
  if (s === 'Contract')  return `<span class="badge badge-contract">Kontrak</span>`;
  if (s === 'Probation') return `<span class="badge badge-probation">Probasi</span>`;
  if (s === 'Resigned')  return `<span class="badge badge-resign">Resigned</span>`;
  return `<span class="badge badge-gray">${s || ''}</span>`;
}

export function badgeSP(s) {
  if (s === 'SP 1') return `<span class="badge badge-sp1">SP 1</span>`;
  if (s === 'SP 2') return `<span class="badge badge-sp2">SP 2</span>`;
  return `<span class="badge badge-sp3">${s}</span>`;
}
