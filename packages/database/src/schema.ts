import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const createdAt = integer('created_at', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`);
const updatedAt = integer('updated_at', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`)
  .$onUpdateFn(() => new Date());

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  updatedAt,
  createdAt,
});

export const clipboards = sqliteTable('clipboards', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id),
  content: text('content').notNull(),
  updatedAt,
  createdAt,
});
