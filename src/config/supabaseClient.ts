import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('URL:', supabaseUrl);
console.log('KEY:', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
// // ```

// ---

// ## **Step 10: Add .env to .gitignore**

// Open `.gitignore` in your project root and make sure it has:
// ```
// # environment variables
// .env
// .env.local
// ```

// **Why?**
// ```
// // .env contains your secret keys
// // If you push to GitHub, everyone can see them!
// // .gitignore tells Git to ignore these files