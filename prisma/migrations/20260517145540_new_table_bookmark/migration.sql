/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user-id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `user-id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "user-id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user-id");

-- CreateTable
CREATE TABLE "BookMark" (
    "id" TEXT NOT NULL,
    "user-id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createAt" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "BookMark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookMark_id_key" ON "BookMark"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user-id_key" ON "User"("user-id");

-- AddForeignKey
ALTER TABLE "BookMark" ADD CONSTRAINT "BookMark_user-id_fkey" FOREIGN KEY ("user-id") REFERENCES "User"("user-id") ON DELETE RESTRICT ON UPDATE CASCADE;
