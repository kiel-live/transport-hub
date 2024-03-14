import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { gtfsRoute } from './route';
import { gtfsShape } from './shape';
import { gtfsCalendar } from './calendar';
import { Model } from '~/server/importer/types';

export const gtfsTrip = pgTable('trips', {
  tripId: text('trip_id').notNull().primaryKey(),
  routeId: text('route_id')
    .notNull()
    .references(() => gtfsRoute.routeId),
  serviceId: text('service_id').notNull(),
  // .references(() => gtfsCalendar.serviceId), // TODO: reference not working as it could be calendar or calendar_date
  tripHeadsign: text('trip_headsign'),
  tripShortName: text('trip_short_name'),
  directionId: integer('direction_id'),
  blockId: text('block_id'),
  shapeId: text('shape_id').references(() => gtfsShape.shapeId),
  wheelchairAccessible: integer('wheelchair_accessible'),
  bikesAllowed: integer('bikes_allowed'),
});

export const gtfsTripModel: Model<typeof gtfsTrip> = {
  name: 'trips',
  table: gtfsTrip,
  conflictTarget: gtfsTrip.tripId,
  async convertToRow(data) {
    return {
      tripId: data.string('trip_id').required().get(),
      routeId: data.string('route_id').required().get(),
      serviceId: data.string('service_id').required().get(),
      tripHeadsign: data.string('trip_headsign').get(),
      tripShortName: data.string('trip_short_name').get(),
      directionId: data.integer('direction_id').get(),
      blockId: data.string('block_id').get(),
      shapeId: data.string('shape_id').get(),
      wheelchairAccessible: data.integer('wheelchair_accessible').get(),
      bikesAllowed: data.integer('bikes_allowed').get(),
    };
  },
};
