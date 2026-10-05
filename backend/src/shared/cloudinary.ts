import { v2 as cloudinary } from 'cloudinary';
import { BadRequestError } from './errors/custom.error';

let configured = false;

function getCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new BadRequestError('Cloudinary is not configured on this server.');
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export interface CloudinaryUpload {
  secureUrl: string;
  publicId: string;
}

export interface CloudinaryImageTarget {
  folder: string;
  publicId: string;
}

function validateTarget({ folder, publicId }: CloudinaryImageTarget): void {
  if (!folder.startsWith('hm_brand/') || !/^[a-z0-9/_-]+$/.test(folder) || !/^[a-z0-9-]+$/.test(publicId)) {
    throw new BadRequestError('Invalid Cloudinary image target.');
  }
}

export async function uploadImage(buffer: Buffer, target: CloudinaryImageTarget): Promise<CloudinaryUpload> {
  validateTarget(target);
  const client = getCloudinary();
  const result = await new Promise<{ public_id: string; version: number | string; format?: string; secure_url?: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        resource_type: 'image',
        format: 'webp',
        // `folder` is required: it controls the Media Library folder, not merely the URL.
        folder: target.folder,
        // Dynamic-folder Cloudinary accounts use this value for the Media Library location.
        asset_folder: target.folder,
        public_id: target.publicId,
        overwrite: true,
        invalidate: true,
      },
      (error, uploadResult) => error || !uploadResult ? reject(error || new Error('Cloudinary did not return an upload result.')) : resolve(uploadResult as any)
    );
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

export async function replaceImage(
  buffer: Buffer,
  target: CloudinaryImageTarget,
  previousPublicId?: string
): Promise<CloudinaryUpload> {
  const uploaded = await uploadImage(buffer, target);
  if (previousPublicId && previousPublicId !== uploaded.publicId) {
    await deleteImage(previousPublicId);
  }
  return uploaded;
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId.startsWith('hm_brand/')) return;
  const client = getCloudinary();
  const result = await client.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error('Cloudinary could not delete the image.');
  }
}
