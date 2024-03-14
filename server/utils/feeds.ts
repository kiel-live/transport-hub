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
  const feedFiles = walk('catalogs/sources/');
  const feeds = [];

  for await (const file of feedFiles) {
    const feed = JSON.parse(await fs.readFile(file, 'utf-8'));
    feeds.push({ ...feed, file_name: file });
  }

  return feeds;
}
