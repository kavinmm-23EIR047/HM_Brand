# Cloudinary deployment and legacy-image migration

Set these **Render backend** environment variables (never set the secret on Vercel):

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

No Cloudinary variable is required on Vercel. `NEXT_PUBLIC_API_URL` remains the only frontend setting used for uploads.

The production endpoint is `POST /api/v1/media/admin/upload`. It accepts one `file` plus a server-validated `type` and `entityId`; it is restricted to authenticated administrators. It does not accept arbitrary folders.

Existing URLs remain valid and are not modified automatically. To migrate an image, replace it from the Admin UI. The backend uploads it first and only then writes the Cloudinary HTTPS URL to PostgreSQL. For product images, `storageKey` stores the Cloudinary public ID; this supports safe deletes through the existing product-image delete endpoint.

Cloudinary asset paths are deterministic:

```text
hm_brand/products/{category-slug}/{product-slug}/{product-slug}[-n]
hm_brand/categories/{category-slug}/{category-slug}
hm_brand/banners/{banner-slug}
hm_brand/homepage/{section-slug}/{image-slug}
hm_brand/collections/{collection-slug}/{collection-slug}
hm_brand/festivals/{festival-slug}/{festival-slug}
hm_brand/other/{image-slug}
```

Cloudinary delivers uploaded assets with automatic format and quality transformations (`f_auto,q_auto`).
