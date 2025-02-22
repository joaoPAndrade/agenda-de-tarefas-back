/*
  Warnings:

  - You are about to drop the column `owner` on the `task` table. All the data in the column will be lost.
  - Added the required column `ownerEmail` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "owner",
ADD COLUMN     "ownerEmail" VARCHAR(100) NOT NULL;
