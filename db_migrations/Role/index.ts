import prisma from "../../src/utils/db"
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const roles = [
    { name: "SUPER_ADMIN", description: "Has full access to all system features" },
    { name: "POLICY_MANAGER", description: "Manages policies and compliance" },
    { name: "CSR", description: "Handles customer support" }
];

export const migrateDefaultRoles = async () => {
    try {
        await Promise.all(
            roles.map(({ name, description }) =>
                prisma.role.upsert({
                    where: { name },
                    update: {},
                    create: { name, description },
                })
            )
        );
        console.log("\x1b[32m--------------------- Default Roles migrated successfully !!---------------------\x1b[0m");
    } catch (error) {
        console.log("\x1b[31m--------------------- Default  Roles migration failed !!---------------------\x1b[0m");
    }
};
