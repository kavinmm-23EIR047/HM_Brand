const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCrud() {
  const testSku = 'TEST-CRUD-' + Date.now();
  console.log('1. Testing Create...');
  const created = await prisma.product.create({
    data: {
      sku: testSku,
      name: 'Test Migration Product',
      slug: 'test-migration-product-' + Date.now(),
      description: 'Test description for migration validation',
      price: 99,
      mrp: 120,
    },
  });
  console.log('   ✅ Created product successfully: ID =', created.id);

  console.log('2. Testing Read...');
  const found = await prisma.product.findUnique({ where: { id: created.id } });
  if (!found || found.sku !== testSku) throw new Error('Product not found or SKU mismatch');
  console.log('   ✅ Read product successfully:', found.name);

  console.log('3. Testing Update...');
  const updated = await prisma.product.update({
    where: { id: created.id },
    data: { price: 109 },
  });
  if (updated.price !== 109) throw new Error('Price update failed');
  console.log('   ✅ Updated price successfully:', updated.price);

  console.log('4. Testing Delete...');
  await prisma.product.delete({ where: { id: created.id } });
  const checkDeleted = await prisma.product.findUnique({ where: { id: created.id } });
  if (checkDeleted !== null) throw new Error('Product still exists after deletion');
  console.log('   ✅ Verified deletion successfully (product is null)');

  console.log('\n🌟 All Prisma Postgres CRUD tests passed without issues!');
}

testCrud()
  .catch((e) => {
    console.error('❌ CRUD test error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
