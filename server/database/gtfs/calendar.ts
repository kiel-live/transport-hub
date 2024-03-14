import { date, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { Model } from '~/importer/types';

export const gtfsCalendar = pgTable('gtfs_calendar', {
  serviceId: text('service_id').notNull().primaryKey(),
  monday: integer('monday').notNull(),
  tuesday: integer('tuesday').notNull(),
  wednesday: integer('wednesday').notNull(),
  thursday: integer('thursday').notNull(),
  friday: integer('friday').notNull(),
  saturday: integer('saturday').notNull(),
  sunday: integer('sunday').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
});

export const gtfsCalendarModel: Model<typeof gtfsCalendar> = {
  name: 'calendar',
  table: gtfsCalendar,
  conflictTarget: gtfsCalendar.serviceId,
  async convertToRow(data) {
    return {
      serviceId: data.string('service_id').required().get(),
      monday: data.integer('monday').required().get(),
      tuesday: data.integer('tuesday').required().get(),
      wednesday: data.integer('wednesday').required().get(),
      thursday: data.integer('thursday').required().get(),
      friday: data.integer('friday').required().get(),
      saturday: data.integer('saturday').required().get(),
      sunday: data.integer('sunday').required().get(),
      startDate: data.string('start_date').required().get(),
      endDate: data.string('end_date').required().get(),
    };
  },
};
