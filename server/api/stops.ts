import { sql } from 'drizzle-orm';
import { Point } from '../database/point';

export default defineEventHandler(async (event) => {
  const query = getQuery<{ top: string; left: string; right: string; bottom: string }>(event);

  const round = (num: number) => Number(num.toFixed(6));

  const top = query.top ? round(parseFloat(query.top)) : null;
  const left = query.left ? round(parseFloat(query.left)) : null;
  const right = query.right ? round(parseFloat(query.right)) : null;
  const bottom = query.bottom ? round(parseFloat(query.bottom)) : null;

  if (!top || !left || !right || !bottom) {
    throw createError({
      status: 400,
      statusMessage: 'Missing required query parameters',
    });
  }

  const db = useDB();

  const gtfsStops = await db
    .select({
      id: tables.gtfsStop.stopId,
      name: tables.gtfsStop.stopName,
      location: sql<Point>`st_astext(${sql.raw(tables.gtfsStop.stopLocation.name)}) as location`.mapWith(
        tables.gtfsStop.stopLocation,
      ),
    })
    .from(tables.gtfsStop)
    .where(
      sql`ST_Intersects(${sql.raw(
        tables.gtfsStop.stopLocation.name,
      )}, ST_MakeEnvelope(${left}, ${bottom}, ${right}, ${top}, 4326))
  `,
    )
    .limit(1_000);

  const gbfsStations = await db
    .select({
      id: tables.gbfsStationInformation.stationId,
      name: tables.gbfsStationInformation.name,
      location: sql<Point>`st_astext(${sql.raw(tables.gbfsStationInformation.location.name)}) as location`.mapWith(
        tables.gbfsStationInformation.location,
      ),
    })
    .from(tables.gbfsStationInformation)
    .where(
      sql`ST_Intersects(${sql.raw(
        tables.gbfsStationInformation.location.name,
      )}, ST_MakeEnvelope(${left}, ${bottom}, ${right}, ${top}, 4326))
  `,
    )
    .limit(1_000);

  return [...gbfsStations, ...gtfsStops];
});
