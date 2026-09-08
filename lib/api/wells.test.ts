jest.mock('../http', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

import http from '../http';
import { searchWells } from './wells';

describe('searchWells', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (http.get as jest.Mock).mockResolvedValue({ data: { items: [], truncated: false } });
  });

  it('maps camelCase bounds to snake_case query params', async () => {
    await searchWells({ minLat: 1, minLon: 2, maxLat: 3, maxLon: 4 });

    expect(http.get).toHaveBeenCalledWith('/api/v1/wells/search', {
      params: {
        min_lat: 1,
        min_lon: 2,
        max_lat: 3,
        max_lon: 4,
        review_status: undefined,
        limit: undefined,
      },
      signal: undefined,
    });
  });

  it('forwards optional reviewStatus, limit and signal', async () => {
    const controller = new AbortController();
    await searchWells(
      { minLat: 1, minLon: 2, maxLat: 3, maxLon: 4 },
      { reviewStatus: 'approved', limit: 50, signal: controller.signal },
    );

    expect(http.get).toHaveBeenCalledWith('/api/v1/wells/search', {
      params: {
        min_lat: 1,
        min_lon: 2,
        max_lat: 3,
        max_lon: 4,
        review_status: 'approved',
        limit: 50,
      },
      signal: controller.signal,
    });
  });
});
