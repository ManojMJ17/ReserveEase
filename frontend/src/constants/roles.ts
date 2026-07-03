export const Role = {
    ADMIN: "admin",
    CUSTOMER: "customer"
} as const;

export type RoleType = typeof Role[keyof typeof Role];
