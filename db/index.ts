import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from './schema';

const sqlite = open({ name: 'welllite.db' });

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS pending_wells (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at     INTEGER NOT NULL,
    local_well_id  INTEGER NOT NULL REFERENCES pending_wells(id),
    swl_metres     REAL NOT NULL,
    measured_on    TEXT NOT NULL
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

export const db = drizzle(sqlite, { schema });
