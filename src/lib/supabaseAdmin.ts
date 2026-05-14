import { createClient } from '@supabase/supabase-js';

// Admin client menggunakan service role key — bypass RLS
// HANYA gunakan di server-side (server actions, API routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
