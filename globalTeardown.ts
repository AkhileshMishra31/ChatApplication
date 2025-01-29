import prisma from "./src/utils/db";

export default async function globalTeardown(): Promise<void> {
  console.log("Running global teardown...");
  
  await prisma.$disconnect();

  console.log("Global teardown completed.");
}
