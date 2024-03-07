export default defineEventHandler(async (event) => {
  const feeds = await getFeeds();

  const feedID = getRouterParam(event, 'feedId');
  if (!feedID) {
    throw createError({
      status: 400,
      message: 'Missing feed ID',
    });
  }

  return feeds.find((feed) => feed.mdb_source_id.toString() === feedID);
});
