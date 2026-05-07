// ═══════════════════════════════════════════════════════════
// JOB-OPENINGS.JS — ATS: posisi kosong, skill kandidat, match score
// ═══════════════════════════════════════════════════════════
import {
  loadJobOpenings, createJobOpening, updateJobOpening, deleteJobOpening,
  loadCandidateSkills, upsertCandidateSkill
} from './supabase.js';
import { POSISI_LIST } from './rekrutmen.js';

let jobsData      = [];
let skillsMap     = {};  // recruitment_id → candidate_skills row
let rekData       = [];
let editingJobId  = null;
let editingSkillRekId = null;

// ── INIT ─────────────────────────────────────────────────
export async function initJobOpenings(recruitment) {
  rekData = recruitment;
  try {
    [jobsData] = await Promise.all([loadJobOpenings()]);
    const csRows = await loadCandidateSkills();
    skillsMap = {};
    csRows.forEach(r => { skillsMap[r.recruitment_id] = r; });
  } catch (e) {
    console.error('Job openings load error:', e);
  }
  buildJobBoard();
  buildCandidateProfiles();
}

// ── JOB BOARD — Accordion collapse per posisi ────────────
let _jobBoardOpenMap = {};  // title → bool
let _jobBoardCandPage = {}; // title → page number

export function buildJobBoard() {
  const el = document.getElementById('job-board');
  if (!el) return;

  if (!jobsData.length) {
    el.innerHTML = `<div style="color:#8c6c64;font-size:13px;padding:24px;text-align:center">
      Belum ada posisi. Klik "+ Buka Posisi" untuk mulai.</div>`;
    return;
  }

  const sorted = [
    ...jobsData.filter(j => j.status === 'open'),
    ...jobsData.filter(j => j.status !== 'open'),
  ];

  el.innerHTML = sorted.map((j, idx) => {
    const safeTitle = j.title.replace(/[^a-z0-9]/gi,'_');
    const jid       = 'job-acc-' + safeTitle + '-' + j.id;
    const isOpen    = _jobBoardOpenMap[j.title] !== false && idx < 3; // first 3 open by default
    const color     = j.status === 'open' ? '#15803d' : '#6b7280';
    const bgColor   = j.status === 'open' ? '#dcfce7' : '#f3f4f6';
    const borderL   = j.status === 'open' ? '#16a34a' : '#9ca3af';

    return `
    <div style="border-radius:14px;border:1.5px solid rgba(141,30,24,0.12);margin-bottom:10px;overflow:hidden;background:white">
      <!-- Clickable header -->
      <div onclick="window._toggleJobAcc('${jid}')"
        style="display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;user-select:none;border-left:4px solid ${borderL}">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:15px;font-weight:700;color:#1a1a1a">${j.title}</span>
            <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${bgColor};color:${color};font-weight:600">
              ${j.status === 'open' ? 'Buka' : j.status === 'filled' ? 'Terisi' : 'Ditutup'}
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:5px;flex-wrap:wrap">
            <span style="font-size:11px;color:#8c6c64">${j.department||''} ${j.branch?'· '+j.branch:''}</span>
            <span style="font-size:11px;color:#8c6c64">·</span>
            <span style="font-size:11px;color:#8d1e18;font-weight:600">${rekData.filter(r=>r.posisi===j.title).length} melamar</span>
            ${j.headcount ? `<span style="font-size:11px;color:#8c6c64">· Butuh ${j.headcount} orang</span>` : ''}
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-shrink:0" onclick="event.stopPropagation()">
          <button class="btn btn-ghost" style="padding:3px 10px;font-size:11px" onclick="window.openEditJob(${j.id})">Edit</button>
          <button class="btn btn-ghost" style="padding:3px 10px;font-size:11px;color:#8d1e18" onclick="window.hapusJob(${j.id})">Hapus</button>
        </div>
        <div id="${jid}-chev" style="transition:transform .25s;transform:${isOpen?'rotate(180deg)':'rotate(0deg)'};color:#8c6c64;font-size:18px;margin-left:4px">▾</div>
      </div>

      <!-- Accordion body -->
      <div id="${jid}-body" style="max-height:${isOpen?'9999px':'0'};overflow:hidden;transition:max-height .35s ease">
        <div style="padding:0 20px 20px;border-top:1px solid rgba(141,30,24,0.08)">
          <!-- Meta row -->
          <div style="display:flex;gap:20px;flex-wrap:wrap;padding:12px 0 12px;font-size:12px;border-bottom:1px solid rgba(141,30,24,0.06);margin-bottom:12px">
            ${j.gaji_min ? `<div><span style="color:#8c6c64">Gaji:</span> <b>Rp ${(j.gaji_min/1e6).toFixed(1)}–${(j.gaji_max/1e6).toFixed(1)}jt</b></div>` : ''}
            ${j.deadline ? `<div><span style="color:#8c6c64">Deadline:</span> <b>${j.deadline}</b></div>` : ''}
            ${j.min_education ? `<div><span style="color:#8c6c64">Pendidikan:</span> <b>${j.min_education}</b></div>` : ''}
            ${j.min_experience ? `<div><span style="color:#8c6c64">Min. Exp:</span> <b>${j.min_experience} thn</b></div>` : ''}
          </div>

          ${(j.required_skills||[]).length ? `
          <div style="margin-bottom:12px">
            <div style="font-size:10px;color:#8c6c64;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">SKILL DIBUTUHKAN</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              ${(j.required_skills||[]).map(s => `<span class="badge badge-contract">${s.skill} ≥${s.min_level}/10</span>`).join('')}
            </div>
          </div>` : ''}

          ${_buildCandidateCompareTablePaged(j)}
        </div>
      </div>
    </div>`;
  }).join('');
}

