/*
  Warnings:

  - You are about to drop the column `city` on the `destination` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `destination` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `hotel` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activitylog` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `destination` DROP COLUMN `city`,
    DROP COLUMN `country`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `countryId` INTEGER NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `hotel` DROP COLUMN `city`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    MODIFY `address` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `packageitinerary` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `review` MODIFY `comment` TEXT NULL;

-- AlterTable
ALTER TABLE `travelpackage` MODIFY `description` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `countryId` INTEGER NOT NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    INDEX `City_countryId_idx`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Destination_cityId_idx` ON `Destination`(`cityId`);

-- CreateIndex
CREATE INDEX `Destination_countryId_idx` ON `Destination`(`countryId`);

-- CreateIndex
CREATE INDEX `Hotel_cityId_idx` ON `Hotel`(`cityId`);

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destination` ADD CONSTRAINT `Destination_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Destination` ADD CONSTRAINT `Destination_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
