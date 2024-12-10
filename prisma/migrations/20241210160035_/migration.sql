/*
  Warnings:

  - You are about to drop the column `isLinkedToCard` on the `customers` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "isLinkedToCard",
ADD COLUMN     "avatar" TEXT NOT NULL;
