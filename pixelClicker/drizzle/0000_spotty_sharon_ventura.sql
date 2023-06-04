CREATE TABLE `drawings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`drawing_name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `pixels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drawing_id` integer,
	`pos_x` integer NOT NULL,
	`pos_y` integer NOT NULL,
	FOREIGN KEY (`drawing_id`) REFERENCES `drawings`(`id`)
);

CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userName` text NOT NULL
);
