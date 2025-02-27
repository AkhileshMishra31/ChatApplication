/*
  Warnings:

  - A unique constraint covering the columns `[roleId,isDefault]` on the table `PermissionSets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PermissionSets_roleId_isDefault_key" ON "PermissionSets"("roleId", "isDefault");
