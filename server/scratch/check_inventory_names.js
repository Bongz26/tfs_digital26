require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInventory() {
  const { data, error } = await supabase
    .from('inventory')
    .select('name, model, color, stock_quantity')
    .eq('category', 'coffin')
    .order('name');

  if (error) {
    console.error('Error fetching inventory:', error);
    process.exit(1);
  }

  console.log('--- Casket Inventory ---');
  console.table(data);
  process.exit(0);
}

checkInventory();
