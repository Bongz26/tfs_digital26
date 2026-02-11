const { query } = require('./config/db');

async function listTables() {
    try {
        console.log('--- Listing All Public Tables (via db.js) ---');
        const res = await query(\`
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        \`);
        console.log('Tables:', JSON.stringify(res.rows.map(r => r.tablename), null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        // We'll let it time out or the pool is a singleton
        process.exit(0);
    }
}

listTables();
