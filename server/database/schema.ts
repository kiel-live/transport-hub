import { pgTable, text, integer, json, timestamp } from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
  id: integer('id').primaryKey(),
  importId: text('import_id').notNull().unique(),
  type: text('type', { enum: ['gtfs', 'gtfs-rt', 'gbfs'] }).notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  headers: json('headers').$type<{ [key: string]: string }>(),
  lastFetchedAt: timestamp('last_fetched_at'),
  contact: json('contact').$type<{
    name: string;
    email?: string;
    phone?: string;
  }>(),
  origin: json('origin').$type<{
    url: string;
    maintainers: string[];
  }>(),
  createdAt: timestamp('created_at').notNull(),
});

export const feedLogs = pgTable('feed_errors', {
  id: integer('id').primaryKey(),
  feedId: integer('feed_id')
    .notNull()
    .references(() => feeds.id),
  task: text('task').notNull(),
  logs: json('logs').notNull().$type<string[]>(),
  createdAt: timestamp('created_at').notNull(),
});

export * from './gtfs';
