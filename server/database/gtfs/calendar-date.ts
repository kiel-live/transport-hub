import { date, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { gtfsCalendar } from './calendar';
import { Model } from '~/importer/types';

export const gtfsCalendarDate = pgTable(
  'gtfs_calendar_dates',
  {
    serviceId: text('service_id').notNull(),
    // .references(() => gtfsCalendar.serviceId), // TODO: can be reference to calendar or individual id
    date: date('date').notNull(),
    exceptionType: integer('exception_type').notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({ name: 'pk', columns: [t.serviceId, t.date] }),
    };
  },
);

export const gtfsCalendarDateModel: Model<typeof gtfsCalendarDate> = {
  name: 'calendar_dates',
  table: gtfsCalendarDate,
  conflictTarget: [gtfsCalendarDate.serviceId, gtfsCalendarDate.date],
  async convertToRow(data) {
    return {
      serviceId: data.string('service_id').required().get(),
      date: data.string('date').required().get(),
      exceptionType: data.integer('exception_type').required().get(),
    };
  },
};
