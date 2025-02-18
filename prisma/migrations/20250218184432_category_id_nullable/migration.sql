-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_categoryId_fkey";

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
