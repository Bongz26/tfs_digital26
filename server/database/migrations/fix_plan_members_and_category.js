const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('🔄 Starting migration: fix_plan_members_and_category...');
        await client.query('BEGIN');

        // 1. Alter plan_members from integer to VARCHAR(50)
        console.log('1. Altering cases.plan_members to VARCHAR(50)...');
        await client.query(`
            ALTER TABLE cases 
            ALTER COLUMN plan_members TYPE VARCHAR(50) USING plan_members::text;
        `);
        console.log('✅ cases.plan_members is now VARCHAR(50)');

        // 2. Update cases_plan_category_check constraint to include 'pamphlet'
        console.log('2. Updating cases_plan_category_check constraint to include "pamphlet"...');
        await client.query(`
            ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_plan_category_check;
        `);
        await client.query(`
            ALTER TABLE cases 
            ADD CONSTRAINT cases_plan_category_check 
            CHECK (((plan_category)::text = ANY ((ARRAY[
                'motjha'::character varying, 
                'single'::character varying, 
                'family'::character varying, 
                'colour_grade'::character varying, 
                'specials'::character varying,
                'pamphlet'::character varying
            ])::text[])));
        `);
        console.log('✅ cases_plan_category_check constraint updated');

        // 3. Update create_case_atomic function if it exists
        console.log('3. Updating create_case_atomic function if present...');
        const funcCheck = await client.query(`
            SELECT proname FROM pg_proc WHERE proname = 'create_case_atomic';
        `);
        if (funcCheck.rows.length > 0) {
            const fs = require('fs');
            const sqlPath = path.join(__dirname, '..', 'functions', 'create_case_atomic.sql');
            if (fs.existsSync(sqlPath)) {
                let sql = fs.readFileSync(sqlPath, 'utf8');
                // Replace integer cast with varchar cast for plan_members
                sql = sql.replace(/\(case_data->>'plan_members'\)::INT/g, "(case_data->>'plan_members')::VARCHAR");
                fs.writeFileSync(sqlPath, sql, 'utf8');
                await client.query(sql);
                console.log('✅ create_case_atomic function reloaded');
            }
        }

        await client.query('COMMIT');
        console.log('🎉 Migration committed successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
