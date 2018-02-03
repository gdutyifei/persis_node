USE persis;
CREATE TABLE `Config` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`created_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`created_date` DATETIME NULL DEFAULT NULL,
	`updated_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updated_date` DATETIME NULL DEFAULT NULL,
	`appid` VARCHAR(200) NULL DEFAULT NULL COMMENT 'appid' COLLATE 'utf8mb4_unicode_ci',
	`appsecret` VARCHAR(80) NULL DEFAULT NULL COMMENT 'appsecret' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
