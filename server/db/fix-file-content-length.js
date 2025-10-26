import pool from './config.js';

async function fixFileContentLength() {
  try {
    console.log('🔧 Fixing file_content column length...');

    // Change file_content from TEXT to BYTEA for better handling of large binary data
    // Or keep TEXT but ensure it's not limited
    await pool.query(`
      ALTER TABLE manifests 
      ALTER COLUMN file_content TYPE TEXT;
    `);

    // Also ensure notes and game_image can handle large values
    await pool.query(`
      ALTER TABLE manifests 
      ALTER COLUMN notes TYPE TEXT;
    `);

    await pool.query(`
      ALTER TABLE manifests 
      ALTER COLUMN game_image TYPE TEXT;
    `);

    // Check if there are any string_agg limits
    await pool.query(`
      SET SESSION max_standby_archive_delay = '300s';
      SET SESSION max_standby_streaming_delay = '300s';
    `);

    console.log('✅ File content length fix completed!');
    console.log('📝 TEXT columns can now handle unlimited data');
    
    // Get current max size
    const result = await pool.query(`
      SELECT 
        pg_column_size(file_content) as content_size,
        LENGTH(file_content) as content_length
      FROM manifests 
      ORDER BY pg_column_size(file_content) DESC 
      LIMIT 1;
    `);
    
    if (result.rows.length > 0) {
      console.log(`📊 Largest file_content: ${(result.rows[0].content_size / 1024 / 1024).toFixed(2)} MB`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

fixFileContentLength();
