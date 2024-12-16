/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Participants` table. All the data in the column will be lost.
  - Added the required column `ownerEmail` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_userId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "ownerId",
ADD COLUMN     "ownerEmail" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Participants" DROP COLUMN "userId",
ADD COLUMN     "userEmail" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
