CREATE TABLE IF NOT EXISTS "feed_errors" (
	"id" serial PRIMARY KEY NOT NULL,
	"feed_id" integer NOT NULL,
	"task" text NOT NULL,
	"logs" json NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"import_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"headers" json,
	"last_updated" timestamp,
	"contact" json,
	"origin" json,
	"disabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "feeds_import_id_unique" UNIQUE("import_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_agencies" (
	"agency_id" text PRIMARY KEY NOT NULL,
	"agency_name" text NOT NULL,
	"agency_url" text NOT NULL,
	"agency_timezone" text NOT NULL,
	"agency_lang" text,
	"agency_phone" text,
	"agency_fare_url" text,
	"agency_email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_calendar" (
	"service_id" text PRIMARY KEY NOT NULL,
	"monday" integer NOT NULL,
	"tuesday" integer NOT NULL,
	"wednesday" integer NOT NULL,
	"thursday" integer NOT NULL,
	"friday" integer NOT NULL,
	"saturday" integer NOT NULL,
	"sunday" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_calendar_dates" (
	"service_id" text NOT NULL,
	"date" date NOT NULL,
	"exception_type" integer NOT NULL,
	CONSTRAINT "pk" PRIMARY KEY("service_id","date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_routes" (
	"route_id" text PRIMARY KEY NOT NULL,
	"agency_id" text,
	"route_short_name" text,
	"route_long_name" text,
	"route_desc" text,
	"route_type" integer NOT NULL,
	"route_url" text,
	"route_color" text,
	"route_text_color" text,
	"route_sort_order" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_shapes" (
	"shape_id" text PRIMARY KEY NOT NULL,
	"shape_location" geography(POINT,4326) NOT NULL,
	"shape_pt_sequence" integer NOT NULL,
	"shape_dist_traveled" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_stop_times" (
	"trip_id" text NOT NULL,
	"arrival_time" interval,
	"departure_time" interval,
	"stop_id" text NOT NULL,
	"stop_sequence" integer NOT NULL,
	"stop_sequence_consec" integer,
	"stop_headsign" text,
	"pickup_type" integer,
	"drop_off_type" integer,
	"shape_dist_traveled" real,
	"timepoint" integer,
	CONSTRAINT "gtfs_stop_times_trip_id_stop_id_stop_sequence_pk" PRIMARY KEY("trip_id","stop_id","stop_sequence")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_stops" (
	"stop_id" text PRIMARY KEY NOT NULL,
	"stop_code" text,
	"stop_name" text NOT NULL,
	"stop_desc" text,
	"stop_location" geography(POINT,4326),
	"zone_id" text,
	"stop_url" text,
	"location_type" integer,
	"parent_station" text,
	"stop_timezone" text,
	"wheelchair_boarding" integer,
	"level_id" text,
	"platform_code" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gtfs_trips" (
	"trip_id" text PRIMARY KEY NOT NULL,
	"route_id" text NOT NULL,
	"service_id" text NOT NULL,
	"trip_headsign" text,
	"trip_short_name" text,
	"direction_id" integer,
	"block_id" text,
	"shape_id" text,
	"wheelchair_accessible" integer,
	"bikes_allowed" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gbfs_station_information" (
	"station_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"location" geography(POINT,4326) NOT NULL,
	"region_id" text,
	"rental_uri_android" text,
	"rental_uri_ios" text,
	"rental_uri_web" text,
	"capacity" integer,
	"is_virtual" boolean,
	"last_updated" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gbfs_system_information" (
	"system_id" text PRIMARY KEY NOT NULL,
	"language" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"operator" text,
	"url" text,
	"purchase_url" text,
	"start_date" date,
	"phone_number" text,
	"email" text,
	"feed_contact_email" text,
	"timezone" text NOT NULL,
	"license_url" text,
	"terms_url" text,
	"terms_last_updated" date,
	"privacy_url" text,
	"privacy_last_updated" date,
	"rental_apps_android_discovery_url" text,
	"rental_apps_android_store_url" text,
	"rental_apps_ios_discovery_url" text,
	"rental_apps_ios_store_url" text,
	"last_updated" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feed_errors" ADD CONSTRAINT "feed_errors_feed_id_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "feeds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gtfs_routes" ADD CONSTRAINT "gtfs_routes_agency_id_gtfs_agencies_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "gtfs_agencies"("agency_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gtfs_stop_times" ADD CONSTRAINT "gtfs_stop_times_trip_id_trips_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "gtfs_trips"("trip_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gtfs_stop_times" ADD CONSTRAINT "gtfs_stop_times_stop_id_gtfs_stops_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "gtfs_stops"("stop_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gtfs_trips" ADD CONSTRAINT "trips_route_id_gtfs_routes_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "gtfs_routes"("route_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gtfs_trips" ADD CONSTRAINT "trips_shape_id_gtfs_shapes_shape_id_fk" FOREIGN KEY ("shape_id") REFERENCES "gtfs_shapes"("shape_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
