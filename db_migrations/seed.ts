import { migrateSuperAdmin } from "./Admin";
import { migrateDefaultRoles } from "./Role";
import { migrateRolesPermission } from "./RolePermission";

(async () => {
    try {
        await migrateDefaultRoles();
        await migrateSuperAdmin()
        await migrateRolesPermission();
    } catch (error) {
        console.error("An error occurred during the seeding process:", error);
    } finally {
        console.log("Seeding process completed.");
        process.exit(0);
    }
})();