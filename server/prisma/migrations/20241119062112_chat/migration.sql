/*
  Warnings:

  - You are about to drop the column `online` on the `friend` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `friend` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastMessage` on table `friend` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "friend" DROP COLUMN "online",
ADD COLUMN     "chatId" TEXT NOT NULL,
ALTER COLUMN "lastMessage" SET NOT NULL,
ALTER COLUMN "lastMessage" SET DEFAULT '';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;
