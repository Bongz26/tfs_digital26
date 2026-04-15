const { query } = require('../config/db');

async function auditTransfers() {
    try {
        console.log('--- Auditing Completed Transfers for Name Mismatches ---');
        
        // 1. Get all completed transfers
        const res = await query(`
            SELECT id, transfer_number, items, to_location, received_at FROM stock_transfers 
            WHERE status = 'completed'
            ORDER BY received_at DESC
        `);
        const transfers = res.rows;
        
        console.log(`Analyzing ${transfers.length} completed transfers...`);
        
        for (const t of transfers) {
            // Find stock movements for this transfer
            const movRes = await query(`
                SELECT m.inventory_id, m.quantity_change, i.name as dest_name, i.model as dest_model, i.color as dest_color
                FROM stock_movements m
                JOIN inventory i ON m.inventory_id = i.id
                WHERE m.reason ILIKE $1
            `, [`%Transfer ${t.transfer_number}%`]);
            
            const movements = movRes.rows;
            if (movements.length === 0) continue;

            const transferItems = t.items || [];
            
            // Check each movement against the transfer items intent
            movements.forEach(m => {
                // If quantity change is positive, it's the "receive" side we care about
                if (m.quantity_change > 0) {
                    const intent = transferItems.find(it => 
                        // Try to find a match by quantity or name - this is fuzzy but should reveal mismatches
                        it.quantity == m.quantity_change
                    );
                    
                    if (intent) {
                        const intentName = (intent.name || '').trim().toUpperCase();
                        const destName = (m.dest_name || '').trim().toUpperCase();
                        
                        // If names are significantly different, it's a misfire
                        if (intentName && destName && !destName.includes(intentName) && !intentName.includes(destName)) {
                            console.log(`\n❌ MISFIRE FOUND: ${t.transfer_number}`);
                            console.log(`  Intent: ${intentName} (${intent.model} ${intent.color})`);
                            console.log(`  Result: ${destName} (ID: ${m.inventory_id}, ${m.dest_model} ${m.dest_color})`);
                            console.log(`  To Branch: ${t.to_location}`);
                        }
                    }
                }
            });
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

auditTransfers();
