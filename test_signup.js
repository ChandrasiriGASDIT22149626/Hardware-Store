import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSignUp() {
  const email = `testuser_${Date.now()}@example.com`;
  console.log(`Attempting to sign up with: ${email}`);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test User',
        role: 'retail_user'
      }
    }
  });

  if (error) {
    console.error("Signup failed:", JSON.stringify(error, null, 2));
  } else {
    console.log("Signup success:", JSON.stringify(data, null, 2));
  }
}

testSignUp();
