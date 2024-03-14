import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { point } from '../point';
import { Model } from '~/importer/types';
import { Readable } from 'node:stream';
import { GBFSData } from './types';

export const gbfsStationInformation = pgTable('gbfs_station_information', {
  stationId: text('station_id').notNull().primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  location: point('location').notNull(),
  regionId: text('region_id'),

  rentalUriAndroid: text('rental_uri_android'),
  rentalUriIOS: text('rental_uri_ios'),
  rentalUriWeb: text('rental_uri_web'),
  capacity: integer('capacity'),
  isVirtual: boolean('is_virtual'),

  // TODO: add remaining fields

  lastUpdated: timestamp('last_updated').notNull(),
});

type GBFSStationInformation = GBFSData<{
  stations: {
    station_id: string;
    name: string;
    short_name?: string;
    lat: number;
    lon: number;
    region_id?: string;
    rental_uri_android?: string;
    rental_uri_ios?: string;
    rental_uri_web?: string;
    capacity?: number;
    is_virtual?: boolean;
  }[];
}>;

export const gbfsStationInformationModel: Model<typeof gbfsStationInformation> = {
  name: 'station_information',
  table: gbfsStationInformation,
  conflictTarget: gbfsStationInformation.stationId,
  async extractRows(data: GBFSStationInformation) {
    return Readable.from(data.data.stations.map((s) => ({ ...s, last_updated: data.last_updated })));
  },
  async convertToRow(data) {
    return {
      stationId: data.string('station_id').required().get(),
      name: data.string('name').required().get(),
      shortName: data.string('short_name').get(),
      location: data.point('lon', 'lat').required().get(),
      regionId: data.string('region_id').get(),

      rentalUriAndroid: data.string('rental_uri_android').get(),
      rentalUriIOS: data.string('rental_uri_ios').get(),
      rentalUriWeb: data.string('rental_uri_web').get(),
      capacity: data.integer('capacity').get(),
      isVirtual: data.boolean('is_virtual').get(),

      lastUpdated: data.date('last_updated').required().get(),
    };
  },
};
