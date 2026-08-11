import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { pendingWells, pendingReadings } from '@/db/schema';
import { getUser } from './http';
import { syncBatch, type SyncReadingItem } from './api/sync';
import type { CreateWellRequest } from './api/wells';

let syncing = false;

export async function getPendingCount(): Promise<number> {
  const wellRows = await db.select().from(pendingWells);
  return wellRows.length;
}

export async function runSync(): Promise<void> {
  if (syncing) return;
  syncing = true;
  try {
    const user = await getUser();
    if (!user) return;

    const wellRows = await db.select().from(pendingWells);
    const readingRows = await db.select().from(pendingReadings);
    if (wellRows.length === 0 && readingRows.length === 0) return;

    const wells: CreateWellRequest[] = wellRows.map((row) => ({
      client_uuid: user.id,
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
      well_confirmed: row.wellConfirmed,
      name: row.name,
      well_type: row.wellType,
      well_status: row.wellStatus,
      daily_users_estimate: row.dailyUsersEstimate ?? undefined,
      distance_to_other_water_km: row.distanceToOtherWaterKm ?? undefined,
      opening_diameter_cm: row.openingDiameterCm ?? undefined,
      comments: row.comments ?? undefined,
    }));

    const readings: SyncReadingItem[] = readingRows.map((row) => ({
      client_uuid: user.id,
      well_client_uuid: user.id,
      swl_metres: row.swlMetres,
      measured_on: row.measuredOn,
    }));

    try {
      await syncBatch({ wells, readings });
    } catch {
      // network error or SYNC_CONFLICT: leave local rows untouched, retry on next trigger
      return;
    }

    // The batch endpoint is fully idempotent and every item comes back as a
    // terminal result (created/duplicate/rejected) on success, so the whole
    // queue can be cleared once the request succeeds.
    for (const row of wellRows) {
      await db.delete(pendingWells).where(eq(pendingWells.id, row.id));
    }
    for (const row of readingRows) {
      await db.delete(pendingReadings).where(eq(pendingReadings.id, row.id));
    }
  } finally {
    syncing = false;
  }
}
