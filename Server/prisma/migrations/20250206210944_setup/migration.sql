/*
  Warnings:

  - You are about to drop the `_UserChannels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserChannels` DROP FOREIGN KEY `_UserChannels_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserChannels` DROP FOREIGN KEY `_UserChannels_B_fkey`;

-- DropTable
DROP TABLE `_UserChannels`;

-- CreateTable
CREATE TABLE `UserChannel` (
    `userId` INTEGER NOT NULL,
    `channelId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserChannel` ADD CONSTRAINT `UserChannel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChannel` ADD CONSTRAINT `UserChannel_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
