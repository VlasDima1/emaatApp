/**
 * Database Initialization Script
 * Run with: npm run db:init
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const dbConfig = {
    server: process.env.DB_SERVER || 'localhost',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
    }
};

async function initDatabase() {
    let pool = null;
    
    try {
        console.log('🔄 Connecting to SQL Server...');
        pool = await sql.connect(dbConfig);
        
        console.log('📄 Reading schema file...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by GO statements and execute each batch
        const batches = schema.split(/\nGO\s*\n/i).filter(batch => batch.trim());
        
        console.log(`🔄 Executing ${batches.length} SQL batches...`);
        
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i].trim();
            if (batch) {
                try {
                    await pool.request().query(batch);
                    process.stdout.write('.');
                } catch (err) {
                    console.error(`\n❌ Error in batch ${i + 1}:`, err.message);
                    // Continue with other batches
                }
            }
        }
        
        console.log('\n✅ Database initialization completed!');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

initDatabase();
