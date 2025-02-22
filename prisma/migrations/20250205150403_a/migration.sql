/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `task_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `taskId` on the `task_category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `task_category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "task_category" DROP CONSTRAINT "task_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "task_category" DROP CONSTRAINT "task_category_taskId_fkey";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task" DROP CONSTRAINT "task_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task_category" DROP CONSTRAINT "task_category_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" INTEGER NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "task_category_pkey" PRIMARY KEY ("taskId", "categoryId");

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "task_category_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "task_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
