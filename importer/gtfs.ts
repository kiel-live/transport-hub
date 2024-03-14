import { parse as parseCsv } from 'csv-parse';
import stripBom from 'strip-bom-stream';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

import type { Model } from './types';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import {
  gtfsAgencyModel,
  gtfsCalendarModel,
  gtfsCalendarDateModel,
  gtfsRouteModel,
  gtfsShapeModel,
  gtfsStopModel,
  gtfsTripModel,
  gtfsStopTimeModel,
} from '~/server/database/gtfs';
import { BasicImporter } from './importer';

export class GtfsImporter extends BasicImporter {
  // models array is sorted by foreign key dependencies
  models = [
    gtfsAgencyModel,
    gtfsCalendarModel,
    gtfsCalendarDateModel,
    gtfsRouteModel,
    gtfsShapeModel,
    gtfsStopModel,
    gtfsTripModel,
    gtfsStopTimeModel,
  ];

  async importGtfsFile<T extends PgTableWithColumns<any>>(csvPath: string, model: Model<T>) {
    const parser = createReadStream(csvPath)
      .pipe(stripBom())
      .pipe(
        parseCsv({
          columns: true,
          relax_quotes: true,
          trim: true,
          skip_empty_lines: true,
        }),
      );

    await this.importModel(parser, model);
  }

  async run(feed: Feed) {
    const gtfsUrl = feed.url;
    const base = path.join(process.cwd(), 'catalogs', 'downloaded'); // TODO: extract somewhere
    const gtfsFilename = path.join(base, `${feed.name}.zip`);

    if (gtfsUrl) {
      await this.downloadFile(gtfsUrl, gtfsFilename);
    }

    await this.unzipFile(gtfsFilename);

    const gtfsFolder = path.join(path.dirname(gtfsFilename), path.basename(gtfsFilename, '.zip'));
    for await (const model of this.models) {
      const csvPath = path.join(gtfsFolder, `${model.name}.txt`);
      this.log('importing ', model.name, 'from', csvPath, '...');
      if (await fs.stat(csvPath).catch(() => null)) {
        await this.importGtfsFile(csvPath, model);
      }
    }

    this.log('Done');
  }
}
