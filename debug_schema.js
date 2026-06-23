import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_schema', { table_name: 'profiles' });
  if (error) {
    console.log("RPC Error:", error.message);
    // fallback, let's just insert without id and see what happens
    const { data: d2, error: e2 } = await supabase.from('profiles').insert([{ name: 'test', email: 'test2@test.com', role: 'retail_user', avatar: 'T' }]);
    console.log("Insert without ID error:", JSON.stringify(e2, null, 2));
  }
}
checkSchema();
