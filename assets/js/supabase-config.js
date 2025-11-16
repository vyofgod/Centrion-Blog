// Supabase configuration
const SUPABASE_URL = 'https://nnmvygwcuagrvnkjdzcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubXZ5Z3djdWFncnZua2pkemN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDM5NjgsImV4cCI6MjA3ODg3OTk2OH0.F2wWRjBp0u2MXMiKbj0QWUx2jsmXzcsutTsnj6fg8Gw';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
