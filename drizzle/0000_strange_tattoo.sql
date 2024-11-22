CREATE TABLE `flashcard_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text,
	`title` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `flashcards` (
	`id` text PRIMARY KEY NOT NULL,
	`set_id` text,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`set_id`) REFERENCES `flashcard_sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`set_id` text,
	`start_time` integer,
	`end_time` integer,
	`progress` text,
	`status` text DEFAULT 'in_progress',
	FOREIGN KEY (`set_id`) REFERENCES `flashcard_sets`(`id`) ON UPDATE no action ON DELETE no action
);
