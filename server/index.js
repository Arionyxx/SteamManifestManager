import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { WebSocketServer } from 'ws';
import http from 'http';
import manifestRoutes from './routes/manifestRoutes.js';
import authRoutes from './routes/authRoutes.js';
import pool from './db/config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Additional CORS headers for preflight requests
app.options('*', cors());
// Increase body size limit to 50MB for profile pictures and large manifests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', manifestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        error: 'File too large. Maximum size is 50MB per file.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      error: `Upload error: ${err.message}` 
    });
  }
  
  if (err) {
    console.error('Server error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
  
  next();
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket for real-time updates
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 Client connected to WebSocket');
  
  ws.on('close', () => {
    console.log('🔌 Client disconnected from WebSocket');
  });
});

// Broadcast to all connected clients
export const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify(data));
    }
  });
};

// Listen for database changes (using polling - for simple implementation)
let lastCheckTime = new Date();
setInterval(async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM manifests WHERE uploaded_at > $1 OR updated_at > $1',
      [lastCheckTime]
    );
    
    if (result.rows.length > 0) {
      broadcast({ type: 'manifest_update', data: result.rows });
      lastCheckTime = new Date();
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}, 5000); // Check every 5 seconds

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 WebSocket server running`);
  console.log(`🌐 Accessible via Tailscale at http://100.93.186.102:${PORT}`);
});
