-- the_wall Database
CREATE SCHEMA `the_wall`;

-- Users Table
CREATE TABLE `the_wall`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(225) NULL,
  `last_name` VARCHAR(225) NULL,
  `email_address` VARCHAR(225) NULL,
  `password` VARCHAR(225) NOT NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`));


-- Messages Table
CREATE TABLE `the_wall`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `content` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));


-- Comments Table
CREATE TABLE `the_wall`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `message_id` INT NOT NULL,
  `content` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));


-- Messages table Foreign Key
ALTER TABLE `the_wall`.`messages` 
ADD INDEX `fk_messages_user_id_idx` (`user_id` ASC) VISIBLE;
;
ALTER TABLE `the_wall`.`messages` 
ADD CONSTRAINT `fk_messages_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `the_wall`.`users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



-- Comments table Foreign Key
ALTER TABLE `the_wall`.`comments` 
ADD INDEX `fk_comments_user_id_idx` (`user_id` ASC) VISIBLE,
ADD INDEX `fk_messages_message_id_idx` (`message_id` ASC) VISIBLE;
;
ALTER TABLE `the_wall`.`comments` 
ADD CONSTRAINT `fk_comments_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `the_wall`.`users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_messages_message_id`
  FOREIGN KEY (`message_id`)
  REFERENCES `the_wall`.`messages` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
