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
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/manifests', getAllManifests);
router.get('/manifests/stats', getStats);
router.get('/manifests/:id', getManifestById);

// Admin-only routes
router.post('/manifests/upload', authenticateToken, requireAdmin, upload.fields([{ name: 'manifest', maxCount: 10 }, { name: 'lua', maxCount: 1 }]), uploadManifest);
router.put('/manifests/:id', authenticateToken, requireAdmin, updateManifest);
router.delete('/manifests/:id', authenticateToken, requireAdmin, deleteManifest);

export default router;