// Match score calculator
function _calcMatchScore(candidateSkills, requiredSkills) {
  if (!requiredSkills?.length || !candidateSkills?.length) return null;
  let total = 0, matched = 0;
  requiredSkills.forEach(req => {
    const cand = candidateSkills.find(s =>
      s.skill.toLowerCase().includes(req.skill.toLowerCase()) ||
      req.skill.toLowerCase().includes(s.skill.toLowerCase())
    );
    total   += req.min_level;
    matched += cand ? Math.min(cand.level, req.min_level) : 0;
  });
  return total > 0 ? Math.round((matched / total) * 100) : null;
}

// Paginated candidate compare table (25 per page)
function _buildCandidateCompareTablePaged(j, page = 1) {
  const candidatesOnPos = rekData.filter(r => r.posisi === j.title);
  const reqSkills = j.required_skills || [];
  if (!candidatesOnPos.length) return `<div style="color:#bbb;font-size:12px;padding:8px 0">Belum ada kandidat untuk posisi ini.</div>`;

  const pageSize   = 25;
  const rows       = candidatesOnPos.map(r => {
    const cs     = skillsMap[r.id];
    const skills = cs?.skills || [];
    const score  = _calcMatchScore(skills, reqSkills);
    return { r, cs, score, stage: _stageLabel(r) };
  }).sort((a,b) => (b.score||0)-(a.score||0));

  const totalPages = Math.ceil(rows.length / pageSize);
  const pageRows   = rows.slice((page-1)*pageSize, page*pageSize);
  const safeT      = j.title.replace(/[^a-z0-9]/gi,'_');
  const jid        = 'job-acc-' + safeT + '-' + j.id;

  const paginationHtml = totalPages > 1 ? `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0 0;flex-wrap:wrap;gap:8px">
      <span style="font-size:12px;color:#8c6c64" id="${jid}-cand-info">Menampilkan <b>${(page-1)*pageSize+1}–${Math.min(page*pageSize,rows.length)}</b> dari <b>${rows.length}</b></span>
      <div style="display:flex;gap:4px">
        ${page > 1 ? `<button onclick="window._jobCandPage(${j.id}, ${page-1})" style="${_jobPagBtnStyle(false)}">‹</button>` : ''}
        ${Array.from({length:Math.min(5,totalPages)},(_,i) => {
          const p = Math.max(1,page-2)+i;
          if (p > totalPages) return '';
          return `<button onclick="window._jobCandPage(${j.id}, ${p})" style="${_jobPagBtnStyle(p===page)}">${p}</button>`;
        }).join('')}
        ${page < totalPages ? `<button onclick="window._jobCandPage(${j.id}, ${page+1})" style="${_jobPagBtnStyle(false)}">›</button>` : ''}
      </div>
    </div>` : '';

  return `
    <div>
      <div style="font-size:10px;color:#8c6c64;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">PERBANDINGAN KANDIDAT</div>
      <div class="table-wrap" id="${jid}-cand-table">
        <table>
          <thead><tr><th>Kandidat</th><th>Match</th><th>Skill</th><th>Pengalaman</th><th>Tahap</th><th>Aksi</th></tr></thead>
          <tbody>${pageRows.map(({ r, cs, score, stage }) => `<tr>
            <td><b>${r.nama}</b><div style="font-size:10px;color:#8c6c64">${r.umur?r.umur+'thn · ':''}${r.alamat_domisili||''}</div></td>
            <td>${score!==null?`<span style="font-weight:700;color:${score>=80?'#15803d':score>=60?'#b45309':'#8d1e18'}">${score}%</span>`:'<span style="color:#bbb">–</span>'}</td>
            <td style="font-size:11px">${(cs?.skills||[]).slice(0,3).map(s=>`<span class="badge badge-gray" style="margin:1px">${s.skill}</span>`).join('')}${(cs?.skills||[]).length>3?`<span style="font-size:10px;color:#8c6c64"> +${cs.skills.length-3}</span>`:''}</td>
            <td style="font-size:12px">${cs?.pengalaman_thn?cs.pengalaman_thn+'thn':'–'}</td>
            <td><span class="badge badge-yellow" style="font-size:10px">${stage}</span></td>
            <td><button class="btn btn-ghost" style="padding:3px 8px;font-size:10px" onclick="window.openKandidatProfile(${r.id})">Profil</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
      ${paginationHtml}
    </div>`;
}

function _jobPagBtnStyle(active) {
  return active
    ? 'padding:4px 9px;border-radius:7px;border:1.5px solid #8d1e18;background:#8d1e18;color:white;cursor:pointer;font-size:11px;font-family:Manrope,sans-serif;font-weight:700'
    : 'padding:4px 9px;border-radius:7px;border:1px solid rgba(141,30,24,.2);background:white;color:#303030;cursor:pointer;font-size:11px;font-family:Manrope,sans-serif';
}

window._toggleJobAcc = function(jid) {
  const body  = document.getElementById(jid + '-body');
  const chev  = document.getElementById(jid + '-chev');
  if (!body) return;
  const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
  body.style.maxHeight    = isOpen ? '0' : '9999px';
  chev.style.transform    = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
};

window._jobCandPage = function(jobId, page) {
  const j = jobsData.find(x => x.id === jobId);
  if (!j) return;
  const safeT = j.title.replace(/[^a-z0-9]/gi,'_');
  const jid   = 'job-acc-' + safeT + '-' + j.id;
  const cont  = document.getElementById(jid + '-cand-table')?.parentElement;
  if (cont) cont.innerHTML = _buildCandidateCompareTablePaged(j, page);
};

function _stageLabel(r) {
  if (r.join || r.join_date)    return 'Bergabung';
  if (r.ttd_kontrak)            return 'TTD Kontrak';
  if (r.interview_hr || r.interview_user) return 'Interview';
  if (r.screening_cv)           return 'Screening';
  return 'Applied';
}

// ── PROFIL KANDIDAT ───────────────────────────────────────
let _profilePage = 1;
const _profilePageSize = 12;

export function buildCandidateProfiles(page = 1) {
  _profilePage = page;
  const el = document.getElementById('candidate-profiles');
  if (!el) return;

  if (!rekData.length) {
    el.innerHTML = `<div style="color:#8c6c64;font-size:13px;padding:24px;text-align:center">Belum ada kandidat.</div>`;
    return;
  }

  const totalPages = Math.ceil(rekData.length / _profilePageSize);
  const pageData = rekData.slice((page-1)*_profilePageSize, page*_profilePageSize);

  // Search & filter toolbar
  const uniquePos = [...new Set(rekData.map(r => r.posisi).filter(Boolean))].sort();
  const toolbarHtml = `
    <div style="background:white;border-radius:14px;padding:14px 16px;border:1px solid rgba(141,30,24,0.1);margin-bottom:16px;box-shadow:0 2px 8px rgba(141,30,24,0.06)">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="position:relative;flex:1;min-width:200px">
          <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#8c6c64;pointer-events:none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
          <input id="profile-search" class="search-input" style="padding-left:30px;width:100%;box-sizing:border-box" placeholder="Cari nama kandidat..."
            oninput="window._filterProfiles(this.value)">
        </div>
        <select id="profile-filter-posisi" class="select-filter" onchange="window._filterProfiles(document.getElementById('profile-search')?.value||'')">
          <option value="">Semua Posisi</option>
          ${uniquePos.map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
        <div style="display:flex;align-items:center;gap:6px;background:rgba(141,30,24,0.06);border-radius:8px;padding:6px 10px;white-space:nowrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8d1e18" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span style="font-size:12px;font-weight:700;color:#8d1e18">${rekData.length}</span>
          <span style="font-size:11px;color:#8c6c64">kandidat</span>
          <span style="font-size:11px;color:#bbb">·</span>
          <span style="font-size:11px;color:#8c6c64">Hal <b style="color:#8d1e18">${page}</b>/${totalPages}</span>
        </div>
      </div>
    </div>`;

  // Pagination
  const pages = [];
  if (page > 1) pages.push(`<button class="btn btn-ghost" style="padding:5px 10px;font-size:12px" onclick="window.buildCandidateProfiles(${page-1})">‹ Prev</button>`);
  for (let p = Math.max(1,page-2); p <= Math.min(totalPages,page+2); p++) {
    pages.push(`<button class="btn ${p===page?'btn-primary':'btn-ghost'}" style="padding:5px 10px;font-size:12px" onclick="window.buildCandidateProfiles(${p})">${p}</button>`);
  }
  if (page < totalPages) pages.push(`<button class="btn btn-ghost" style="padding:5px 10px;font-size:12px" onclick="window.buildCandidateProfiles(${page+1})">Next ›</button>`);
  const paginationHtml = totalPages > 1 ? `<div style="display:flex;gap:6px;justify-content:center;margin-top:20px;flex-wrap:wrap">${pages.join('')}</div>` : '';

  const cardsHtml = pageData.map(r => {
    const cs     = skillsMap[r.id];
    const skills = cs?.skills || [];
    const score  = null; // will be job-specific

    return `<div class="card mb-20">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(141,30,24,.08)">
        <div style="width:42px;height:42px;border-radius:12px;background:rgba(141,30,24,.1);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#8d1e18;flex-shrink:0">
          ${r.nama.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
        </div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700">${r.nama}</div>
          <div style="font-size:12px;color:#8c6c64">${r.posisi} · Applied ${r.applied||''}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px" onclick="window.openKandidatProfile(${r.id})">
            ${cs ? 'Edit Profil' : '+ Profil'}
          </button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <div style="font-size:10px;font-weight:700;color:#8c6c64;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Skill</div>
          ${skills.length
            ? skills.map(s => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
                <span style="font-size:11px;min-width:100px;color:#303030">${s.skill}</span>
                <div style="flex:1;height:4px;background:rgba(141,30,24,.1);border-radius:2px">
                  <div style="height:100%;background:#8d1e18;border-radius:2px;width:${s.level*10}%"></div>
                </div>
                <span style="font-size:10px;color:#8c6c64">${s.level}/10</span>
              </div>`).join('')
            : `<div style="font-size:12px;color:#bbb">Belum ada data skill</div>`
          }
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;color:#8c6c64;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Info</div>
          <div style="font-size:12px;line-height:1.8">
            ${cs?.pendidikan ? `<div><span style="color:#8c6c64">Pendidikan:</span> ${cs.pendidikan} ${cs.jurusan||''}</div>` : ''}
            ${cs?.pengalaman_thn != null ? `<div><span style="color:#8c6c64">Pengalaman:</span> ${cs.pengalaman_thn} tahun</div>` : ''}
            ${r.umur ? `<div><span style="color:#8c6c64">Usia:</span> ${r.umur} tahun</div>` : ''}
            ${r.alamat_domisili ? `<div><span style="color:#8c6c64">Domisili:</span> ${r.alamat_domisili}</div>` : ''}
            ${cs?.catatan_hr ? `<div style="margin-top:6px;padding:6px 8px;background:#fffdf0;border-radius:6px;font-size:11px;color:#7a5200"><b>Catatan HR:</b> ${cs.catatan_hr}</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = toolbarHtml + cardsHtml + paginationHtml;
}

// Search filter for profiles
window._filterProfiles = function(query) {
  const q   = (query||'').toLowerCase();
  const pos = document.getElementById('profile-filter-posisi')?.value || '';
  // Filter rekData inline - temporarily replace for render
  const _origRek = rekData;
  const filtered = rekData.filter(r =>
    (!q   || r.nama.toLowerCase().includes(q) || (r.posisi||'').toLowerCase().includes(q)) &&
    (!pos || r.posisi === pos)
  );
  const _backup = rekData;
  // patch rekData temporarily for the render
  const tempRekData = filtered;
  // build with filtered
  const el = document.getElementById('candidate-profiles');
  if (!el) return;
  if (!tempRekData.length) {
    el.innerHTML = `<div style="background:white;border-radius:14px;padding:14px 16px;border:1px solid rgba(141,30,24,0.1);margin-bottom:16px"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="position:relative;flex:1;min-width:200px"><input class="search-input" style="padding-left:10px;width:100%;box-sizing:border-box" value="${query}" oninput="window._filterProfiles(this.value)" placeholder="Cari nama kandidat..."></div></div></div><div style="color:#8c6c64;font-size:13px;padding:24px;text-align:center">Tidak ada kandidat yang cocok.</div>`;
    return;
  }
  // Use pagination with filtered data
  _profilePage = 1;
  const totalPages = Math.ceil(tempRekData.length / _profilePageSize);
  const pageData = tempRekData.slice(0, _profilePageSize);
  const uniquePos = [...new Set(rekData.map(r => r.posisi).filter(Boolean))].sort();
  const toolbarHtml = `<div style="background:white;border-radius:14px;padding:14px 16px;border:1px solid rgba(141,30,24,0.1);margin-bottom:16px;box-shadow:0 2px 8px rgba(141,30,24,0.06)"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="position:relative;flex:1;min-width:200px"><svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#8c6c64;pointer-events:none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg><input id="profile-search" class="search-input" style="padding-left:30px;width:100%;box-sizing:border-box" value="${query}" placeholder="Cari nama kandidat..." oninput="window._filterProfiles(this.value)"></div><select id="profile-filter-posisi" class="select-filter" onchange="window._filterProfiles(document.getElementById('profile-search')?.value||'')"><option value="">Semua Posisi</option>${uniquePos.map(p => `<option value="${p}" ${p===pos?'selected':''}>${p}</option>`).join('')}</select><div style="display:flex;align-items:center;gap:6px;background:rgba(141,30,24,0.06);border-radius:8px;padding:6px 10px;white-space:nowrap"><span style="font-size:12px;font-weight:700;color:#8d1e18">${tempRekData.length}</span><span style="font-size:11px;color:#8c6c64">hasil</span><span style="font-size:11px;color:#bbb">·</span><span style="font-size:11px;color:#8c6c64">Hal <b style="color:#8d1e18">1</b>/${totalPages}</span></div></div></div>`;
  el.innerHTML = toolbarHtml + pageData.map(r => {
    const cs = skillsMap[r.id];
    const skills = cs?.skills || [];
    return `<div class="card mb-20"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(141,30,24,.08)"><div style="width:42px;height:42px;border-radius:12px;background:rgba(141,30,24,.1);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#8d1e18;flex-shrink:0">${r.nama.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}</div><div style="flex:1"><div style="font-size:14px;font-weight:700">${r.nama}</div><div style="font-size:12px;color:#8c6c64">${r.posisi} · Applied ${r.applied||''}</div></div><div style="display:flex;gap:6px"><button class="btn btn-ghost" style="padding:4px 10px;font-size:11px" onclick="window.openKandidatProfile(${r.id})">${cs ? 'Edit Profil' : '+ Profil'}</button></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><div style="font-size:10px;font-weight:700;color:#8c6c64;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Skill</div>${skills.length ? skills.map(s => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><span style="font-size:11px;min-width:100px;color:#303030">${s.skill}</span><div style="flex:1;height:4px;background:rgba(141,30,24,.1);border-radius:2px"><div style="height:100%;background:#8d1e18;border-radius:2px;width:${s.level*10}%"></div></div><span style="font-size:10px;color:#8c6c64">${s.level}/10</span></div>`).join('') : `<div style="font-size:12px;color:#bbb">Belum ada data skill</div>`}</div><div><div style="font-size:10px;font-weight:700;color:#8c6c64;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Info</div><div style="font-size:12px;line-height:1.8">${cs?.pendidikan ? `<div><span style="color:#8c6c64">Pendidikan:</span> ${cs.pendidikan} ${cs.jurusan||''}</div>` : ''}${cs?.pengalaman_thn != null ? `<div><span style="color:#8c6c64">Pengalaman:</span> ${cs.pengalaman_thn} tahun</div>` : ''}${r.umur ? `<div><span style="color:#8c6c64">Usia:</span> ${r.umur} tahun</div>` : ''}${r.alamat_domisili ? `<div><span style="color:#8c6c64">Domisili:</span> ${r.alamat_domisili}</div>` : ''}${cs?.catatan_hr ? `<div style="margin-top:6px;padding:6px 8px;background:#fffdf0;border-radius:6px;font-size:11px;color:#7a5200"><b>Catatan HR:</b> ${cs.catatan_hr}</div>` : ''}</div></div></div></div>`;
  }).join('');
};
window.buildCandidateProfiles = buildCandidateProfiles;

// ── MODAL BUKA POSISI ────────────────────────────────────
export function openJobModal(id = null) {
  editingJobId = id;
  const modal = document.getElementById('modal-job');
  if (!modal) return;

  if (id) {
    const j = jobsData.find(x => x.id === id);
    if (j) {
      const jfTitle = document.getElementById('jf-title-sel');
    if (jfTitle) jfTitle.value = j.title || '';
    document.getElementById('jf-title').value       = j.title || '';
      document.getElementById('jf-dept').value        = j.department || '';
      document.getElementById('jf-branch').value      = j.branch || '';
      document.getElementById('jf-headcount').value   = j.headcount || 1;
      document.getElementById('jf-gaji-min').value    = j.gaji_min || 0;
      document.getElementById('jf-gaji-max').value    = j.gaji_max || 0;
      document.getElementById('jf-min-exp').value     = j.min_experience || 0;
      document.getElementById('jf-min-edu').value     = j.min_education || '';
      document.getElementById('jf-deadline').value    = j.deadline || '';
      document.getElementById('jf-status').value      = j.status || 'open';
      document.getElementById('jf-keterangan').value  = j.keterangan || '';
      // Render skills
      _renderJobSkills(j.required_skills || []);
    }
  } else {
    ['jf-title','jf-dept','jf-branch','jf-keterangan','jf-deadline','jf-min-edu'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    ['jf-headcount'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 1; });
    ['jf-gaji-min','jf-gaji-max','jf-min-exp'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });
    document.getElementById('jf-status').value = 'open';
    _renderJobSkills([]);
  }

  modal.classList.add('open');
}

let _jobSkills = [];
function _renderJobSkills(skills) {
  _jobSkills = [...skills];
  const el = document.getElementById('jf-skills-list');
  if (!el) return;
  el.innerHTML = _jobSkills.map((s, i) =>
    `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <input class="form-input" style="flex:2" value="${s.skill}" oninput="window._updateJobSkill(${i},'skill',this.value)" placeholder="Nama skill">
      <input class="form-input" style="width:70px" type="number" min="1" max="10" value="${s.min_level}" oninput="window._updateJobSkill(${i},'min_level',+this.value)" placeholder="Level">
      <button class="btn btn-ghost" style="padding:4px 8px;color:#8d1e18" onclick="window._removeJobSkill(${i})">✕</button>
    </div>`
  ).join('') + `<button class="btn btn-ghost" style="font-size:12px;margin-top:4px" onclick="window._addJobSkill()">+ Tambah Skill</button>`;
}

window._addJobSkill    = ()    => { _jobSkills.push({ skill:'', min_level:7 }); _renderJobSkills(_jobSkills); };
window._removeJobSkill = (i)   => { _jobSkills.splice(i, 1); _renderJobSkills(_jobSkills); };
window._updateJobSkill = (i,k,v) => { _jobSkills[i][k] = v; };

export async function saveJob(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    title:           g('jf-title'),
    department:      g('jf-dept'),
    branch:          g('jf-branch'),
    headcount:       parseInt(document.getElementById('jf-headcount')?.value) || 1,
    gaji_min:        parseInt(document.getElementById('jf-gaji-min')?.value)  || 0,
    gaji_max:        parseInt(document.getElementById('jf-gaji-max')?.value)  || 0,
    min_experience:  parseInt(document.getElementById('jf-min-exp')?.value)   || 0,
    min_education:   g('jf-min-edu'),
    deadline:        g('jf-deadline') || null,
    status:          g('jf-status') || 'open',
    keterangan:      g('jf-keterangan'),
    required_skills: _jobSkills.filter(s => s.skill)
  };
  if (!payload.title) { alert('Nama posisi wajib diisi!'); return; }
  try {
    if (editingJobId) await updateJobOpening(editingJobId, payload);
    else              await createJobOpening(payload);
    jobsData = await loadJobOpenings();
    buildJobBoard();
    document.getElementById('modal-job')?.classList.remove('open');
    alert('✅ Posisi berhasil disimpan!');
  } catch (e) {
    alert('❌ Gagal: ' + e.message);
  }
}

