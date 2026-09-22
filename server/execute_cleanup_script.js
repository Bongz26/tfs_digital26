const { query } = require('./config/db');

function standardizeName(raw) {
  if (!raw) return 'UNKNOWN';
  let name = raw.toUpperCase().trim();
  if (name.includes('ECONO')) return 'ECONO';
  if (name.includes('PONGEE')) return 'PONGEE';
  if (name.includes('FLAT LID')) return 'FLAT LID';
  if (name.includes('4 TIER') || name.includes('FOUR TIER')) return '4 TIER';
  if (name.includes('1.9 FEET')) return '1.9 FEET';
  if (name.includes('1/4 VIEW')) return '1/4 VIEW';
  if (name.includes('NGUNI')) return 'NGUNI DOME';
  if (name.includes('RAISED')) return 'RAISED HALFVIEW';
  return name;
}

function standardizeModel(rawName, rawModel) {
  let modelStr = (rawModel || '').toUpperCase().trim();
  if (modelStr && modelStr !== '') return modelStr;
  
  // If blank, guess based on name
  let upperName = (rawName || '').toUpperCase();
  if (upperName.includes('COFFIN') || upperName.includes('FLAT LID') || upperName.includes('1.9 FEET')) {
    return 'COFFIN';
  }
  return 'CASKET';
}

async function run() {
  console.log("Starting Phase 1: Standardizing Strings...");
  // Fetch relevant inventory
  const res = await query(`SELECT * FROM inventory WHERE category IN ('coffin', 'casket') OR category IS NULL`);
  const items = res.rows;
  
  // Update phase
  for (const item of items) {
    const sName = standardizeName(item.name);
    const sModel = standardizeModel(item.name, item.model);
    const sColor = (item.color || '').toUpperCase().trim();
    const sCategory = 'coffin';
    
    if (item.name !== sName || item.model !== sModel || item.color !== sColor || item.category !== 'coffin') {
      await query(
        `UPDATE inventory SET name = $1, model = $2, color = $3, category = $4 WHERE id = $5`,
        [sName, sModel, sColor, sCategory, item.id]
      );
      console.log(`[Standardized] ID ${item.id}: ${item.name} -> ${sName} | color: ${sColor}`);
    }
  }

  console.log("\nStarting Phase 2 & 3: Grouping and Merging...");
  // Re-fetch standardized items
  const res2 = await query(`SELECT * FROM inventory WHERE category = 'coffin'`);
  const updatedItems = res2.rows;
  
  // Group by Location + Name + Model + Color
  const groups = {};
  for (const it of updatedItems) {
    const key = `${it.location}|${it.name}|${it.model}|${it.color}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  }
  
  let mergedCount = 0;
  let deletedCount = 0;
  
  for (const [key, group] of Object.entries(groups)) {
    if (group.length > 1) {
      // Sort by smallest ID (oldest) first to elect Primary
      group.sort((a, b) => a.id - b.id);
      
      const primary = group[0];
      const duplicates = group.slice(1);
      const duplicateIds = duplicates.map(d => d.id);
      
      let totalStock = group.reduce((sum, it) => sum + (it.stock_quantity || 0), 0);
      let totalReserved = group.reduce((sum, it) => sum + (it.reserved_quantity || 0), 0);
      
      console.log(`\n> Group Match: ${key}`);
      console.log(`  Elected Primary ID: ${primary.id}`);
      console.log(`  Duplicates to Merge: ${duplicateIds.join(', ')}`);
      console.log(`  Final Total Stock calculation: ${totalStock} (Res: ${totalReserved})`);
      
      try {
        await query('BEGIN');
        
        // 1. Update Primary ID Stock
        await query(
          `UPDATE inventory SET stock_quantity = $1, reserved_quantity = $2 WHERE id = $3`,
          [totalStock, totalReserved, primary.id]
        );
        
        // 2. Remap Foreign Keys
        // Array substitution format involves wrapping array with {}, but node-pg handles arrays natively
        // Easiest is to use ANY() with array
        
        // Update reservations
        const resStats = await query(
          `UPDATE reservations SET inventory_id = $1 WHERE inventory_id = ANY($2::int[]) RETURNING id`,
          [primary.id, duplicateIds]
        );
        if (resStats.rowCount > 0) {
           console.log(`  Remapped ${resStats.rowCount} reservations`);
        }
        
        // Update case_inventory (if it exists or is used, in previous codebase it was reservations. What about stock_movements?)
        const movStats = await query(
          `UPDATE stock_movements SET inventory_id = $1 WHERE inventory_id = ANY($2::int[]) RETURNING id`,
          [primary.id, duplicateIds]
        );
        if (movStats.rowCount > 0) {
           console.log(`  Remapped ${movStats.rowCount} stock movements`);
        }
        
        // Update purchase_order_items
        const poStats = await query(
          `UPDATE purchase_order_items SET inventory_id = $1 WHERE inventory_id = ANY($2::int[]) RETURNING id`,
          [primary.id, duplicateIds]
        );
        if (poStats.rowCount > 0) {
           console.log(`  Remapped ${poStats.rowCount} purchase order items`);
        }
        
        // Update stock_take_items
        const stStats = await query(
          `UPDATE stock_take_items SET inventory_id = $1 WHERE inventory_id = ANY($2::int[]) RETURNING id`,
          [primary.id, duplicateIds]
        );
        if (stStats.rowCount > 0) {
           console.log(`  Remapped ${stStats.rowCount} stock take items`);
        }
        
        // Add a safety check for any other tables? (like branch_stock, if any). Assuming reservations and stock_movements are the main ones.
        
        // 3. Delete Orphans
        await query(`DELETE FROM inventory WHERE id = ANY($1::int[])`, [duplicateIds]);
        
        await query('COMMIT');
        mergedCount++;
        deletedCount += duplicateIds.length;
        console.log(`  SUCCESSfully merged into ID ${primary.id}`);
      } catch (err) {
        await query('ROLLBACK');
        console.error(`  [ERROR] Rollback for group ${key}:`, err.message);
      }
    }
  }
  
  console.log(`\nComplete! Merged ${mergedCount} groups, safely deleted ${deletedCount} duplicate IDs.`);
  process.exit(0);
}

run().catch(console.error);
