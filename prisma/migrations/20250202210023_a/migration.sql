-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'ONGOING', 'COMPLETED');

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "comments" TEXT,
    "description" TEXT,
    "owner" VARCHAR(100) NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateTask" TIMESTAMP(3) NOT NULL,
    "dateConclusion" TIMESTAMP(3),
    "isRecurrent" BOOLEAN NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_category" (
    "taskId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "task_category_pkey" PRIMARY KEY ("taskId","categoryId")
);

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "task_category_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "task_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
