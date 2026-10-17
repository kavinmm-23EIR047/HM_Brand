"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.replaceImage = replaceImage;
exports.deleteImage = deleteImage;
const cloudinary_1 = require("cloudinary");
const custom_error_1 = require("./errors/custom.error");
let configured = false;
function getCloudinary() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new custom_error_1.BadRequestError('Cloudinary is not configured on this server.');
    }
    if (!configured) {
        cloudinary_1.v2.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            secure: true,
        });
        configured = true;
    }
    return cloudinary_1.v2;
}
function validateTarget({ folder, publicId }) {
    if (!folder.startsWith('hm_brand/') || !/^[a-z0-9/_-]+$/.test(folder) || !/^[a-z0-9-]+$/.test(publicId)) {
        throw new custom_error_1.BadRequestError('Invalid Cloudinary image target.');
    }
}
async function uploadImage(buffer, target) {
    validateTarget(target);
    const client = getCloudinary();
    const result = await new Promise((resolve, reject) => {
        const stream = client.uploader.upload_stream({
            resource_type: 'image',
            format: 'webp',
            // `folder` is required: it controls the Media Library folder, not merely the URL.
            folder: target.folder,
            // Dynamic-folder Cloudinary accounts use this value for the Media Library location.
            asset_folder: target.folder,
            public_id: target.publicId,
            overwrite: true,
            invalidate: true,
        }, (error, uploadResult) => error || !uploadResult ? reject(error || new Error('Cloudinary did not return an upload result.')) : resolve(uploadResult));
        stream.end(buffer);
    });
    return {
        publicId: result.public_id,
        secureUrl: result.secure_url || client.url(result.public_id, {
            secure: true,
            version: result.version,
            format: result.format || 'webp',
        }),
    };
}
async function replaceImage(buffer, target, previousPublicId) {
    const uploaded = await uploadImage(buffer, target);
    if (previousPublicId && previousPublicId !== uploaded.publicId) {
        await deleteImage(previousPublicId);
    }
    return uploaded;
}
async function deleteImage(publicId) {
    if (!publicId.startsWith('hm_brand/'))
        return;
    const client = getCloudinary();
    const result = await client.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error('Cloudinary could not delete the image.');
    }
}
