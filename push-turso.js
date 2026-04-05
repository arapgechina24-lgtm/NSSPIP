const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const url = "libsql://nctirs-prod-arapgechina24-lgtm.aws-eu-west-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzUzOTUxNTksImlkIjoiMDE5ZDVkY2MtMzEwMS03YzMyLTkyZjgtZTQ2NDNiMjIxODM2IiwicmlkIjoiYzc5NTE2ZWEtMzZiYS00OGI3LWI1NTAtYzQ2MGU1MTQ3MjE3In0.PuYYJvwCI37wbFiqbyPRhm4ad-I_anQYDzDcjoz8Snxv8YPbgY4IrCEgZpX_3NdKbXGUGw04JAkaJkGRiXXkDw";

async function pushSchema() {
    try {
        console.log("Connecting to Turso database...");
        const client = createClient({ url, authToken });
        
        const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
        const folders = fs.readdirSync(migrationsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        if (folders.length === 0) throw new Error("No migration folder found.");
        const migrationFolder = folders[folders.length - 1];
        const sqlPath = path.join(migrationsDir, migrationFolder, 'migration.sql');
        console.log("Reading schema dump out of " + sqlPath);
        
        const sqlParams = fs.readFileSync(sqlPath, 'utf8');
        
        console.log("Injecting SQLite multiple schema configurations...");
        await client.executeMultiple(sqlParams);
        
        console.log("✅ Successfully instantiated schema on Turso Cloud!");
    } catch(err) {
        console.error("❌ Failed:", err);
        process.exit(1);
    }
}

pushSchema();
