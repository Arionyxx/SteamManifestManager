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
    const { app_id, game_name, uploader_name, notes, game_image } = req.body;
    const manifestFiles = req.files?.manifest || [];
    const luaFile = req.files?.lua?.[0];
    
    if (manifestFiles.length === 0 && !luaFile) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    if (!app_id || !game_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: app_id, game_name' 
      });
    }
    
    // Extract depot_id and manifest_id from first manifest filename
    // Use first manifest file if available, otherwise lua file
    const primaryFile = manifestFiles[0] || luaFile;
    const filename = primaryFile.originalname;
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
    
    // Combine file contents as base64 to handle binary data
    let fileContent = '';
    let totalSize = 0;
    
    // Add all manifest files
    for (let i = 0; i < manifestFiles.length; i++) {
      const manifestFile = manifestFiles[i];
      if (i > 0) fileContent += '\n\n';
      fileContent += '=== MANIFEST FILE (BASE64) ===\n';
      fileContent += manifestFile.buffer.toString('base64');
      totalSize += manifestFile.size;
    }
    
    // Add lua file if present
    if (luaFile) {
      if (manifestFiles.length > 0) fileContent += '\n\n';
      fileContent += '=== LUA FILE (BASE64) ===\n';
      fileContent += luaFile.buffer.toString('base64');
      totalSize += luaFile.size;
    }
    
    const result = await pool.query(
      `INSERT INTO manifests 
       (app_id, game_name, depot_id, manifest_id, file_content, file_size, uploader_name, notes, game_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (app_id, depot_id, manifest_id) 
       DO UPDATE SET 
         file_content = EXCLUDED.file_content,
         file_size = EXCLUDED.file_size,
         updated_at = CURRENT_TIMESTAMP,
         uploader_name = EXCLUDED.uploader_name,
         notes = EXCLUDED.notes,
         game_image = EXCLUDED.game_image
       RETURNING *`,
      [app_id, game_name, depot_id, manifest_id, fileContent, totalSize, uploader_name, notes, game_image]
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

export const updateManifest = async (req, res) => {
  try {
    const { id } = req.params;
    const { game_name, notes, game_image, file_content, uploader_name } = req.body;
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (game_name !== undefined) {
      updates.push(`game_name = $${paramCount}`);
      values.push(game_name);
      paramCount++;
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }
    
    if (game_image !== undefined) {
      updates.push(`game_image = $${paramCount}`);
      values.push(game_image);
      paramCount++;
    }
    
    if (file_content !== undefined) {
      updates.push(`file_content = $${paramCount}`);
      values.push(file_content);
      paramCount++;
    }
    
    if (uploader_name !== undefined) {
      updates.push(`uploader_name = $${paramCount}`);
      values.push(uploader_name);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const query = `
      UPDATE manifests 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Manifest not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating manifest:', error);
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