export async function hapusJob(id, canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  if (!confirm('Hapus posisi ini?')) return;
  try {
    await deleteJobOpening(id);
    jobsData = await loadJobOpenings();
    buildJobBoard();
  } catch (e) {
    alert('❌ Gagal: ' + e.message);
  }
}

// ── MODAL PROFIL KANDIDAT ─────────────────────────────────
let _candSkills = [];
export function openKandidatProfile(rekId) {
  editingSkillRekId = rekId;
  const r  = rekData.find(x => x.id === rekId);
  const cs = skillsMap[rekId];
  if (!r) return;

  const modal = document.getElementById('modal-kandidat-profil');
  if (!modal) return;

  document.getElementById('kp-nama').textContent   = r.nama;
  document.getElementById('kp-posisi').textContent = r.posisi;
  document.getElementById('kp-pendidikan').value   = cs?.pendidikan   || '';
  document.getElementById('kp-jurusan').value      = cs?.jurusan      || '';
  document.getElementById('kp-exp-thn').value      = cs?.pengalaman_thn ?? 0;
  document.getElementById('kp-exp-desc').value     = cs?.pengalaman_desc|| '';
  document.getElementById('kp-catatan').value      = cs?.catatan_hr   || '';
  document.getElementById('kp-cv-url').value       = cs?.cv_url       || '';

  _candSkills = JSON.parse(JSON.stringify(cs?.skills || []));
  _renderCandSkills();
  modal.classList.add('open');
}

