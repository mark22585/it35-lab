import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xiucepguupputhkcnwig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdWNlcGd1dXBwdXRoa2Nud2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mzk2NDgsImV4cCI6MjA1OTIxNTY0OH0.LuWv2rPuwM0imUqftRBntUpWxhdlk-otS1w2V3jE8kg';

export const supabase = createClient(supabaseUrl, supabaseKey);