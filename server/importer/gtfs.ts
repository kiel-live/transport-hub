import { parse as parseCsv } from 'csv-parse';
import stripBom from 'strip-bom-stream';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

import { openDatabase, Database, closeDatabase } from './db';
import type { Model } from './types';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import {
  gtfsAgencyModel,
  gtfsCalendarModel,
  gtfsCalendarDateModel,
  gtfsRouteModel,
  gtfsShapeModel,
  gtfsStopModel,
  gtfsTripModel,
  gtfsStopTimeModel,
} from '../database/gtfs';
import { Importer } from './importer';

class GtfsImporter extends Importer {
  // models array is sorted by foreign key dependencies
  models = [
    gtfsAgencyModel,
    gtfsCalendarModel,
    gtfsCalendarDateModel,
    // gtfsRouteModel,
    gtfsShapeModel,
    // gtfsStopModel,
    // gtfsTripModel,
    // gtfsStopTimeModel,
  ];

  async importGtfsFile<T extends PgTableWithColumns<any>>(csvPath: string, model: Model<T>, db: Database) {
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

    await this.importModel(parser, model, db);
  }

  async run({ gtfsFilename, gtfsUrl, db }: { gtfsUrl?: string; gtfsFilename: string; db: Database }) {
    if (gtfsUrl) {
      await this.downloadFile(gtfsUrl, gtfsFilename);
    }

    // await this.unzipFile(gtfsFilename);

    const gtfsFolder = path.join(path.dirname(gtfsFilename), path.basename(gtfsFilename, '.zip'));
    for await (const model of this.models) {
      const csvPath = path.join(gtfsFolder, `${model.name}.txt`);
      this.log('importing ', model.name, 'from', csvPath, '...');
      if (await fs.stat(csvPath).catch(() => null)) {
        await this.importGtfsFile(csvPath, model, db);
      }
    }

    this.log('Done');
  }
}

async function main() {
  const base = path.join(process.cwd(), 'catalogs', 'downloaded');

  const db = await openDatabase();

  const importer = new GtfsImporter();
  await importer.run({
    gtfsUrl: 'https://download.gtfs.de/germany/nv_free/latest.zip',
    gtfsFilename: path.join(base, 'gtfs-de.zip'),
    db,
  });

  await closeDatabase();
}

main();
