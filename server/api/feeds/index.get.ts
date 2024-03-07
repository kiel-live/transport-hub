export default defineEventHandler(async (event) => {
  const feeds = await getFeeds();

  return feeds.map((feed) => ({
    ...feed,
    last_fetched: new Date(), // TODO: actually fetch the feed
    errors: [], // TODO: actually fetch the feed
  }));
});
