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

export async function runSync(): Promise<{ rejected: number }> {
  if (syncing) return { rejected: 0 };
  syncing = true;
  try {
    const user = await getUser();
    if (!user) return { rejected: 0 };

    const wellRows = await db.select().from(pendingWells);
    const readingRows = await db.select().from(pendingReadings);
    if (wellRows.length === 0 && readingRows.length === 0) return { rejected: 0 };

    const wells: CreateWellRequest[] = wellRows.map((row) => ({
      client_uuid: row.clientUuid,
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
      client_uuid: row.clientUuid,
      well_client_uuid: row.wellClientUuid,
      swl_metres: row.swlMetres,
      measured_on: row.measuredOn,
    }));

    let response;
    try {
      response = await syncBatch({ wells, readings });
    } catch {
      // network error or SYNC_CONFLICT: leave local rows untouched, retry on next trigger
      return { rejected: 0 };
    }

    // The batch endpoint is fully idempotent and every item comes back as a
    // terminal result (created/duplicate/rejected), so the whole queue can be
    // cleared once the request succeeds — but rejected items are counted so
    // the caller can tell the user their data was permanently discarded.
    const rejected =
      response.wells.filter((r) => r.status === 'rejected').length +
      response.readings.filter((r) => r.status === 'rejected').length;

    for (const row of wellRows) {
      await db.delete(pendingWells).where(eq(pendingWells.id, row.id));
    }
    for (const row of readingRows) {
      await db.delete(pendingReadings).where(eq(pendingReadings.id, row.id));
    }

    return { rejected };
  } finally {
    syncing = false;
  }
}
