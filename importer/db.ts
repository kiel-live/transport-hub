import * as schema from '../server/database/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type PgInsertValue, PgTable, type PgTableWithColumns, type PgUpdateSetSource } from 'drizzle-orm/pg-core';
import type { Model } from './types';
import { Column, sql } from 'drizzle-orm';
import { DataProvider } from './data-provider';

export type Database = PostgresJsDatabase<typeof schema>;

export async function insertRows<T extends PgTableWithColumns<any>>(
  db: Database,
  lines: Record<string, string | null | undefined>[],
  model: Model<T>,
  options: { ignoreDuplicates: boolean; linesOffset: number } = {
    ignoreDuplicates: false,
    linesOffset: 0,
  },
) {
  const rows: PgInsertValue<T>[] = [];
  for (const [i, rowStr] of lines.entries()) {
    try {
      rows.push(await model.convertToRow(DataProvider.create(rowStr)));
    } catch (err) {
      throw new Error(`Error while converting line ${i + options.linesOffset}`, { cause: err });
    }
  }

  try {
    await db
      .insert(model.table)
      .values(rows)
      .onConflictDoUpdate({
        target: model.conflictTarget,
        set: conflictUpdateSet(model.table, Object.keys(rows[0])),
      })
      .execute();
  } catch (err) {
    throw new Error(
      `Error while inserting rows (${options.linesOffset} - ${options.linesOffset + lines.length}) into ${model.name}`,
      { cause: err },
    );
  }
}

function conflictUpdateSet<TTable extends PgTable>(
  table: TTable,
  columns: (keyof TTable['_']['columns'] & keyof TTable)[],
): PgUpdateSetSource<TTable> {
  return Object.assign(
    {},
    ...columns.map((k) => ({ [k]: sql.raw(`excluded.${(table[k] as Column).name}`) })),
  ) as PgUpdateSetSource<TTable>;
}
