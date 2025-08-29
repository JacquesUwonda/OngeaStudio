import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/admin-auth'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Check if admin user already exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ongea.com'
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping creation.');
  } else {
    const adminPassword = process.env.ADMIN_PASSWORD || 'password'
    const hashedPassword = await hashPassword(adminPassword)
    
    await prisma.admin.create({
      data: {
        email: adminEmail,
        name: 'Default Admin',
        password: hashedPassword,
      },
    })
    console.log(`✅ Default admin created.`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
