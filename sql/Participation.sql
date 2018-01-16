USE persis;
CREATE TABLE `Participation` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`created_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`created_date` DATETIME NULL DEFAULT NULL,
	`updated_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updated_date` DATETIME NULL DEFAULT NULL,
	`user_id` BIGINT(20) NULL DEFAULT NULL COMMENT '用户id' COLLATE 'utf8mb4_unicode_ci',
	`book_id` BIGINT(20) NULL DEFAULT NULL COMMENT '书籍id' COLLATE 'utf8mb4_unicode_ci',
	`period` VARCHAR(10) NULL DEFAULT NULL COMMENT '活动期数' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
