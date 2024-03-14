import type { Feed } from '~/server/utils/db';
import { type Database } from './db';
import { GtfsImporter } from './gtfs';
import { GbfsImporter } from './gbfs';
import { GtfsRTImporter } from './gtfs-rt';
import type { Log } from './types';

export async function importFeed(feed: Feed, db: Database, log: Log) {
  switch (feed.type) {
    case 'gtfs':
      await new GtfsImporter({ db, log }).run(feed);
      return;
    case 'gtfs-rt':
      await new GtfsRTImporter({ db, log }).run(feed);
      return;
    case 'gbfs':
      await new GbfsImporter({ db, log }).run(feed);
      return;
    default:
      throw new Error(`Unknown feed type: ${feed.type}`);
  }
}
