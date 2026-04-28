import { PrismaClient, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Sentinel Demo Tenant',
      plan: PlanType.BUSINESS,
      apiKeys: {
        create: [
          {
            keyHash: '$2b$10$demo_hash_placeholder', // bcrypt of 'sentinel-local-dev-key'
            scopes: ['read:threats', 'write:rules', 'admin'],
          },
        ],
      },
      billing: {
        create: {
          usageInspects: 0,
          usageHoneypots: 0,
        },
      },
    },
  });

  console.log(`Seeded tenant: ${tenant.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
