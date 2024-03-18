# Transport hub

The goal of this project is to have a database combining different public transport feeds. The system will provide a unified API for querying the data and receiving realtime updates. In the background it will import and update the data from different feeds. Currently supporting: GTFS, GBFS & GTFS-rt (todo).

## TODO

- [ ] UI
  - [ ] Show coverage map
  - [ ] List agencies / providers
  - [ ] Show agency routes
  - [ ] Show stops of a route
  - [ ] Show import errors
- [ ] Import
  - [ ] Prefix ids with some feed prefix / id
  - [ ] delete entries missing in newer data
  - [ ] Automate import task execution
  - [ ] Validate feed data
  - [x] Store import logs to db
  - [x] Import GTFS
  - [x] Import GBFS
  - [ ] Import GTFS-RT
- [ ] Api
  - [ ] streaming of updated data




