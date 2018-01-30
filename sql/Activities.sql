USE persis;
DROP TABLE IF EXISTS `Activities`;
CREATE TABLE `Activities` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`created_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`created_date` DATETIME NULL DEFAULT NULL,
	`updated_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updated_date` DATETIME NULL DEFAULT NULL,
	`activity_date` VARCHAR(10) NULL DEFAULT NULL COMMENT '活动时间' COLLATE 'utf8mb4_unicode_ci',
	`period` VARCHAR(10) NULL DEFAULT NULL COMMENT '活动期数' COLLATE 'utf8mb4_unicode_ci',
	`book_ids` mediumtext COLLATE utf8mb4_unicode_ci COMMENT '书籍ids',
	`book_infos` mediumtext COLLATE utf8mb4_unicode_ci COMMENT '书籍信息',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
