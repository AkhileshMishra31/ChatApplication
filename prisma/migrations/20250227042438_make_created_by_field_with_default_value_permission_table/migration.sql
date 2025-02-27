/*
  Warnings:

  - The `createdBy` column on the `PermissionSets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PermissionSets" DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" "CreatorType" NOT NULL DEFAULT 'SYSTEM';
