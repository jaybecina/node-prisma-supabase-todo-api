import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase connection...');

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Test the connection
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('Failed to connect to Supabase:', error.message);
  } else {
    console.log('Successfully connected to Supabase');
  }
});
