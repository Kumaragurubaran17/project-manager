import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const connectionString = "postgresql://postgres:kumaraguru555@db.toszjruvwxuizhhbtoye.supabase.co:5432/postgres";

async function migrate() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Connected to Supabase Postgres.");

        const schemaSql = fs.readFileSync('./supabase_schema.sql', 'utf8');
        console.log("Reading schema from supabase_schema.sql...");

        await client.query(schemaSql);
        console.log("Migration successful! Tables created.");

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
        console.log("Connection closed.");
    }
}

migrate();
