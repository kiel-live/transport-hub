import { IndexColumn, PgInsertValue, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { DataProvider } from './data-provider';

export type Model<T extends PgTableWithColumns<any>> = {
  name: string; // filename without extension
  table: T;
  conflictTarget: IndexColumn | IndexColumn[];
  convertToRow: (
    dataProvider: DataProvider<{ [key: string]: string | null | undefined }>,
  ) => PromiseLike<PgInsertValue<T>>;
};
