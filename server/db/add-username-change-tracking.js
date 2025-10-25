import pool from './config.js';

async function migrate() {
  try {
    console.log('🚀 Adding username change tracking...');

    // Add username_changed_at column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
