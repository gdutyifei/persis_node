USE persis;
CREATE TABLE `User` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`created_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`created_date` DATETIME NULL DEFAULT NULL,
	`updated_by` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updated_date` DATETIME NULL DEFAULT NULL,
	`openid` VARCHAR(50) NULL DEFAULT NULL COMMENT '微信openid' COLLATE 'utf8mb4_unicode_ci',
	`union_id` VARCHAR(50) NULL DEFAULT NULL COMMENT '微信unionId' COLLATE 'utf8mb4_unicode_ci',
	`avatar_url` VARCHAR(80) NULL DEFAULT NULL COMMENT '头像url' COLLATE 'utf8mb4_unicode_ci',
	`nick_name` VARCHAR(20) NULL DEFAULT NULL COMMENT '微信昵称' COLLATE 'utf8mb4_unicode_ci',
	`sex` VARCHAR(10) NULL DEFAULT NULL COMMENT '微信性别' COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
