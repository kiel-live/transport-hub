import { Readable } from 'node:stream';

import type { Model } from './types';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { gbfsStationInformationModel, gbfsSystemInformationModel } from '~/server/database/gbfs';
import { BasicImporter } from './importer';
import type { Feed } from '~/server/utils/db';

type GBFSDiscoveryV2_3 = {
  version: '2.3';
  last_updated: number;
  ttl: number;
  data: {
    [language: string]: {
      feeds: {
        name: string;
        url: string;
      }[];
    };
  };
};

type GBFSDiscoveryV3_0 = {
  version: '3.0-rc';
  last_updated: number;
  ttl: number;
  data: {
    feeds: {
      name: string;
      url: string;
    }[];
  };
};

type GBFSDiscovery = GBFSDiscoveryV2_3 | GBFSDiscoveryV3_0;

export class GbfsImporter extends BasicImporter {
  // models array is sorted by foreign key dependencies
  models = [gbfsStationInformationModel, gbfsSystemInformationModel];

  async getFeeds(gbfsUrl: string, headers?: { [key: string]: string }) {
    const gbfsDiscovery = await this.getJson<GBFSDiscovery>(gbfsUrl, headers);

    if (gbfsDiscovery.version === '2.3') {
      const feeds = gbfsDiscovery.data.en?.feeds || gbfsDiscovery.data[0].feeds;
      if (!feeds) {
        throw new Error('No feeds found');
      }
      return feeds;
    } else if (gbfsDiscovery.version === '3.0-rc') {
      return gbfsDiscovery.data.feeds;
    }

    throw new Error(`Unsupported GBFS version ${(gbfsDiscovery as GBFSDiscovery).version}`);
  }

  async getJson<T>(url: string, headers?: { [key: string]: string }): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    return response.json();
  }

  async importGBFSModel<T extends PgTableWithColumns<any>>(
    url: string,
    model: Model<T>,
    headers?: { [key: string]: string },
  ) {
    const json = await this.getJson(url, headers);
    const stream = model.extractRows ? await model.extractRows(json) : Readable.from([JSON.stringify(json)]);
    await this.importModel(stream, model);
  }

  async run(feed: Feed) {
    const headers = feed.headers || undefined;
    const feeds = await this.getFeeds(feed.url, headers);

    for (const model of this.models) {
      for (const feed of feeds) {
        if (feed.name === model.name) {
          const url = feed.url;
          this.log('importing ', model.name, '...');
          await this.importGBFSModel(url, model, headers);
        }
      }
    }
  }
}
