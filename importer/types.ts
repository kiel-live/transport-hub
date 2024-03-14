import type { IndexColumn, PgInsertValue, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { DataProvider } from './data-provider';
import { Readable } from 'node:stream';

export type Model<T extends PgTableWithColumns<any>> = {
  name: string; // filename without extension
  table: T;
  conflictTarget: IndexColumn | IndexColumn[];
  extractRows?: (data: any) => PromiseLike<Readable>;
  convertToRow: (
    dataProvider: DataProvider<{ [key: string]: string | null | undefined }>,
  ) => PromiseLike<PgInsertValue<T>>;
};

export type Log = (...args: unknown[]) => void;
