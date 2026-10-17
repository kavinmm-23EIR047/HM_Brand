"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImageToWebp = optimizeImageToWebp;
const sharp_1 = __importDefault(require("sharp"));
const custom_error_1 = require("./errors/custom.error");
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp', 'gif', 'avif', 'jpg', 'heic', 'heif', 'tiff']);
/**
 * Validates and optimizes an image buffer using Sharp.
 * - Auto-rotates using EXIF orientation tag
 * - Resizes to max dimensions (default 1600x1600) preserving aspect ratio without enlargement
 * - Converts to WebP format (quality 85, effort 5)
 * - Removes unnecessary EXIF/IPTC metadata
 * - Ensures high visual quality suitable for e-commerce product listings
 */
async function optimizeImageToWebp(inputBuffer, options = {}) {
    if (!inputBuffer || inputBuffer.length === 0) {
        throw new custom_error_1.BadRequestError('An image file is required.');
    }
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB limit
    if (inputBuffer.length > MAX_FILE_SIZE) {
        throw new custom_error_1.BadRequestError('Image file size exceeds the 15 MB limit.');
    }
    const { maxDimension = 1600, maxWidth = maxDimension, maxHeight = maxDimension, quality = 85, effort = 5, } = options;
    let metadata;
    try {
        metadata = await (0, sharp_1.default)(inputBuffer).metadata();
    }
    catch (err) {
        throw new custom_error_1.BadRequestError('Invalid or corrupted image file.');
    }
    if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format.toLowerCase())) {
        throw new custom_error_1.BadRequestError(`Unsupported image format "${metadata.format || 'unknown'}". Allowed formats: JPEG, JPG, PNG, WebP, GIF, AVIF.`);
    }
    try {
        const pipeline = (0, sharp_1.default)(inputBuffer)
            .rotate() // Auto-rotate based on EXIF tag before metadata stripping
            .resize({
            width: maxWidth,
            height: maxHeight,
            fit: 'inside',
            withoutEnlargement: true,
        })
            .webp({
            quality,
            effort,
        });
        const optimizedBuffer = await pipeline.toBuffer();
        const outMetadata = await (0, sharp_1.default)(optimizedBuffer).metadata();
        return {
            buffer: optimizedBuffer,
            format: 'webp',
            width: outMetadata.width || metadata.width || 0,
            height: outMetadata.height || metadata.height || 0,
            size: optimizedBuffer.length,
            originalSize: inputBuffer.length,
        };
    }
    catch (err) {
        throw new custom_error_1.BadRequestError(`Image optimization failed: ${err?.message || 'Sharp processing error'}`);
    }
}
