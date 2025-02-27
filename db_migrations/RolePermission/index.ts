import prisma from "../../src/utils/db"
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
import { } from "@prisma/client";
import { DefaultPermissionSetForCSR } from "./default_permission_set_csr";
const { } = prisma
export const migrateRolesPermission = async () => {
    try {
       await DefaultPermissionSetForCSR();

    } catch {
        console.log("\x1b[31m--------------------- Default Roles Permission migration failed !!---------------------\x1b[0m");
    }
}
