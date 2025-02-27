import { CreatorType } from "@prisma/client";
import prisma from "../../src/utils/db"
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const { appAdmin: AppAdmin, role: Role, permissionSets: PermissionSets, permissionsForPermissionSet: PermissionsForPermissionSet } = prisma;


const CSR_ROLE_PERMISSION_SET = {
    name: "Default CSR Permissions",
    isDefault: true,
    rules: [
        {
            action: "create",
            subject: "SupportTickets",
            fields: ["*"]
        },
        {
            action: "read",
            subject: "SupportTickets",
            fields: ["id", "ticket_id", "title", "description", "is_new", "files", "is_deleted", "store_disable", "createdAt", "updatedAt", "status_id", "priority_id", "category", "support_user_id", "assigned_id"]
        },
        {
            action: "update",
            subject: "SupportTickets",
            fields: ["id", "ticket_id", "title", "description", "is_new", "files", "store_disable", "status_id", "priority_id", "category", "support_user_id", "assigned_id"]
        },
        {
            action: "delete",
            subject: "SupportTickets",
            fields: ["*"]
        },

    ]
};

export const DefaultPermissionSetForCSR = async () => {
    const role = await Role.findUnique({ where: { name: "CSR" } })
    if (!role) {
        console.log("\x1b[31m--------------------- Roles are not migrated!!---------------------\x1b[0m");
        return;
    }
    const permissionSet = await PermissionSets.upsert({
        where: {
            roleId_isDefault: {
                roleId: role.id,
                isDefault: true,
            },
        },
        create: {
            roleId: role.id,
            isDefault: true,
            createdBy: CreatorType.SYSTEM,
            PermissionForPermissionSets: {
                createMany: {
                    data: CSR_ROLE_PERMISSION_SET.rules
                }
            }
        },
        update: {
            isDefault: true,
            createdBy: CreatorType.SYSTEM,
        },
    })

    if (!permissionSet) {
        console.log("\x1b[31m--------------------- PermissionSet for CSR not created!!---------------------\x1b[0m");
        return;
    }

    await prisma.permissionsForPermissionSet.deleteMany({
        where: {
            permission_sets_id: permissionSet.id
        }
    });

    await prisma.permissionsForPermissionSet.createMany({
        data: CSR_ROLE_PERMISSION_SET.rules.map(rule => ({
            permission_sets_id: permissionSet.id,
            action: rule.action,
            subject: rule.subject,
            fields: rule.fields
        }))
    });
    console.log("\x1b[32m--------------------- PermissionSet for CSR migrated successfully !!---------------------\x1b[0m");

}