-- DropForeignKey
ALTER TABLE `support_relationships` DROP FOREIGN KEY `support_relationships_requesterId_fkey`;

-- DropForeignKey
ALTER TABLE `support_relationships` DROP FOREIGN KEY `support_relationships_supporterId_fkey`;

-- DropIndex
DROP INDEX `support_relationships_requesterId_supporterId_key` ON `support_relationships`;

-- AddForeignKey
ALTER TABLE `support_relationships` ADD CONSTRAINT `support_relationships_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_relationships` ADD CONSTRAINT `support_relationships_supporterId_fkey` FOREIGN KEY (`supporterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;