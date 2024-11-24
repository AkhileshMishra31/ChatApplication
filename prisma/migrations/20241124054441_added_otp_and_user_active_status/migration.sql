-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('SIGNUP', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "OTPStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateTable
CREATE TABLE "OTPRequest" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "type" "OTPType" NOT NULL,
    "status" "OTPStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "OTPRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityStatus" (
    "id" TEXT NOT NULL,
    "is_signup_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ONLINE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivityStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserActivityStatus_userId_key" ON "UserActivityStatus"("userId");

-- AddForeignKey
ALTER TABLE "OTPRequest" ADD CONSTRAINT "OTPRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityStatus" ADD CONSTRAINT "UserActivityStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
