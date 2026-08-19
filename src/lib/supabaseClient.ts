import { createClient } from '@supabase/supabase-js';

// Publishable/anon key -- safe to ship client-side, RLS gates
// everything it can touch. The service_role key is never used here,
// only inside Edge Functions.
const SUPABASE_URL = 'https://htmhhoblyaminkhrhwjt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3zEyx9stb3s1ZpP13fdaYA_XhTZSXE7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
