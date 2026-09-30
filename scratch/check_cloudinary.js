const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

const { v2: cloudinary } = require('../backend/node_modules/cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function checkCloudinaryResources() {
  console.log('Searching Cloudinary resources in hm_brand...');
  try {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'hm_brand/',
      max_results: 50,
    });
    console.log('Found resources:', res.resources.map(r => ({
      public_id: r.public_id,
      format: r.format,
      secure_url: r.secure_url,
      created_at: r.created_at,
    })));
  } catch (err) {
    console.error('Error fetching resources:', err);
  }
}

checkCloudinaryResources();
