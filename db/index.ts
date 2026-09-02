import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from './schema';

const sqlite = open({ name: 'welllite.db' });

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS pending_wells (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    client_uuid                 TEXT NOT NULL DEFAULT '',
    created_at                  INTEGER NOT NULL,
    latitude                    REAL,
    longitude                   REAL,
    well_confirmed              INTEGER NOT NULL,
    name                        TEXT NOT NULL,
    well_type                   TEXT NOT NULL,
    well_status                 TEXT NOT NULL,
    daily_users_estimate        INTEGER,
    distance_to_other_water_km  REAL,
    opening_diameter_cm         REAL,
    comments                    TEXT,
    photo_uris                  TEXT
  )
`);

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS pending_readings (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    client_uuid       TEXT NOT NULL DEFAULT '',
    well_client_uuid  TEXT NOT NULL DEFAULT '',
    created_at        INTEGER NOT NULL,
    local_well_id     INTEGER NOT NULL REFERENCES pending_wells(id),
    swl_metres        REAL NOT NULL,
    measured_on       TEXT NOT NULL
  )
`);

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS wells_cache (
    id          INTEGER PRIMARY KEY,
    updated_at  INTEGER NOT NULL,
    data        TEXT NOT NULL
  )
`);

sqlite.execute(`DROP TABLE IF EXISTS well_submissions`);

// Ad-hoc migrations for columns added after the tables above first shipped —
// CREATE TABLE IF NOT EXISTS won't add these to an already-existing install.
for (const alter of [
  `ALTER TABLE pending_wells ADD COLUMN client_uuid TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE pending_readings ADD COLUMN client_uuid TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE pending_readings ADD COLUMN well_client_uuid TEXT NOT NULL DEFAULT ''`,
]) {
  try {
    sqlite.executeSync(alter);
  } catch {
    // column already exists
  }
}

export const db = drizzle(sqlite, { schema });
