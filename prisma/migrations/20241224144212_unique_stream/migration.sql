/*
  Warnings:

  - A unique constraint covering the columns `[streamId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Upvote_streamId_key" ON "Upvote"("streamId");
