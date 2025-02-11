/*
  Warnings:

  - A unique constraint covering the columns `[timestamp,senderId,recipientId,content]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Message_timestamp_senderId_recipientId_content_key` ON `Message`(`timestamp`, `senderId`, `recipientId`, `content`);
