import { Router } from 'express';
import multer from 'multer';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';
import { mediaController } from './media.controller';

const router = Router();
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
});

router.post('/admin/upload', authenticateJWT, requireRole('ADMIN'), upload.single('file'), mediaController.upload);
router.delete('/admin/:type/:entityId', authenticateJWT, requireRole('ADMIN'), mediaController.delete);

export default router;
