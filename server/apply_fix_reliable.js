const { query } = require('./config/db');
const fs = require('fs');
const path = require('path');

async function applyFix() {
    console.log('--- Applying reserve_stock relaxation using db.js ---');
    const sqlPath = path.join(__dirname, 'database', 'functions', 'create_reservation_functions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        await query(sql);
        console.log('✅ SQL migration successfully applied via db.js query helper.');
    } catch (err) {
        console.error('❌ Failed to execute SQL:', err.message);
    } finally {
        // The pool might still have active connections, typically we'd end it if this were a script.
        // But since db.js uses a singleton, we might just let it exit or explicitly close if we can reach the pool.
        process.exit(0);
    }
}

applyFix();
