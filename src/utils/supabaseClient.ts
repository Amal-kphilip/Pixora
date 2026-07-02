import { createClient } from "@supabase/supabase-js";

// Retrieve keys from environment variables, falling back to your public client credentials to allow Vercel static builds to compile out-of-the-box.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nmeckxupreypkatrdsyo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_PuoJ-cLC--a28EVJvsXHpw_b1-ZnX3g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
