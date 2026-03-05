const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkTables() {
    try {
        const context = await pool.query("SELECT current_database(), current_schema(), current_user, version()");
        console.log('--- CONNECTION CONTEXT ---');
        console.log('Database:', context.rows[0].current_database);
        console.log('Schema:', context.rows[0].current_schema);
        console.log('User:', context.rows[0].current_user);
        console.log('Version:', context.rows[0].version.split(',')[0]);

        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log('\n--- ALL PUBLIC TABLES ---');
        res.rows.forEach(r => console.log(` - ${r.table_name}`));

        try {
            const countRes = await pool.query("SELECT COUNT(*) FROM cases");
            console.log('\n✅ DIRECT QUERY SUCCESS! cases count:', countRes.rows[0].count);
        } catch (e) {
            console.error('\n❌ DIRECT QUERY FAILED:', e.message);
        }

        const casesSearch = await pool.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name ILIKE '%case%'");
        console.log('\n--- SEARCH RESULTS FOR "%case%" ---');
        casesSearch.rows.forEach(r => console.log(` - ${r.table_schema}.${r.table_name}`));
    } catch (err) {
        console.error('FAILED:', err.message);
    } finally {
        await pool.end();
    }
}

checkTables();
