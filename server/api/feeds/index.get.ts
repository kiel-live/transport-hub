export default defineEventHandler(async (event) => {
  const db = useDB();
  const feeds = await db.select().from(tables.feeds).limit(10);

  return feeds;
});
