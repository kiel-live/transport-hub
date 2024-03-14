import { pgTable, text, integer, json, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
  id: serial('id').primaryKey(),
  importId: text('import_id').notNull().unique(),
  type: text('type', { enum: ['gtfs', 'gtfs-rt', 'gbfs'] }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  headers: json('headers').$type<{ [key: string]: string }>(),
  lastUpdated: timestamp('last_updated'),
  contact: json('contact').$type<{
    name: string;
    email?: string;
    phone?: string;
  }>(),
  origin: json('origin').$type<{
    url: string;
    maintainers: string[];
  }>(),
  disabled: boolean('disabled').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
});

export const feedLogs = pgTable('feed_errors', {
  id: serial('id').primaryKey(),
  feedId: integer('feed_id')
    .notNull()
    .references(() => feeds.id),
  task: text('task').notNull(),
  logs: json('logs').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').notNull(),
});

export * from './gtfs';
export * from './gbfs';
// export * from './gtfs-rt';
