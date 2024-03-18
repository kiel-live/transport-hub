export default defineBatchTask(async ({ log }) => {
  const fileFeeds = await getFeeds();
  for await (const feed of fileFeeds) {
    const importId = `mdb-${feed.mdb_source_id}`;
    const name = feed.name ? `${feed.provider} (${feed.name})` : feed.provider;

    if (!feed.urls['direct_download']) {
      log('No direct download URL for feed', name, feed.mdb_source_id);
      continue;
    }

    log(`File feed: ${name}`);
    await useDB()
      .insert(tables.feeds)
      .values({
        importId,
        type: feed.data_type as string,
        name,
        url: feed.urls['direct_download'],
        headers: {},
        origin: {
          filename: 'catalogs/sources/' + feed.file_name,
          repo: 'https://github.com/MobilityData/mobility-database-catalogs',
        },
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [tables.feeds.importId],
        set: {
          type: feed.data_type,
          name,
          url: feed.urls['direct_download'],
          headers: {},
        },
      });
  }
});
