/*
  Warnings:

  - Added the required column `speciality` to the `profesores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profesores` ADD COLUMN `speciality` VARCHAR(100) NOT NULL;
