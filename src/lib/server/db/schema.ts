import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Folder Table (for organizing flashcard sets)
export const folders = sqliteTable('folders', {
	id: text().primaryKey(),
	name: text().notNull(),
	description: text(),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Flashcard Set Table
export const flashcardSets = sqliteTable('flashcard_sets', {
	id: text().primaryKey(),
	folderId: text().references(() => folders.id),
	title: text().notNull(),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Flashcard Table
export const flashcards = sqliteTable('flashcards', {
	id: text().primaryKey(),
	setId: text().references(() => flashcardSets.id),
	front: text().notNull(),
	back: text().notNull(),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Study Session Table
export const studySessions = sqliteTable('study_sessions', {
	id: text().primaryKey(),
	setId: text().references(() => flashcardSets.id),
	startTime: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
	endTime: integer({ mode: 'timestamp' }),
	progress: text({ mode: 'json' }).$type<{
		currentCardIndex: number;
		cardsStudied: number;
		correctAnswers: number;
		incorrectAnswers: number;
		studiedCardIds: string[];
	}>(),
	status: text({
		enum: ['in_progress', 'completed']
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
