
import prisma from "../../src/utils/db"
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { AdminStatus, CreatorType } from "@prisma/client";
import { hashPassword } from "../../src/utils/auth.utility"
export const migrateSuperAdmin = async () => {
    try {
        const role = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
        if (!role) {
            console.log("\x1b[31m--------------------- Roles are not migrated!!---------------------\x1b[0m");
            return;
        }
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
            console.log("\x1b[31m---------------------Admin email and password not found!!---------------------\x1b[0m");
            return;
        }
        const hashedPassword = await hashPassword(adminPassword); 
        const data = {
            username: "Admin123",
            email: adminEmail,
            password: hashedPassword,
            roleId: role.id,
            status: AdminStatus.ACTIVE,
            creatorType: CreatorType.SYSTEM
        }
        await prisma.appAdmin.upsert({
            where: {
                email: adminEmail
            },
            update: {},
            create: data
        })
        console.log("\x1b[32m--------------------- SuperAdmin migrated successfully !!---------------------\x1b[0m");

    } catch (error) {
        console.log("\x1b[31m--------------------- SuperAdmin migration failed !!---------------------\x1b[0m");
    }
}


