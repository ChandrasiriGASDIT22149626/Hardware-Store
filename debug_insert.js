import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('profiles').insert([{
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // dummy uuid
    email: 'test@example.com',
    name: 'Test',
    role: 'retail_user',
    avatar: 'T'
  }]);
  console.log("Insert Error:", JSON.stringify(error, null, 2));
}
testInsert();
