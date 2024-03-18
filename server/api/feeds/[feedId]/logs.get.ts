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
  const logs = await db
    .select()
    .from(tables.feedLogs)
    .where(eq(tables.feedLogs.feedId, parseInt(feedId, 10)));

  return logs;
});
