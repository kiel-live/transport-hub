import stream from 'node:stream/promises';
import { Readable } from 'node:stream';
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import extractZip from 'extract-zip';

import { insertRows, Database } from './db';
import type { Model } from './types';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

interface AsyncIterable<T = any> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

interface AsyncIterator<T> {
  next(): Promise<IteratorResult<T>>;
}

interface IteratorResult<T> {
  value: T;
  done?: boolean;
}

export abstract class Importer {
  log = console.log;
  insertRowsLimit: number = 1_000;

  async downloadFile(url: string, filename: string, headers?: { [key: string]: string }) {
    if (await fs.stat(filename).catch(() => null)) {
      this.log(`File already downloaded to ${filename}`);
      return;
    }

    this.log(`Downloading file from ${url} to ${filename}`);
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const { body } = response;
    if (body === null) {
      throw new Error('Response body is null');
    }

    const fileStream = createWriteStream(filename);
    await stream.finished(Readable.from(body).pipe(fileStream));
    this.log(`Downloaded file to ${filename}`);
  }

  async unzipFile(filename: string) {
    const target = path.join(path.dirname(filename), path.basename(filename, '.zip'));
    this.log('Unzipping', filename, 'to', target, '...');
    await fs.mkdir(target, { recursive: true });
    await extractZip(filename, { dir: target });
    this.log('Unzipped', filename);
  }

  async importModel<
    T extends PgTableWithColumns<any>,
    U extends AsyncIterable<Record<string, string | null | undefined>>,
  >(stream: U, model: Model<T>, db: Database) {
    this.log('Importing', model.name, '...');
    console.time(`import ${model.name}`);

    let rows = [];
    let importedRows = 0;
    for await (const row of stream) {
      rows.push(row);
      if (rows.length >= this.insertRowsLimit) {
        await insertRows(db, rows, model);
        importedRows += rows.length;
        rows = [];
      }
      if ((importedRows + rows.length) % 50_000 === 0) {
        this.log('Imported', importedRows + rows.length, 'rows');
      }
    }

    // insert remaining rows
    await insertRows(db, rows, model);
    importedRows += rows.length;
    this.log('Imported', importedRows, 'rows');

    console.timeEnd(`import ${model.name}`);
    this.log('Imported', model.name);
  }
}
