import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
  origin: '*', // Allow all origins for Tailscale access
  credentials: true
}));
// Increase body size limit to 10MB for profile pictures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', manifestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
