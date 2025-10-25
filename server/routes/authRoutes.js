import express from 'express';
import { register, login, getProfile, updateUsername, updatePassword, updateProfilePicture } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile/username', authenticateToken, updateUsername);
router.put('/profile/password', authenticateToken, updatePassword);
router.put('/profile/picture', authenticateToken, updateProfilePicture);

export default router;
