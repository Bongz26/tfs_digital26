const { query } = require('./config/db');
const fs = require('fs');
const path = require('path');

async function forceRecreate() {
    console.log('--- Force Recreating Inventory Functions ---');

    const dropSql = `
        DROP FUNCTION IF EXISTS reserve_stock(INT, INT, TEXT);
        DROP FUNCTION IF EXISTS release_stock(INT, INT, TEXT);
        DROP FUNCTION IF EXISTS commit_stock(INT, INT, INT, TEXT);
    `;

    const sqlPath = path.join(__dirname, 'database', 'functions', 'create_reservation_functions.sql');
    const createSql = fs.readFileSync(sqlPath, 'utf8');

    try {
        console.log('Dropping old functions...');
        await query(dropSql);
        console.log('Recreating functions from file...');
        await query(createSql);
        console.log('✅ Functions successfully force-recreated.');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        process.exit(0);
    }
}

forceRecreate();
