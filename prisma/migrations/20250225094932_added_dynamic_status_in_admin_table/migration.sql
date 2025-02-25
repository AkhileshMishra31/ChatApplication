/*
  Warnings:

  - The `status` column on the `AppAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AppAdmin" DROP COLUMN "status",
ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE';
