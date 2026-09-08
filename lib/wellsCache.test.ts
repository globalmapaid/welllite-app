const mockState: { row: { id: number; updatedAt: Date; data: string } | undefined } = { row: undefined };

jest.mock('@/db', () => ({
  db: {
    delete: jest.fn(() => Promise.resolve()),
    insert: jest.fn(() => ({
      values: jest.fn((row: { id: number; updatedAt: Date; data: string }) => {
        mockState.row = row;
        return Promise.resolve();
      }),
    })),
    select: jest.fn(() => ({
      from: jest.fn(() => Promise.resolve(mockState.row ? [mockState.row] : [])),
    })),
  },
}));

import { db } from '@/db';
import { saveWellsCache, loadWellsCache } from './wellsCache';
import type { Well } from './api/wells';

describe('wellsCache', () => {
  beforeEach(() => {
    mockState.row = undefined;
    jest.clearAllMocks();
  });

  it('saveWellsCache deletes the existing cache then inserts the new one', async () => {
    const wells = [{ id: 'w1' } as Well];
    await saveWellsCache(wells);

    expect(db.delete).toHaveBeenCalledTimes(1);
    expect(db.insert).toHaveBeenCalledTimes(1);
    expect(mockState.row?.data).toBe(JSON.stringify(wells));
  });

  it('loadWellsCache returns [] when no row exists', async () => {
    await expect(loadWellsCache()).resolves.toEqual([]);
  });

  it('loadWellsCache returns [] when the stored data is invalid JSON', async () => {
    mockState.row = { id: 1, updatedAt: new Date(), data: 'not json' };
    await expect(loadWellsCache()).resolves.toEqual([]);
  });

  it('loadWellsCache returns the parsed wells when present', async () => {
    const wells = [{ id: 'w1' } as Well];
    mockState.row = { id: 1, updatedAt: new Date(), data: JSON.stringify(wells) };
    await expect(loadWellsCache()).resolves.toEqual(wells);
  });
});
