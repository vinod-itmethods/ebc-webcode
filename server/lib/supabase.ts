import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://vavfnokpvssfpspnymwx.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "sb_secret_AUHC3unj4HMGzww1BlLrCw_Wfe9SXKT";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
