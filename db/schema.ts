import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const pendingWells = sqliteTable('pending_wells', {
  id:                        integer('id').primaryKey({ autoIncrement: true }),
  createdAt:                 integer('created_at', { mode: 'timestamp' }).notNull(),
  latitude:                  real('latitude'),
  longitude:                 real('longitude'),
  wellConfirmed:             integer('well_confirmed', { mode: 'boolean' }).notNull(),
  name:                      text('name').notNull(),
  wellType:                  text('well_type').notNull(),
  wellStatus:                text('well_status').notNull(),
  dailyUsersEstimate:        integer('daily_users_estimate'),
  distanceToOtherWaterKm:    real('distance_to_other_water_km'),
  openingDiameterCm:         real('opening_diameter_cm'),
  comments:                  text('comments'),
  photoUris:                 text('photo_uris'), // JSON-stringified array of local URIs; local-only, not synced
});

export const pendingReadings = sqliteTable('pending_readings', {
  id:                 integer('id').primaryKey({ autoIncrement: true }),
  createdAt:          integer('created_at', { mode: 'timestamp' }).notNull(),
  localWellId:        integer('local_well_id').notNull().references(() => pendingWells.id),
  swlMetres:          real('swl_metres').notNull(),
  measuredOn:         text('measured_on').notNull(),
});

// Single-row wholesale cache of the latest wells/search response, kept so
// the map has something to show when offline. Replaced in full on every
// successful fetch — a JSON blob, not modeled per-column since it's never
// queried, only read back whole.
export const wellsCache = sqliteTable('wells_cache', {
  id:                 integer('id').primaryKey(),
  updatedAt:          integer('updated_at', { mode: 'timestamp' }).notNull(),
  data:               text('data').notNull(),
});
