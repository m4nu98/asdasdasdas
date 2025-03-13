/*
  Warnings:

  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - Added the required column `apellido` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaDeNacimiento` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "fechaDeNacimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL;
