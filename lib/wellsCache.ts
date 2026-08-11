import { db } from '@/db';
import { wellsCache } from '@/db/schema';
import type { Well } from './api/wells';

const CACHE_ROW_ID = 1;

export async function saveWellsCache(wells: Well[]): Promise<void> {
  await db.delete(wellsCache);
  await db.insert(wellsCache).values({
    id: CACHE_ROW_ID,
    updatedAt: new Date(),
    data: JSON.stringify(wells),
  });
}

export async function loadWellsCache(): Promise<Well[]> {
  const [row] = await db.select().from(wellsCache);
  if (!row) return [];
  try {
    return JSON.parse(row.data) as Well[];
  } catch {
    return [];
  }
}
