import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { point } from '../point';
import { Model } from '~/importer/types';

export const gtfsStop = pgTable('gtfs_stops', {
  stopId: text('stop_id').notNull().primaryKey(),
  stopCode: text('stop_code'),
  stopName: text('stop_name').notNull(),
  stopDescription: text('stop_desc'),
  stopLocation: point('stop_location'),
  zoneId: text('zone_id'),
  stopUrl: text('stop_url'),
  locationType: integer('location_type'),
  parentStation: text('parent_station'),
  stopTimezone: text('stop_timezone'), // TODO: add check
  wheelchairBoarding: integer('wheelchair_boarding'),
  levelId: text('level_id'),
  platformCode: text('platform_code'),
});

export const gtfsStopModel: Model<typeof gtfsStop> = {
  name: 'stops',
  table: gtfsStop,
  conflictTarget: gtfsStop.stopId,
  async convertToRow(data) {
    return {
      stopId: data.string('stop_id').required().get(),
      stopCode: data.string('stop_code').get(),
      stopName: data.string('stop_name').required().get(),
      stopDescription: data.string('stop_desc').get(),
      stopLocation: data.point('stop_lon', 'stop_lat').get(),
      zoneId: data.string('zone_id').get(),
      stopUrl: data.string('stop_url').get(),
      locationType: data.integer('location_type').get(),
      parentStation: data.string('parent_station').get(),
      stopTimezone: data.string('stop_timezone').get(),
      wheelchairBoarding: data.integer('wheelchair_boarding').get(),
      levelId: data.string('level_id').get(),
      platformCode: data.string('platform_code').get(),
    };
  },
};
