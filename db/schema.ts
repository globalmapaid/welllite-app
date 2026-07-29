import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const wellSubmissions = sqliteTable('well_submissions', {
  id:                 integer('id').primaryKey({ autoIncrement: true }),
  createdAt:          integer('created_at', { mode: 'timestamp' }).notNull(),
  syncedAt:           integer('synced_at', { mode: 'timestamp' }),
  confirmedWellHere:  text('confirmed_well_here').notNull(),
  wellName:           text('well_name').notNull(),
  wellType:           text('well_type').notNull(),
  wellStatus:         text('well_status').notNull(),
  dailyUsersEstimate: integer('daily_users_estimate'),
  distanceToWaterKm:  real('distance_to_water_km'),
  comments:           text('comments'),
  photoUris:          text('photo_uris'), // JSON-stringified array of local URIs
  staticWaterLevel:   real('static_water_level'),
  wellDiameterCm:     real('well_diameter_cm'),
  latitude:           real('latitude'),
  longitude:          real('longitude'),
  locationAccuracy:   real('location_accuracy'),
});
