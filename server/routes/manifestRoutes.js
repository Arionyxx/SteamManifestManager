import express from 'express';
import multer from 'multer';
import {
  getAllManifests,
  getManifestById,
  uploadManifest,
  deleteManifest,
  updateManifest,
  getStats
} from '../controllers/manifestController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    fieldSize: 50 * 1024 * 1024, // 50MB limit for text fields (for base64 images)
    fields: 20, // Max number of non-file fields
    parts: 50 // Max number of parts (files + fields)
  }
});

// Public routes
router.get('/manifests', getAllManifests);
router.get('/manifests/stats', getStats);
router.get('/manifests/:id', getManifestById);

// Admin-only routes
router.post('/manifests/upload', authenticateToken, requireAdmin, upload.fields([{ name: 'manifest', maxCount: 10 }, { name: 'lua', maxCount: 1 }]), uploadManifest);
router.put('/manifests/:id', authenticateToken, requireAdmin, updateManifest);
router.delete('/manifests/:id', authenticateToken, requireAdmin, deleteManifest);

export default router;
