CREATE DATABASE `my_schema`;
--> statement-breakpoint
CREATE TABLE `my_schema`.`tasks` (
	`task_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`taskname` varchar(256) NOT NULL,
	`category` varchar(256) NOT NULL,
	`due_date` date,
	`description` varchar(256) DEFAULT '',
	`importance` int DEFAULT 3,
	`urgency` int DEFAULT 3,
	CONSTRAINT `tasks_task_id` PRIMARY KEY(`task_id`)
);
--> statement-breakpoint
CREATE TABLE `my_schema`.`users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`session` varchar(256),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_session_unique` UNIQUE(`session`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;