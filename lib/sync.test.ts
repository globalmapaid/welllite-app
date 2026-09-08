jest.mock('@/db/schema', () => ({
  pendingWells: { table: 'pendingWells' },
  pendingReadings: { table: 'pendingReadings' },
}));

const mockState = {
  wellRows: [] as any[],
  readingRows: [] as any[],
  deleted: { wells: [] as any[], readings: [] as any[] },
};

jest.mock('@/db', () => {
  const { pendingWells, pendingReadings } = require('@/db/schema');
  return {
    db: {
      select: jest.fn(() => ({
        from: jest.fn((table: unknown) =>
          Promise.resolve(table === pendingWells ? mockState.wellRows : mockState.readingRows),
        ),
      })),
      delete: jest.fn((table: unknown) => ({
        where: jest.fn(() => {
          if (table === pendingWells) mockState.deleted.wells.push(true);
          else if (table === pendingReadings) mockState.deleted.readings.push(true);
          return Promise.resolve();
        }),
      })),
    },
  };
});

jest.mock('./http', () => ({
  getUser: jest.fn(),
}));

jest.mock('./api/sync', () => ({
  syncBatch: jest.fn(),
}));

import { getUser } from './http';
import { syncBatch } from './api/sync';
import { runSync } from './sync';

function makeWellRow(id: number) {
  return {
    id,
    clientUuid: `well-${id}`,
    latitude: 1,
    longitude: 2,
    wellConfirmed: true,
    name: 'Well',
    wellType: 'borehole',
    wellStatus: 'active',
    dailyUsersEstimate: null,
    distanceToOtherWaterKm: null,
    openingDiameterCm: null,
    comments: null,
  };
}

function makeReadingRow(id: number) {
  return {
    id,
    clientUuid: `reading-${id}`,
    wellClientUuid: 'well-1',
    swlMetres: 3.2,
    measuredOn: '2026-01-01',
  };
}

describe('runSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.wellRows = [];
    mockState.readingRows = [];
    mockState.deleted = { wells: [], readings: [] };
    (getUser as jest.Mock).mockResolvedValue({ id: 'user-1' });
  });

  it('does nothing when there is no logged-in user', async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    mockState.wellRows = [makeWellRow(1)];

    await runSync();

    expect(syncBatch).not.toHaveBeenCalled();
  });

  it('does nothing when both queues are empty', async () => {
    await runSync();

    expect(syncBatch).not.toHaveBeenCalled();
  });

  it('clears both queues after a successful sync', async () => {
    mockState.wellRows = [makeWellRow(1)];
    mockState.readingRows = [makeReadingRow(2)];
    (syncBatch as jest.Mock).mockResolvedValue({ results: [] });

    await runSync();

    expect(syncBatch).toHaveBeenCalledTimes(1);
    expect(mockState.deleted.wells).toHaveLength(1);
    expect(mockState.deleted.readings).toHaveLength(1);
  });

  it('leaves the queues untouched when syncBatch fails', async () => {
    mockState.wellRows = [makeWellRow(1)];
    (syncBatch as jest.Mock).mockRejectedValue(new Error('network error'));

    await runSync();

    expect(mockState.deleted.wells).toHaveLength(0);
  });

  it('does not run two syncs concurrently', async () => {
    mockState.wellRows = [makeWellRow(1)];
    let resolveBatch: (value: unknown) => void = () => {};
    (syncBatch as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveBatch = resolve;
      }),
    );

    const first = runSync();
    const second = runSync();
    resolveBatch({ results: [] });
    await Promise.all([first, second]);

    expect(syncBatch).toHaveBeenCalledTimes(1);
  });
});
