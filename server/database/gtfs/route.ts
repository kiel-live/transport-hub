import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { gtfsAgency } from './agency';
import { Model } from '~/importer/types';

export const gtfsRoute = pgTable('gtfs_routes', {
  routeId: text('route_id').notNull().primaryKey(),
  agencyId: text('agency_id').references(() => gtfsAgency.agencyId),
  routeShortName: text('route_short_name'),
  routeLongName: text('route_long_name'),
  routeDescription: text('route_desc'),
  routeType: integer('route_type').notNull(),
  routeUrl: text('route_url'),
  routeColor: text('route_color'),
  routeTextColor: text('route_text_color'),
  routeSortOrder: integer('route_sort_order'),
});

export const gtfsRouteModel: Model<typeof gtfsRoute> = {
  name: 'routes',
  table: gtfsRoute,
  conflictTarget: gtfsRoute.routeId,
  async convertToRow(data) {
    return {
      routeId: data.string('route_id').required().get(),
      agencyId: data.string('agency_id').get(),
      routeShortName: data.string('route_short_name').get(),
      routeLongName: data.string('route_long_name').get(),
      routeDescription: data.string('route_desc').get(),
      routeType: data.integer('route_type').required().get(),
      routeUrl: data.string('route_url').get(),
      routeColor: data.string('route_color').get(),
      routeTextColor: data.string('route_text_color').get(),
      routeSortOrder: data.integer('route_sort_order').get(),
    };
  },
};
