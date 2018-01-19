USE persis;
CREATE TABLE `Books` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`created_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`created_date` DATETIME NULL DEFAULT NULL,
	`updated_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updated_date` DATETIME NULL DEFAULT NULL,
	`book_name` VARCHAR(50) NULL DEFAULT NULL COMMENT '图书名称' COLLATE 'utf8mb4_unicode_ci',
	`cover_url` VARCHAR(80) NULL DEFAULT NULL COMMENT '图书封面url' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
