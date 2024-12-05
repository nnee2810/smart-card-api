/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deletedAt";
