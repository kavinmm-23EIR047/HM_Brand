"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaProductToMeili = mapPrismaProductToMeili;
exports.syncProductToMeilisearch = syncProductToMeilisearch;
exports.removeProductFromMeilisearch = removeProductFromMeilisearch;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Meilisearch } = require('meilisearch');
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';
const PRODUCTS_INDEX_NAME = 'products';
let meiliClient = null;
function getClient() {
    if (!meiliClient) {
        meiliClient = new Meilisearch({
            host: MEILISEARCH_HOST,
            apiKey: MEILISEARCH_API_KEY || undefined,
        });
    }
    return meiliClient;
}
function mapPrismaProductToMeili(p) {
    const primaryImg = p.images?.find((img) => img.isPrimary)?.url ||
        p.images?.[0]?.url ||
        '/images/media_1790142713668.jpg';
    const categoryName = p.categories?.[0]?.category?.name ||
        p.category ||
        'Agarbatti & Flora';
    const categoryList = [];
    if (Array.isArray(p.categories)) {
        p.categories.forEach((catRel) => {
            const cName = catRel?.category?.name || catRel?.name;
            if (cName && !categoryList.includes(cName))
                categoryList.push(cName);
        });
    }
    if (categoryName && !categoryList.includes(categoryName)) {
        categoryList.push(categoryName);
    }
    const tags = [];
    const keywords = [];
    const words = `${p.name} ${categoryName}`.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    words.forEach((w) => {
        if (!keywords.includes(w))
            keywords.push(w);
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
        id: String(p.id),
        name: p.name || '',
        slug: p.slug || '',
        sku: p.sku || '',
        description: p.description || p.name || '',
        shortDescription: p.shortDescription || '',
        category: categoryName,
        categories: categoryList,
        tags,
        keywords,
        price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0)) || 0,
        mrp: typeof p.mrp === 'number' ? p.mrp : parseFloat(String(p.mrp || p.price || 0)) || 0,
        image: primaryImg,
        inStock: (p.stockQuantity ?? 1) > 0,
        isFeatured: Boolean(p.isFeatured),
        couponCode: p.couponCode || undefined,
    };
}
async function syncProductToMeilisearch(product) {
    try {
        const client = getClient();
        const doc = mapPrismaProductToMeili(product);
        const index = client.index(PRODUCTS_INDEX_NAME);
        await index.addDocuments([doc], { primaryKey: 'id' });
        console.log(`[Meilisearch] Synced product: "${product.name}" (${product.id})`);
    }
    catch (error) {
        console.warn(`[Meilisearch] Sync failed for product "${product?.name}":`, error?.message || error);
    }
}
async function removeProductFromMeilisearch(productId) {
    try {
        const client = getClient();
        const index = client.index(PRODUCTS_INDEX_NAME);
        await index.deleteDocument(productId);
        console.log(`[Meilisearch] Removed product ID from index: ${productId}`);
    }
    catch (error) {
        console.warn(`[Meilisearch] Remove failed for ID ${productId}:`, error?.message || error);
    }
}
