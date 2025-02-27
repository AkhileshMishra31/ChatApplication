-- CreateTable
CREATE TABLE "PermissionSets" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PermissionSets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionsForPermissionSet" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "fields" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "permission_sets_id" TEXT NOT NULL,

    CONSTRAINT "PermissionsForPermissionSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermissionSets_id_key" ON "PermissionSets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionsForPermissionSet_id_key" ON "PermissionsForPermissionSet"("id");

-- AddForeignKey
ALTER TABLE "PermissionSets" ADD CONSTRAINT "PermissionSets_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionsForPermissionSet" ADD CONSTRAINT "PermissionsForPermissionSet_permission_sets_id_fkey" FOREIGN KEY ("permission_sets_id") REFERENCES "PermissionSets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
