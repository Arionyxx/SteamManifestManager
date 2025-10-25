import pool from '../db/config.js';

export const getAllManifests = async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM manifests';
    let params = [];
    
    if (search) {
      query += ' WHERE game_name ILIKE $1 OR app_id LIKE $1';
      params.push(`%${search}%`);
      query += ` ORDER BY uploaded_at DESC LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` ORDER BY uploaded_at DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching manifests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getManifestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM manifests WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Manifest not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching manifest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadManifest = async (req, res) => {
  try {
    const { app_id, game_name, uploader_name, notes } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    if (!app_id || !game_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: app_id, game_name' 
      });
    }
    
    // Extract depot_id and manifest_id from filename
    // Expected formats: 
    // - depot_XXXXX_manifest_YYYYY.manifest
    // - XXXXX_YYYYY.manifest
    // - manifest_YYYYY.lua
    const filename = file.originalname;
    let depot_id = null;
    let manifest_id = null;
    
    // Try to extract from filename patterns
    const depotManifestPattern = /depot[_-]?(\d+)[_-]?manifest[_-]?(\d+)/i;
    const simplePattern = /(\d+)[_-](\d+)/;
    const manifestOnlyPattern = /manifest[_-]?(\d+)/i;
    
    let match = filename.match(depotManifestPattern);
    if (match) {
      depot_id = match[1];
      manifest_id = match[2];
    } else {
      match = filename.match(simplePattern);
      if (match) {
        depot_id = match[1];
        manifest_id = match[2];
      } else {
        match = filename.match(manifestOnlyPattern);
        if (match) {
          manifest_id = match[1];
        }
      }
    }
    
    // If we couldn't extract manifest_id, use filename without extension
    if (!manifest_id) {
      manifest_id = filename.replace(/\.(manifest|lua|acf|txt)$/i, '');
    }
    
    const fileContent = file.buffer.toString('utf-8');
    
    const result = await pool.query(
      `INSERT INTO manifests 
       (app_id, game_name, depot_id, manifest_id, file_content, file_size, uploader_name, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (app_id, depot_id, manifest_id) 
       DO UPDATE SET 
         file_content = EXCLUDED.file_content,
         file_size = EXCLUDED.file_size,
         updated_at = CURRENT_TIMESTAMP,
         uploader_name = EXCLUDED.uploader_name,
         notes = EXCLUDED.notes
       RETURNING *`,
      [app_id, game_name, depot_id, manifest_id, fileContent, file.size, uploader_name, notes]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error uploading manifest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteManifest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM manifests WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Manifest not found' });
    }
    
    res.json({ success: true, message: 'Manifest deleted successfully' });
  } catch (error) {
    console.error('Error deleting manifest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_manifests,
        COUNT(DISTINCT app_id) as unique_games,
        SUM(file_size) as total_size,
        MAX(uploaded_at) as last_upload
      FROM manifests
    `);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
