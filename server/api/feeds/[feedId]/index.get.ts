import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const feedId = getRouterParam(event, 'feedId');
  if (!feedId) {
    throw createError({
      status: 400,
      message: 'Missing feed ID',
    });
  }

  const db = useDB();
  const feed = (
    await db
      .select()
      .from(tables.feeds)
      .where(eq(tables.feeds.id, parseInt(feedId, 10)))
      .limit(1)
  ).at(0);
  if (!feed) {
    throw createError({
      status: 404,
      message: 'Feed not found',
    });
  }

  return feed;
});
