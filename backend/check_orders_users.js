const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();

async function main() {
  const updated = await p.coupon.update({
    where: { code: '1' },
    data: { minOrderAmount: 0 }
  });
  console.log('Updated coupon 1:', updated);
}

main().catch(console.error).finally(() => p.$disconnect());
