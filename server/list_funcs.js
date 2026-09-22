const { query } = require('./config/db');

async function listFunctions() {
    console.log('--- Listing all reserve_stock functions ---');
    try {
        const res = await query(`
            SELECT n.nspname as schema, p.proname as name, pg_get_function_arguments(p.oid) as args
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE p.proname = 'reserve_stock';
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        process.exit(0);
    }
}

listFunctions();
