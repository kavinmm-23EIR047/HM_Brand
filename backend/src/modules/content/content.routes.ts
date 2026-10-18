import { Router } from 'express';
import prisma from '../../shared/database/prisma';
import { authenticateJWT, requireRole } from '../../shared/middlewares/auth.middleware';
import { sendSuccess } from '../../shared/utils/response.util';
import { generateSlug } from '../../shared/utils/slug.util';
import { ConflictError } from '../../shared/errors/custom.error';

const router = Router();

const db = prisma as any;

router.get('/pages/:page', async (req, res, next) => {
  try {
    const page = await db.siteContent.findUnique({ where: { page: req.params.page } });
    return sendSuccess(res, page?.content ?? null, 'Page content retrieved');
  } catch (error) { return next(error); }
});

router.put('/pages/:page', authenticateJWT, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const saved = await db.siteContent.upsert({
      where: { page: req.params.page },
      create: { page: req.params.page, content: req.body.content ?? {} },
      update: { content: req.body.content ?? {} },
    });
    return sendSuccess(res, saved.content, 'Page content saved');
  } catch (error) { return next(error); }
});

router.get('/blog', async (_req, res, next) => {
  try {
    const posts = await db.blogPost.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }] });
    return sendSuccess(res, posts, 'Published articles retrieved');
  } catch (error) { return next(error); }
});

router.get('/blog/admin', authenticateJWT, requireRole('ADMIN'), async (_req, res, next) => {
  try {
    const posts = await db.blogPost.findMany({ orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }] });
    return sendSuccess(res, posts, 'Articles retrieved');
  } catch (error) { return next(error); }
});

router.post('/blog/admin', authenticateJWT, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(req.body.title);
    if (await db.blogPost.findUnique({ where: { slug } })) throw new ConflictError(`Article slug '${slug}' is already in use.`);
    const post = await db.blogPost.create({ data: { ...req.body, slug } });
    return sendSuccess(res, post, 'Article created', 201);
  } catch (error) { return next(error); }
});

router.patch('/blog/admin/:id', authenticateJWT, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { slug, title, ...rest } = req.body;
    const newSlug = slug || title ? generateSlug(slug || title) : undefined;
    if (newSlug) {
      const existing = await db.blogPost.findUnique({ where: { slug: newSlug } });
      if (existing && existing.id !== req.params.id) throw new ConflictError(`Article slug '${newSlug}' is already in use.`);
    }
    const post = await db.blogPost.update({ where: { id: req.params.id }, data: { ...rest, ...(title ? { title } : {}), ...(newSlug ? { slug: newSlug } : {}) } });
    return sendSuccess(res, post, 'Article updated');
  } catch (error) { return next(error); }
});

router.delete('/blog/admin/:id', authenticateJWT, requireRole('ADMIN'), async (req, res, next) => {
  try {
    await db.blogPost.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, 'Article deleted');
  } catch (error) { return next(error); }
});

export default router;
