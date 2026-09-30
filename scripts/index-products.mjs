import { Meilisearch } from 'meilisearch';

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const INDEX_NAME = 'products';

async function indexProducts() {
  console.log(`[Meilisearch Indexer] Connecting to Meilisearch at ${MEILISEARCH_HOST}...`);
  const client = new Meilisearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY || undefined,
  });

  // Verify connection
  const health = await client.health();
  console.log('[Meilisearch Indexer] Connection verified. Health:', health);

  // Fetch all products from PostgreSQL/database via backend API
  console.log(`[Meilisearch Indexer] Fetching products from database via ${API_URL}/products...`);
  let products = [];
  try {
    const res = await fetch(`${API_URL}/products?limit=500&includeInactive=true`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      products = json.data;
    }
  } catch (err) {
    console.warn('[Meilisearch Indexer] Could not fetch from backend HTTP API, trying direct database query...', err.message);
  }

  // Fallback to static products list if backend is not responding
  if (products.length === 0) {
    console.log('[Meilisearch Indexer] Querying database directly...');
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient({
        datasources: { db: { url: 'file:./backend/prisma/dev.db' } },
      });
      const dbProducts = await prisma.product.findMany({
        where: { deletedAt: null },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          categories: { include: { category: true } },
        },
      });
      products = dbProducts;
      await prisma.$disconnect();
    } catch (e) {
      console.warn('[Meilisearch Indexer] Direct prisma import fallback:', e.message);
    }
  }

  if (products.length === 0) {
    console.error('[Meilisearch Indexer] Error: No products found in database to index.');
    process.exit(1);
  }

  console.log(`[Meilisearch Indexer] Found ${products.length} products to index.`);

  // Create or get index
  console.log(`[Meilisearch Indexer] Ensuring '${INDEX_NAME}' index exists...`);
  let index;
  try {
    index = await client.getIndex(INDEX_NAME);
  } catch (err) {
    const task = await client.createIndex(INDEX_NAME, { primaryKey: 'id' });
      await client.tasks.waitForTask(task.taskUid);
    index = client.index(INDEX_NAME);
  }

  // Configure index settings: ranking rules, searchable attributes, typo tolerance
  console.log('[Meilisearch Indexer] Updating settings (searchableAttributes, rankingRules, typoTolerance)...');
  const settingsTask = await index.updateSettings({
    searchableAttributes: [
      'name',
      'category',
      'categories',
      'tags',
      'keywords',
      'shortDescription',
      'description',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
    displayedAttributes: [
      'id',
      'name',
      'slug',
      'sku',
      'description',
      'shortDescription',
      'category',
      'categories',
      'tags',
      'keywords',
      'price',
      'mrp',
      'image',
      'inStock',
      'isFeatured',
      'couponCode',
    ],
    filterableAttributes: ['category', 'categories', 'inStock', 'isFeatured', 'price'],
    sortableAttributes: ['price'],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 7,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    },
  });
  await client.tasks.waitForTask(settingsTask.taskUid);

  // Map products to Meilisearch documents
  const documents = products.map((p) => {
    const primaryImg =
      p.images?.find((img) => img.isPrimary)?.url ||
      p.images?.[0]?.url ||
      p.image ||
      '/images/media_1790142713668.jpg';

    const categoryName =
      p.categories?.[0]?.category?.name ||
      p.categories?.[0]?.name ||
      p.category ||
      'Agarbatti & Flora';

    const categoryList = [];
    if (Array.isArray(p.categories)) {
      p.categories.forEach((catRel) => {
        const cName = catRel?.category?.name || catRel?.name;
        if (cName && !categoryList.includes(cName)) categoryList.push(cName);
      });
    }
    if (categoryName && !categoryList.includes(categoryName)) {
      categoryList.push(categoryName);
    }

    const tags = [];
    const keywords = [];
    const words = `${p.name} ${categoryName}`.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    words.forEach((w) => {
      if (!keywords.includes(w)) keywords.push(w);
    });

    if (p.name.toLowerCase().includes('agarbatti') || categoryName.toLowerCase().includes('agarbatti')) {
      tags.push('agarbatti', 'incense', 'sticks', 'pooja');
    }
    if (p.name.toLowerCase().includes('camphor') || categoryName.toLowerCase().includes('camphor')) {
      tags.push('camphor', 'karpooram', 'aarti', 'purification', 'bhimseni');
    }
    if (p.name.toLowerCase().includes('dhoop') || categoryName.toLowerCase().includes('dhoop')) {
      tags.push('dhoop', 'stick', 'cone', 'fragrance');
    }
    if (p.name.toLowerCase().includes('sambrani') || categoryName.toLowerCase().includes('sambrani')) {
      tags.push('sambrani', 'loban', 'benzoin', 'cup sambrani');
    }

    return {
      id: String(p.id || p.slug),
      name: p.name || '',
      slug: p.slug || '',
      sku: p.sku || '',
      description: p.description || p.name || '',
      shortDescription: p.shortDescription || p.note || '',
      category: categoryName,
      categories: categoryList,
      tags,
      keywords,
      price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0)) || 0,
      mrp: typeof p.mrp === 'number' ? p.mrp : parseFloat(String(p.mrp || p.price || 0)) || 0,
      image: primaryImg,
      inStock: p.stockQuantity !== undefined ? p.stockQuantity > 0 : p.inStock ?? true,
      isFeatured: Boolean(p.isFeatured),
      couponCode: p.couponCode || undefined,
    };
  });

  console.log(`[Meilisearch Indexer] Indexing ${documents.length} documents into '${INDEX_NAME}'...`);
  const addDocTask = await index.addDocuments(documents, { primaryKey: 'id' });
  await client.tasks.waitForTask(addDocTask.taskUid);

  const stats = await index.getStats();
  console.log('\n======================================================');
  console.log('✅ MEILISEARCH INDEXING SUCCESSFUL!');
  console.log(`Index Name:             ${INDEX_NAME}`);
  console.log(`Total Documents Index:  ${stats.numberOfDocuments}`);
  console.log(`Database Source:        PostgreSQL / Prisma Database`);
  console.log('======================================================\n');

  documents.forEach((d, idx) => {
    console.log(`${idx + 1}. [${d.sku || d.id}] ${d.name} (${d.category}) - ₹${d.price}`);
  });
}

indexProducts().catch((err) => {
  console.error('[Meilisearch Indexer] Fatal Error:', err);
  process.exit(1);
});
