const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) process.env[k.trim()] = v.trim();
});

const { v2: cloudinary } = require('../backend/node_modules/cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log('Testing Cloudinary config...');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

// 1x1 red PNG pixel
const sampleBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const target = {
  folder: 'hm_brand/products/test-cat/test-prod',
  publicId: 'test-img-1',
};

async function testUpload() {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: target.folder,
        asset_folder: target.folder,
        public_id: target.publicId,
        overwrite: true,
        invalidate: true,
      },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(sampleBuffer);
  });

  console.log('Upload Result:', JSON.stringify(result, null, 2));

  const generatedUrlWithoutFormat = cloudinary.url(result.public_id, {
    secure: true,
    version: result.version,
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  });

  const generatedUrlWithFormat = cloudinary.url(result.public_id, {
    secure: true,
    version: result.version,
    format: result.format,
    transformation: [{ fetch_format: 'auto', quality: 'auto' }],
  });

  console.log('Generated URL without format:', generatedUrlWithoutFormat);
  console.log('Generated URL WITH format:', generatedUrlWithFormat);
}

testUpload().catch(console.error);
