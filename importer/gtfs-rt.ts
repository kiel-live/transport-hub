import type { Feed } from '~/server/utils/db';
import { BasicImporter } from './importer';

export class GtfsRTImporter extends BasicImporter {
  // models array is sorted by foreign key dependencies
  models = [];

  async run(feed: Feed) {
    throw new Error('GTFS-RT importer is not implemented');
    // TODO: download GTFS-RT data and import it
  }
}
