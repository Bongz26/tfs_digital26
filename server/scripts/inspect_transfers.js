const { query } = require('../config/db');

async function inspectTransfers() {
    try {
        console.log('--- Inspecting Active/Pending Transfers ---');
        const res = await query("SELECT id, transfer_number, from_location, to_location, items, status FROM stock_transfers WHERE status != 'completed' AND status != 'cancelled'");
        const transfers = res.rows;
        
        if (transfers.length === 0) {
            console.log('No active/pending transfers found.');
        } else {
            console.log(`Found ${transfers.length} transfers.`);
            transfers.forEach(t => {
                console.log(`\n[${t.status.toUpperCase()}] ${t.transfer_number}: ${t.from_location} -> ${t.to_location}`);
                if (Array.isArray(t.items)) {
                    t.items.forEach(item => {
                        console.log(`  - ${item.name || 'Unnamed'} (ID: ${item.inventory_id}, Qty: ${item.quantity}, Model: ${item.model || 'N/A'}, Color: ${item.color || 'N/A'})`);
                    });
                } else {
                    console.log('  Items is not an array:', t.items);
                }
            });
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspectTransfers();
