import pool from './config.js';

async function migrate() {
  try {
    console.log('🚀 Running database migrations...');

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
        UNIQUE(app_id, depot_id, manifest_id)
      );
    `);

    // Create index for faster searches
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_app_id ON manifests(app_id);
      CREATE INDEX IF NOT EXISTS idx_game_name ON manifests(game_name);
      CREATE INDEX IF NOT EXISTS idx_uploaded_at ON manifests(uploaded_at DESC);
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
