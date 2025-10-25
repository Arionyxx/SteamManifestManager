import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Validate required environment variables
if (!process.env.DB_PASSWORD) {
  console.error('❌ ERROR: DB_PASSWORD is not set in .env file!');
  console.error('');
  console.error('Please create a .env file with:');
  console.error('DB_PASSWORD=postgres');
  console.error('');
  console.error('Or run: create-env.bat (Windows) or ./create-env.sh (Mac/Linux)');
  process.exit(1);
}

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'steam_manifests',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

export default pool;
