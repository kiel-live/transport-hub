import { pgTable, text } from 'drizzle-orm/pg-core';
import { Model } from '~/server/importer/types';

export const gtfsAgency = pgTable('gtfs_agencies', {
  agencyId: text('agency_id').notNull().primaryKey(),
  agencyName: text('agency_name').notNull(),
  agencyUrl: text('agency_url').notNull(),
  agencyTimezone: text('agency_timezone').notNull(),
  agencyLang: text('agency_lang'),
  agencyPhone: text('agency_phone'),
  agencyFareUrl: text('agency_fare_url'),
  agencyEmail: text('agency_email'),
});

export const gtfsAgencyModel: Model<typeof gtfsAgency> = {
  name: 'agency',
  table: gtfsAgency,
  conflictTarget: gtfsAgency.agencyId,
  async convertToRow(data) {
    return {
      agencyId: data.string('agency_id').required().get(),
      agencyName: data.string('agency_name').required().get(),
      agencyUrl: data.string('agency_url').required().get(),
      agencyTimezone: data.string('agency_timezone').required().get(),
      agencyLang: data.string('agency_lang').get(),
      agencyPhone: data.string('agency_phone').get(),
      agencyFareUrl: data.string('agency_fare_url').get(),
      agencyEmail: data.string('agency_email').get(),
    };
  },
};