function _renderCandSkills() {
  const el = document.getElementById('kp-skills-list');
  if (!el) return;
  el.innerHTML = _candSkills.map((s, i) =>
    `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <input class="form-input" style="flex:2" value="${s.skill}" oninput="window._updateCandSkill(${i},'skill',this.value)" placeholder="Nama skill">
      <input class="form-input" style="width:70px" type="number" min="1" max="10" value="${s.level}" oninput="window._updateCandSkill(${i},'level',+this.value)" placeholder="Level">
      <button class="btn btn-ghost" style="padding:4px 8px;color:#8d1e18" onclick="window._removeCandSkill(${i})">✕</button>
    </div>`
  ).join('') + `<button class="btn btn-ghost" style="font-size:12px;margin-top:4px" onclick="window._addCandSkill()">+ Tambah Skill</button>`;
}

window._addCandSkill    = ()    => { _candSkills.push({ skill:'', level:7 }); _renderCandSkills(); };
window._removeCandSkill = (i)   => { _candSkills.splice(i, 1); _renderCandSkills(); };
window._updateCandSkill = (i,k,v) => { _candSkills[i][k] = v; };

export async function saveKandidatProfile(canWrite) {
  if (!canWrite) { alert('Tidak punya izin.'); return; }
  const g = id => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    recruitment_id:  editingSkillRekId,
    pendidikan:      g('kp-pendidikan'),
    jurusan:         g('kp-jurusan'),
    pengalaman_thn:  parseInt(document.getElementById('kp-exp-thn')?.value) || 0,
    pengalaman_desc: g('kp-exp-desc'),
    catatan_hr:      g('kp-catatan'),
    cv_url:          g('kp-cv-url'),
    skills:          _candSkills.filter(s => s.skill)
  };
  try {
    await upsertCandidateSkill(payload);
    const csRows = await loadCandidateSkills();
    skillsMap = {};
    csRows.forEach(r => { skillsMap[r.recruitment_id] = r; });
    buildJobBoard();
    buildCandidateProfiles();
    document.getElementById('modal-kandidat-profil')?.classList.remove('open');
    alert('✅ Profil kandidat disimpan!');
  } catch (e) {
    alert('❌ Gagal: ' + e.message);
  }
}
