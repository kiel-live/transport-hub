import { pgTable, text, interval, integer, real, primaryKey } from 'drizzle-orm/pg-core';
import { gtfsStop } from './stop';
import { gtfsTrip } from './trip';
import { Model } from '~/server/importer/types';

export const gtfsStopTime = pgTable(
  'gtfs_stop_times',
  {
    tripId: text('trip_id')
      .notNull()
      .references(() => gtfsTrip.tripId),
    arrivalTime: interval('arrival_time'),
    departureTime: interval('departure_time'),
    stopId: text('stop_id')
      .notNull()
      .references(() => gtfsStop.stopId),
    stopSequence: integer('stop_sequence').notNull(),
    stopSequenceConSec: integer('stop_sequence_consec'),
    stopHeadsign: text('stop_headsign'),
    pickupType: integer('pickup_type'),
    dropOffType: integer('drop_off_type'),
    shapeDistTraveled: real('shape_dist_traveled'),
    timepoint: integer('timepoint'),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.tripId, t.stopId, t.stopSequence] }),
    };
  },
);

export const gtfsStopTimeModel: Model<typeof gtfsStopTime> = {
  name: 'stop_times',
  table: gtfsStopTime,
  conflictTarget: [gtfsStopTime.tripId, gtfsStopTime.stopId, gtfsStopTime.stopSequence],
  async convertToRow(data) {
    return {
      tripId: data.string('trip_id').required().get(),
      arrivalTime: data.time('arrival_time').get(),
      departureTime: data.time('departure_time').get(),
      stopId: data.string('stop_id').required().get(),
      stopSequence: data.integer('stop_sequence').required().get(),
      stopSequenceConSec: data.integer('stop_sequence_consec').get(),
      stopHeadsign: data.string('stop_headsign').get(),
      pickupType: data.integer('pickup_type').get(),
      dropOffType: data.integer('drop_off_type').get(),
      shapeDistTraveled: data.float('shape_dist_traveled').get(),
      timepoint: data.integer('timepoint').get(),
    };
  },
};
