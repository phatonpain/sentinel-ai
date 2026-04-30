export const PLAN_LIMITS = {
    FREE: {
        inspectsPerMonth: 1_000,
        honeypots: 1,
        retentionDays: 7,
        dlpEnabled: false,
        graphqlArmorEnabled: false,
        complianceEnabled: false,
        redTeamEnabled: false,
    },
    PRO: {
        inspectsPerMonth: 100_000,
        honeypots: 10,
        retentionDays: 30,
        dlpEnabled: true,
        graphqlArmorEnabled: false,
        complianceEnabled: false,
        redTeamEnabled: false,
    },
    BUSINESS: {
        inspectsPerMonth: 1_000_000,
        honeypots: Infinity,
        retentionDays: 90,
        dlpEnabled: true,
        graphqlArmorEnabled: true,
        complianceEnabled: false,
        redTeamEnabled: true,
    },
    ENTERPRISE: {
        inspectsPerMonth: Infinity,
        honeypots: Infinity,
        retentionDays: 365,
        dlpEnabled: true,
        graphqlArmorEnabled: true,
        complianceEnabled: true,
        redTeamEnabled: true,
    },
};
//# sourceMappingURL=tenant.js.map