import express from 'express';
import multer from 'multer';
import {
  getAllManifests,
  getManifestById,
  uploadManifest,
  deleteManifest,
  getStats
} from '../controllers/manifestController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/manifests', getAllManifests);
router.get('/manifests/stats', getStats);
router.get('/manifests/:id', getManifestById);
router.post('/manifests/upload', upload.fields([{ name: 'manifest', maxCount: 1 }, { name: 'lua', maxCount: 1 }]), uploadManifest);
router.delete('/manifests/:id', deleteManifest);

export default router;
