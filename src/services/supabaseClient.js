import { createClient } from "@supabase/supabase-js";

console.log({ aa: import.meta.env });

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log({ bb: supabaseUrl, cc: supabaseAnonKey });

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
