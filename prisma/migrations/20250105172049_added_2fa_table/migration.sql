-- CreateTable
CREATE TABLE "TwoFaAuth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "TwoFaAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwoFaAuth_userId_key" ON "TwoFaAuth"("userId");

-- AddForeignKey
ALTER TABLE "TwoFaAuth" ADD CONSTRAINT "TwoFaAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
