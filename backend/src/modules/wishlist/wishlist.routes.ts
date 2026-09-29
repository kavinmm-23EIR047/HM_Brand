import { Router } from 'express';
import { wishlistController } from './wishlist.controller';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.add);
router.delete('/:productId', wishlistController.remove);

export default router;
