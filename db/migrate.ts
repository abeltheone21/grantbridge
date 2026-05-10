import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URI;

if (!connectionString) {
  console.error('Error: DATABASE_URI is missing from environment variables.');
  process.exit(1);
}

async function migrate() {
  const client = new Client({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for some Supabase connections
    }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase Postgres.');

    const migrations = [
      'db/migrations/001_schema.sql',
      'db/migrations/002_rls_and_views.sql'
    ];

    for (const file of migrations) {
      console.log(`\n--- Running ${file} ---`);
      const filePath = path.resolve(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`Migration file not found: ${filePath}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the entire SQL file
      await client.query(sql);
      console.log(`Successfully applied ${file}`);
    }

    console.log('\n✅ All migrations applied successfully.');
  } catch (err) {
    console.error('\n❌ Migration failed:');
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
