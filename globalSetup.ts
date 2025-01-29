import { execSync } from "child_process";
import path from "path";

export default async function globalSetup(): Promise<void> {
  console.log("Running global setup...");
  
  // Optionally set up database schema (e.g., run migrations)
//   const prismaBinary = path.join(__dirname, "../node_modules/.bin/prisma");
//   execSync(`${prismaBinary} migrate deploy`);

  console.log("Global setup completed.");
}
