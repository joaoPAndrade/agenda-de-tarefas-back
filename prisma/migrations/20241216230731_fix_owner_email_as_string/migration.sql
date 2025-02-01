-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_ownerEmail_fkey";

-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_userEmail_fkey";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "ownerEmail" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Participants" ALTER COLUMN "userEmail" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
