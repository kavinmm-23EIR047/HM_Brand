const { Client } = require('pg');

async function test(name, connectionString) {
  console.log(`\nTesting connection [${name}]:`);
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`✅ Success for [${name}]!`);
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ Failed for [${name}]:`, err.message);
    try { await client.end(); } catch {}
    return false;
  }
}

async function run() {
  const project = 'tedtqdwlmuzdgbngboas';
  const pass = 'Sarva1234C%40%40';

  // Option 1: Pooler port 6543 with pgbouncer
  await test('Pooler 6543', `postgresql://postgres.${project}:${pass}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`);

  // Option 2: Pooler port 5432 with sslmode
  await test('Pooler 5432', `postgresql://postgres.${project}:${pass}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require`);

  // Option 3: Direct DB port 5432
  await test('Direct DB 5432', `postgresql://postgres:${pass}@db.${project}.supabase.co:5432/postgres?sslmode=require`);
}

run();
