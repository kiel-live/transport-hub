import { integer, pgTable, real, text } from 'drizzle-orm/pg-core';
import { Model } from '~/server/importer/types';
import { point } from '../point';

export const gtfsShape = pgTable('gtfs_shapes', {
  shapeId: text('shape_id').notNull().primaryKey(),
  shapeLocation: point('shape_location').notNull(),
  shapePtSequence: integer('shape_pt_sequence').notNull(),
  shapeDistTraveled: real('shape_dist_traveled'),
});

export const gtfsShapeModel: Model<typeof gtfsShape> = {
  name: 'shapes',
  table: gtfsShape,
  conflictTarget: gtfsShape.shapeId,
  async convertToRow(data) {
    return {
      shapeId: data.string('shape_id').required().get(),
      shapeLocation: data.point('shape_pt_lon', 'shape_pt_lat').required().get(),
      shapePtSequence: data.integer('shape_pt_sequence').required().get(),
      shapeDistTraveled: data.float('shape_dist_traveled').required().get(),
    };
  },
};
