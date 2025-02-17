/*
  Warnings:

  - Made the column `categoryId` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "task" ALTER COLUMN "categoryId" SET NOT NULL;
