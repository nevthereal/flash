import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Folder Table (for organizing flashcard sets)
export const folders = sqliteTable('folders', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Flashcard Set Table
export const flashcardSets = sqliteTable('flashcard_sets', {
	id: text('id').primaryKey(),
	folderId: text('folder_id').references(() => folders.id),
	title: text('title').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Flashcard Table
export const flashcards = sqliteTable('flashcards', {
	id: text('id').primaryKey(),
	setId: text('set_id').references(() => flashcardSets.id),
	front: text('front').notNull(),
	back: text('back').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Study Session Table
export const studySessions = sqliteTable('study_sessions', {
	id: text('id').primaryKey(),
	setId: text('set_id').references(() => flashcardSets.id),
	startTime: integer('start_time', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	endTime: integer('end_time', { mode: 'timestamp' }),
	progress: text('progress', { mode: 'json' }).$type<{
		currentCardIndex: number;
		cardsStudied: number;
		correctAnswers: number;
		incorrectAnswers: number;
		studiedCardIds: string[];
	}>(),
	status: text('status', {
		enum: ['in_progress', 'completed', 'abandoned']
	}).default('in_progress')
});

// Relationship Definitions
export const foldersRelations = relations(folders, ({ many }) => ({
	flashcardSets: many(flashcardSets)
}));

export const flashcardSetsRelations = relations(flashcardSets, ({ one, many }) => ({
	folder: one(folders, {
		fields: [flashcardSets.folderId],
		references: [folders.id]
	}),
	flashcards: many(flashcards),
	studySessions: many(studySessions)
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
	set: one(flashcardSets, {
		fields: [flashcards.setId],
		references: [flashcardSets.id]
	})
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
	set: one(flashcardSets, {
		fields: [studySessions.setId],
		references: [flashcardSets.id]
	})
}));

// Utility function for generating UUID
export function generateId(): string {
	return crypto.randomUUID();
}
