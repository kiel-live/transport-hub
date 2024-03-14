ALTER TABLE "gtfs_calendar_dates" DROP CONSTRAINT "gtfs_calendar_dates_service_id_gtfs_calendar_service_id_fk";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_service_id_gtfs_calendar_service_id_fk";
