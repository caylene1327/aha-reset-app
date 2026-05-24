import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  console.error(
    '[supabase] ❌ Missing env vars — VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set.\n' +
    '  Local: add them to .env.local\n' +
    '  Railway: set them in Variables tab BEFORE triggering a build.',
  );
} else {
  // Log URL prefix only — never logs the key
  console.log('[supabase] ✅ Client initialized. URL:', url.slice(0, 30) + '…');
}

export const supabase = createClient(url ?? '', key ?? '');
export const supabaseConfigured = Boolean(url && key);
