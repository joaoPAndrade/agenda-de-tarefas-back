/*
  Warnings:

  - Made the column `dateConclusion` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "task" ALTER COLUMN "dateConclusion" SET NOT NULL;
