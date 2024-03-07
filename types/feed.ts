export type FeedMeta = {
  /**
   * Unique numerical identifier.
   */
  mdb_source_id: number;
  /**
   * The data format that the source uses, e.g gtfs, gtfs-rt.
   */
  data_type: 'gtfs' | 'gtfs-rt';
  /**
   * The feed entity types (abbreviated) available in the source: vp (vehicle positions), tu (trip updates) and sa (service alerts).
   */
  entity_type: ('vp' | 'tu' | 'sa')[];
  /**
   * Name of the transit provider.
   */
  provider: string;
  /**
   * An optional description of the data source, e.g to specify if the data source is an aggregate of multiple providers, or which network is represented by the source.
   */
  name?: string;
  /**
   * An email to use to contact the provider of the feed.
   */
  feed_contact_email?: string;
  /**
   * A list of the static sources that the real time source is associated with, represented by their MDB source IDs. Although optional, if not provided, the location of this source will be set to unknown.
   */
  static_reference?: number[];
  /**
   * A list of features that the source supports.
   */
  features?: 'occupancy'[];
  /**
   * The status of the source which can be used to determine if/how to include it in public trip-planning. If not provided, source is assumed to be active. Should be one of: active: The source is active and should be included in public trip-planning. inactive: The source is inactive / hasn't been updated recently and should be included in public trip-planning at risk of providing outdated information. deprecated: The source is explicitly deprecated and should not be included in public trip-planning. development: The source is in development or being used to test a specific feature and should not be included in public trip-planning.
   */
  status?: 'active' | 'deprecated' | 'inactive' | 'development';
  /**
   * A note to clarify complex use cases for consumers, for example when several static sources are represented in a realtime source.
   */
  note?: string;
  urls: {
    direct_download?: string;
    latest?: string;
    license?: string;
  };
  /**
   * A list of feed IDs that should be used as a replacement for this feed.
   */
  redirect?: {
    /**
     * The target feed id of that redirect.
     */
    id?: string;
    /**
     * A comment explaining the redirect.
     */
    comment?: string;
    [k: string]: unknown;
  }[];
  location?: {
    country_code?: string;
    subdivision_name?: string;
    municipality?: string;
    bounding_box?: {
      minimum_latitude: number;
      maximum_latitude: number;
      minimum_longitude: number;
      maximum_longitude: number;
      extracted_on: string;
    };
  };
};

export type Feed = FeedMeta & {
  last_fetched: Date;
  errors: { isWarning: boolean; message: string }[];
};
