"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProductToHit = mapProductToHit;
exports.searchProducts = searchProducts;
const prisma_1 = __importDefault(require("../../shared/database/prisma"));
// Levenshtein distance for typo-tolerant matching
function levenshteinDistance(s1, s2) {
    const a = s1.toLowerCase();
    const b = s2.toLowerCase();
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1 // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
// Sacred & common spiritual fragrance synonyms/keywords
const SYNONYMS = {
    incense: ['agarbatti', 'sticks', 'flora', 'mehak', 'pooja'],
    agarbatti: ['incense', 'sticks', 'flora', 'mehak', 'agarbati', 'agarbathy'],
    agarbati: ['agarbatti', 'incense', 'sticks', 'flora'],
    camphor: ['karpooram', 'karpoor', 'karppor', 'bhimseni', 'aarti', 'tablets', 'rounds', 'purification', 'dani'],
    camphr: ['camphor', 'karpooram', 'bhimseni'],
    kamphor: ['camphor', 'bhimseni'],
    karpoor: ['camphor', 'karpooram', 'karppor', 'bhimseni', 'dani'],
    karppor: ['camphor', 'karpoor', 'karpooram', 'bhimseni', 'dani'],
    karpooram: ['camphor', 'bhimseni', 'aarti'],
    bhimseni: ['camphor', 'bhimseni camphor', 'pacha karpoor'],
    'pacha karpoor': ['camphor', 'bhimseni', 'edible camphor', 'green camphor'],
    dhoop: ['stick', 'bamboo-less', 'bakhoor', 'mehak', 'cone', 'fragrance', 'dhup'],
    dhup: ['dhoop', 'stick', 'fragrance'],
    bakhoor: ['dhoop', 'indian bakhoor', 'incense'],
    mehak: ['dhoop', 'italian mehak', 'incense'],
    'family pack': ['family', 'pack', 'combo', 'loban', '10 in 1', '4 in 1'],
    sambrani: ['loban', 'benzoin', 'cup sambrani', 'flora', 'kasturi', 'cardamom', 'kesar'],
    sambrni: ['sambrani', 'loban', 'cup sambrani'],
    sambirani: ['sambrani', 'loban'],
    loban: ['sambrani', 'dhoop', 'purification', 'resin'],
    luban: ['loban', 'sambrani'],
    kasturi: ['sambrani', 'musk', 'aroma'],
    cardamom: ['sambrani', 'elachi', 'elaichi'],
    kesar: ['saffron', 'sambrani', 'loban'],
    sandal: ['chandan', 'sandalwood', 'dhoop'],
    chandan: ['sandal', 'sandalwood', 'dhoop'],
};
function mapProductToHit(p) {
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
        couponCode: p.couponCode || null,
    };
}
async function searchProducts(options) {
    const startTime = Date.now();
    const query = (options.q || '').trim();
    const limit = Math.min(100, Math.max(1, options.limit || (options.type === 'autocomplete' ? 6 : 20)));
    const offset = Math.max(0, options.offset || 0);
    if (!query) {
        return {
            success: true,
            query: '',
            totalHits: 0,
            hits: [],
            suggestions: [],
            processingTimeMs: Date.now() - startTime,
            source: 'postgres',
        };
    }
    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter(Boolean);
    // Fetch active products with categories and images from PostgreSQL
    const whereClause = {
        deletedAt: null,
        isActive: true,
    };
    if (options.category && options.category !== 'all') {
        whereClause.categories = {
            some: {
                category: {
                    OR: [
                        { slug: options.category },
                        { name: { equals: options.category, mode: 'insensitive' } },
                    ],
                },
            },
        };
    }
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        whereClause.price = {};
        if (options.minPrice !== undefined)
            whereClause.price.gte = options.minPrice;
        if (options.maxPrice !== undefined)
            whereClause.price.lte = options.maxPrice;
    }
    const products = await prisma_1.default.product.findMany({
        where: whereClause,
        include: {
            images: { orderBy: { displayOrder: 'asc' } },
            categories: { include: { category: true } },
        },
    });
    const scored = [];
    const suggestionsSet = new Set();
    for (const p of products) {
        const hit = mapProductToHit(p);
        const nameLower = hit.name.toLowerCase();
        const descLower = (hit.description || '').toLowerCase();
        const shortDescLower = (hit.shortDescription || '').toLowerCase();
        const catNamesLower = hit.categories.map((c) => c.toLowerCase());
        const catCombined = catNamesLower.join(' ');
        const tagsCombined = hit.tags.join(' ');
        let score = 0;
        const nameWords = nameLower.split(/\s+/);
        // Check full query match
        if (nameLower === queryLower) {
            score += 150;
        }
        else if (nameLower.startsWith(queryLower)) {
            score += 100;
        }
        else if (nameLower.includes(queryLower)) {
            score += 80;
        }
        else if (catCombined.includes(queryLower)) {
            score += 65;
        }
        else if (tagsCombined.includes(queryLower)) {
            score += 50;
        }
        else if (descLower.includes(queryLower) || shortDescLower.includes(queryLower)) {
            score += 30;
        }
        // Check token-level and typo-tolerant matches
        for (const q of queryTokens) {
            // 1. Exact token match in name
            if (nameWords.includes(q)) {
                score += 50;
            }
            else if (nameLower.includes(q)) {
                score += 35;
            }
            // 2. Token match in categories
            if (catCombined.includes(q)) {
                score += 40;
            }
            // 3. Token match in tags & spiritual synonyms
            if (tagsCombined.includes(q)) {
                score += 35;
            }
            const syns = SYNONYMS[q] || [];
            for (const syn of syns) {
                if (nameLower.includes(syn) || catCombined.includes(syn) || tagsCombined.includes(syn)) {
                    score += 40;
                }
            }
            // 4. Token match in description
            if (descLower.includes(q) || shortDescLower.includes(q)) {
                score += 20;
            }
            // 5. Typo-tolerance (Levenshtein distance) on word tokens
            const targetWords = [...nameWords, ...catNamesLower.flatMap((c) => c.split(/\s+/))];
            for (const tw of targetWords) {
                if (tw.length < 3)
                    continue;
                const maxDist = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
                const dist = levenshteinDistance(q, tw);
                if (dist > 0 && dist <= maxDist) {
                    const sim = 1 - dist / Math.max(q.length, tw.length);
                    score += Math.round(sim * 45); // up to ~40 points for 1-char typo
                }
            }
        }
        if (score > 0) {
            scored.push({ hit, score });
            suggestionsSet.add(hit.name);
            hit.categories.forEach((cat) => suggestionsSet.add(cat));
        }
    }
    // Sort by score DESC, then isFeatured DESC, then displayOrder ASC
    scored.sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        if (b.hit.isFeatured !== a.hit.isFeatured)
            return b.hit.isFeatured ? 1 : -1;
        return a.hit.name.localeCompare(b.hit.name);
    });
    const totalHits = scored.length;
    const paginatedHits = scored.slice(offset, offset + limit).map((s) => s.hit);
    const suggestions = Array.from(suggestionsSet).slice(0, 8);
    return {
        success: true,
        query,
        totalHits,
        hits: paginatedHits,
        suggestions,
        processingTimeMs: Date.now() - startTime,
        source: 'postgres',
    };
}
