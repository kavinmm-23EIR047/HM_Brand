import { Router } from 'express';
import multer from 'multer';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';
import { BadRequestError } from '../../shared/errors/custom.error';
import { mediaController } from './media.controller';

const router = Router();
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/tiff',
]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const ext = file.originalname?.split('.').pop()?.toLowerCase() || '';
    const allowedExt = new Set(['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'tif', 'tiff']);
    if (allowedMimeTypes.has(file.mimetype) || allowedExt.has(ext)) {
      callback(null, true);
    } else {
      callback(new BadRequestError(`Unsupported image format "${file.mimetype || ext}". Allowed formats: JPG, PNG, WebP, GIF, AVIF, HEIC.`));
    }
  },
});

router.post('/admin/upload', authenticateJWT, requireRole('ADMIN'), upload.single('file'), mediaController.upload);
router.delete('/admin/:type/:entityId', authenticateJWT, requireRole('ADMIN'), mediaController.delete);

export default router;
