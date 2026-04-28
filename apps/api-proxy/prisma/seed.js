"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tenant = await prisma.tenant.create({
        data: {
            name: 'Sentinel Demo Tenant',
            plan: client_1.PlanType.BUSINESS,
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
//# sourceMappingURL=seed.js.map