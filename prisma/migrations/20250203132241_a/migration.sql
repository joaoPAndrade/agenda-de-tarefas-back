/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_category" DROP CONSTRAINT "task_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "task_category" DROP CONSTRAINT "task_category_taskId_fkey";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "task";

-- DropTable
DROP TABLE "task_category";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "Status";
