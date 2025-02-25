import { migrateSuperAdmin } from "./Admin";
import { migrateDefaultRoles } from "./Role";

(async () => {
    try {
        await migrateDefaultRoles();
        await migrateSuperAdmin()
    } catch (error) {
        console.error("An error occurred during the seeding process:", error);
    } finally {
        console.log("Seeding process completed.");
        process.exit(0);
    }
})();