import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://usblrulkcgucxtkhugck.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYmxydWxrY2d1Y3h0a2h1Z2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjI4MDMsImV4cCI6MjA2OTUzODgwM30.yvF7KPN9_xhOidfRzAdiYEJASycMPLbQCoXJyAJObwI';

export const externalSupabase = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
