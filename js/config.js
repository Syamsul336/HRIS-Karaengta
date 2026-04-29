// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════
// 1. Buka Supabase Dashboard → Project Settings → API
// 2. Copy "Project URL" → ganti SUPABASE_URL di bawah
// 3. Copy "anon / public" key → ganti SUPABASE_ANON_KEY di bawah
//
// PENTING: anon key BOLEH terlihat di frontend KARENA dilindungi RLS.
// JANGAN PERNAH paste service_role key di file ini — itu key admin
// yang bypass semua RLS dan akan bahaya kalau ter-expose ke browser.
//
// CATATAN: file ini dibuat sebagai script biasa (bukan ES module)
// supaya dashboard bisa dibuka langsung lewat file:// untuk testing.
// ES module dengan import relatif diblokir oleh Chrome di file://.
// ═══════════════════════════════════════════════════════════

window.SUPABASE_URL      = 'https://wnjvekrglvebiecmfamw.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduanZla3JnbHZlYmllY21mYW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NTkxMDYsImV4cCI6MjA5MzAzNTEwNn0.mQYL9sczpda9134iiUP0XBA-qXTCylVlJE-RUFdnmok';
