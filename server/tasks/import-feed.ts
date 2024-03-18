import { asc, eq } from 'drizzle-orm';
import { importFeed } from '~/importer';

export default defineBatchTask(async ({ log }) => {
  const db = useDB();
  const feeds = await db
    .select()
    .from(tables.feeds)
    .where(eq(tables.feeds.disabled, false))
    .orderBy(asc(tables.feeds.lastUpdated))
    .limit(1);

  if (feeds.length === 0) {
    log('No feeds to update');
    return;
  }

  const feed = feeds[0];

  log(`Updating feed ${feed.importId} from ${feed.url}`);

  const logs: string[] = [];
  try {
    await importFeed(feed, db, (...args: unknown[]) => {
      log(...args);
      logs.push(args.join(' ').trim());
    });
    await db.update(tables.feeds).set({ lastUpdated: new Date() }).where(eq(tables.feeds.id, feed.id));
  } catch (error) {
    log(`Error updating feed ${feed.importId}: ${(error as Error).message}`);
    logs.push((error as Error).message);
  }

  log(`Finished updating feed ${feed.importId}`);

  await db.insert(tables.feedLogs).values({
    feedId: feed.id,
    task: 'importFeed',
    logs: [],
    createdAt: new Date(),
  });
});
