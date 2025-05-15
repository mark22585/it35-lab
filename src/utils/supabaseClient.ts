import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgcygbtwuzqleuqycwqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY3lnYnR3dXpxbGV1cXljd3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI2ODc0MiwiZXhwIjoyMDYyODQ0NzQyfQ.hz17OQxfbnwg6m3Rbv8quFgLYk7jwY44nqUKdGyM5dg';

export const supabase = createClient(supabaseUrl, supabaseKey);