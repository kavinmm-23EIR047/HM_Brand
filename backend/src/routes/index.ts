import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import productsRoutes from '../modules/products/products.routes';
import categoriesRoutes from '../modules/categories/categories.routes';
import collectionsRoutes from '../modules/collections/collections.routes';
import festivalsRoutes from '../modules/festivals/festivals.routes';
import bannersRoutes from '../modules/banners/banners.routes';
import homepageRoutes from '../modules/homepage/homepage.routes';
import ordersRoutes from '../modules/orders/orders.routes';
import contactRoutes from '../modules/contact/contact.routes';
import newsletterRoutes from '../modules/newsletter/newsletter.routes';
import wishlistRoutes from '../modules/wishlist/wishlist.routes';
import couponsRoutes from '../modules/coupons/coupons.routes';
import adminRoutes from '../modules/admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/collections', collectionsRoutes);
router.use('/festivals', festivalsRoutes);
router.use('/banners', bannersRoutes);
router.use('/homepage', homepageRoutes);
router.use('/orders', ordersRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/coupons', couponsRoutes);
router.use('/admin', adminRoutes);

export default router;
