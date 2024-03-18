CREATE VIEW stops as (SELECT stop_id as id, stop_name as name, stop_location as location, 'stop' as kind from gtfs_stops WHERE parent_station='')
UNION
(SELECT station_id as id, name, location, 'station' as kind from gbfs_station_information)
