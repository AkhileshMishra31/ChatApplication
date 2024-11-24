-- DropForeignKey
ALTER TABLE "OTPRequest" DROP CONSTRAINT "OTPRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivityStatus" DROP CONSTRAINT "UserActivityStatus_userId_fkey";

-- AddForeignKey
ALTER TABLE "OTPRequest" ADD CONSTRAINT "OTPRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityStatus" ADD CONSTRAINT "UserActivityStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
