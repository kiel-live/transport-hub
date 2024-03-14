import { customType } from 'drizzle-orm/pg-core';

export type Point = { longitude: number; latitude: number };

export const point = customType<{
  data: Point;
  driverData: string;
}>({
  dataType() {
    return 'geography(POINT,4326)';
  },
  toDriver(value: Point): string {
    return `SRID=4326;POINT(${value.longitude} ${value.latitude})`;
  },
  fromDriver(value: string): Point {
    const matches = value.match(/POINT\((?<longitude>[\d.-]+) (?<latitude>[\d.-]+)\)/);
    if (!matches || !matches.groups) {
      throw new Error('Invalid point format');
    }
    const { longitude, latitude } = matches.groups;

    return {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };
  },
});
