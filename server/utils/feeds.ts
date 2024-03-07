import fs from 'node:fs/promises';
import path from 'node:path';
import type { FeedMeta } from '~/types/feed';

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

export async function getFeeds(): Promise<FeedMeta[]> {
  const storage = useStorage();

  if (await storage.hasItem('feeds')) {
    return (await storage.getItem('feeds')) as FeedMeta[];
  }

  const feedFiles = walk('catalogs/sources/');
  const feeds = [];

  for await (const file of feedFiles) {
    const feed = JSON.parse(await fs.readFile(file, 'utf-8'));
    feeds.push(feed);
  }

  storage.setItem('feeds', feeds);

  return feeds;
}

async function downloadGTFS(url: string, headers: Record<string, string> | undefined, dest: string) {
  const d = await fetch(url, {
    headers,
  });

  if (!d.ok) {
    throw new Error(`Failed to download GTFS: ${d.status} ${d.statusText}`);
  }

  const buffer = await d.arrayBuffer();

  await fs.writeFile(dest, new Uint8Array(buffer));
}

export async function downloadFeed(feed: FeedMeta) {
  if (feed.data_type === 'gtfs') {
    for await (const [name, url] of Object.entries(feed.urls)) {
      if (name === 'direct_download') {
        await downloadGTFS(url as string, {}, `data/feed_${feed.mdb_source_id}_${name}.zip`);
      }
    }
  }
}
