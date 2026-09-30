-- AlterTable
ALTER TABLE "friend" ALTER COLUMN "lastMessage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastOnline" TIMESTAMP(3),
ALTER COLUMN "image" SET DEFAULT 'null';
