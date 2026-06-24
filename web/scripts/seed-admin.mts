import { getPayload } from 'payload';
import config from '../payload.config.js';

async function seedAdmin() {
  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@danangtour.local' } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log('Admin user already exists: admin@danangtour.local');
    process.exit(0);
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@danangtour.local',
      password: 'Admin@123456',
      name: 'Administrator',
      role: 'admin',
    },
  });

  console.log('Admin created:');
  console.log('  Email: admin@danangtour.local');
  console.log('  Password: Admin@123456');
  console.log('  Login: http://localhost:3000/admin');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
