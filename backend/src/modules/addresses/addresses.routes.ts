import { Router } from 'express';
import { addressesController } from './addresses.controller';
import { authenticateJWT } from '../../shared/middlewares/auth.middleware';

const router = Router();

// All address routes require user authentication
router.use(authenticateJWT);

router.get('/', addressesController.getMyAddresses);
router.get('/default', addressesController.getDefaultAddress);
router.post('/', addressesController.createAddress);
router.patch('/:id', addressesController.updateAddress);
router.put('/:id', addressesController.updateAddress);
router.patch('/:id/default', addressesController.setDefaultAddress);
router.post('/:id/default', addressesController.setDefaultAddress);
router.delete('/:id', addressesController.deleteAddress);

export default router;
