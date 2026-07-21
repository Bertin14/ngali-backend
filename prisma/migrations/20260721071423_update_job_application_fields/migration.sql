/*
  Warnings:

  - You are about to drop the column `name` on the `JobApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "name",
ADD COLUMN     "certificatesUrl" TEXT,
ADD COLUMN     "citizenship" TEXT,
ADD COLUMN     "coverLetterUrl" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "degreeUrl" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phone" TEXT;
