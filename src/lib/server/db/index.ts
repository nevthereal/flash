import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '$lib/server/db/schema';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle({
	connection: {
		url: DATABASE_URL
	},
	schema,
	casing: 'snake_case'
});
