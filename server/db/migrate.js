import pool from './config.js';

async function migrate() {
  try {
    console.log('🚀 Running database migrations...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        username_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        profile_picture TEXT
      );
    `);

    // Add username_changed_at column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // Add profile_picture column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_picture TEXT;
    `);

    // Create manifests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS manifests (
        id SERIAL PRIMARY KEY,
        app_id VARCHAR(50) NOT NULL,
        game_name VARCHAR(255) NOT NULL,
        depot_id VARCHAR(50),
        manifest_id VARCHAR(100) NOT NULL,
        file_content TEXT NOT NULL,
        file_size INTEGER,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploader_name VARCHAR(100),
        notes TEXT,
        game_image TEXT,
        UNIQUE(app_id, depot_id, manifest_id)
      );
    `);

    // Add game_image column if it doesn't exist (for existing databases)
    await pool.query(`
      ALTER TABLE manifests 
      ADD COLUMN IF NOT EXISTS game_image TEXT;
    `);

    // Create index for faster searches
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_app_id ON manifests(app_id);
      CREATE INDEX IF NOT EXISTS idx_game_name ON manifests(game_name);
      CREATE INDEX IF NOT EXISTS idx_uploaded_at ON manifests(uploaded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_username ON users(username);
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
