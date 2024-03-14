import { date, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { Model } from '~/importer/types';
import { Readable } from 'node:stream';
import { GBFSData } from './types';

export const gbfsSystemInformation = pgTable('gbfs_system_information', {
  systemId: text('system_id').notNull().primaryKey(),
  language: text('language').notNull(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  operator: text('operator'),
  url: text('url'),
  purchaseUrl: text('purchase_url'),
  startDate: date('start_date'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  feedContactEmail: text('feed_contact_email'),
  timezone: text('timezone').notNull(),
  licenseUrl: text('license_url'),
  termsUrl: text('terms_url'),
  termsLastUpdated: date('terms_last_updated'),
  privacyUrl: text('privacy_url'),
  privacyLastUpdated: date('privacy_last_updated'),
  rentalAppsAndroidDiscoveryUri: text('rental_apps_android_discovery_url'),
  rentalAppsAndroidStoreUri: text('rental_apps_android_store_url'),
  rentalAppsIOSDiscoveryUri: text('rental_apps_ios_discovery_url'),
  rentalAppsIOSStoreUri: text('rental_apps_ios_store_url'),
  lastUpdated: timestamp('last_updated').notNull(),
  // TODO: brand_assets
});

type GBFSSystemInformation = GBFSData<{}>;

export const gbfsSystemInformationModel: Model<typeof gbfsSystemInformation> = {
  name: 'system_information',
  table: gbfsSystemInformation,
  conflictTarget: gbfsSystemInformation.systemId,
  async extractRows(data: GBFSSystemInformation) {
    return Readable.from([{ ...data.data, last_updated: data.last_updated }]);
  },
  async convertToRow(data) {
    return {
      systemId: data.string('system_id').required().get(),
      language: data.string('language').required().get(),
      name: data.string('name').required().get(),
      shortName: data.string('short_name').get(),
      operator: data.string('operator').get(),
      url: data.string('url').get(),
      purchaseUrl: data.string('purchase_url').get(),
      // startDate: data.date('start_date').get(),
      phoneNumber: data.string('phone_number').get(),
      email: data.string('email').get(),
      feedContactEmail: data.string('feed_contact_email').get(),
      timezone: data.string('timezone').required().get(),
      licenseUrl: data.string('license_url').get(),
      termsUrl: data.string('terms_url').get(),
      // termsLastUpdated: data.date('terms_last_updated').get(),
      privacyUrl: data.string('privacy_url').get(),
      // privacyLastUpdated: data.date('privacy_last_updated').get(),
      rentalAppsAndroidDiscoveryUri: data.string('rental_apps_android_discovery_url').get(),
      rentalAppsAndroidStoreUri: data.string('rental_apps_android_store_url').get(),
      rentalAppsIOSDiscoveryUri: data.string('rental_apps_ios_discovery_url').get(),
      rentalAppsIOSStoreUri: data.string('rental_apps_ios_store_url').get(),
      lastUpdated: data.date('last_updated').required().get(),
    };
  },
};
