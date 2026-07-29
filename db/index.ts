import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from './schema';

const sqlite = open({ name: 'welllite.db' });

sqlite.execute(`
  CREATE TABLE IF NOT EXISTS well_submissions (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at          INTEGER NOT NULL,
    synced_at           INTEGER,
    confirmed_well_here TEXT NOT NULL,
    well_name           TEXT NOT NULL,
    well_type           TEXT NOT NULL,
    well_status         TEXT NOT NULL,
    daily_users_estimate INTEGER,
    distance_to_water_km REAL,
    comments            TEXT,
    photo_uris          TEXT,
    static_water_level  REAL,
    well_diameter_cm    REAL,
    latitude            REAL,
    longitude           REAL,
    location_accuracy   REAL
  )
`);

export const db = drizzle(sqlite, { schema });
