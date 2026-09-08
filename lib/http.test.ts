const secureStore: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn((key: string) => Promise.resolve(secureStore[key] ?? null)),
  setItemAsync: jest.fn((key: string, value: string) => {
    secureStore[key] = value;
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key: string) => {
    delete secureStore[key];
    return Promise.resolve();
  }),
}));

jest.mock('./api/auth', () => ({
  refresh: jest.fn(),
}));

import MockAdapter from 'axios-mock-adapter';
import * as authApi from './api/auth';
import http, { setForceLogoutListener } from './http';

describe('http client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(secureStore)) delete secureStore[key];
    mock = new MockAdapter(http);
  });

  afterEach(() => {
    mock.restore();
    setForceLogoutListener(null);
  });

  it('attaches the stored access token as a Bearer header', async () => {
    secureStore.access_token = 'my-access-token';
    mock.onGet('/api/v1/wells/search').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer my-access-token');
      return [200, {}];
    });

    await http.get('/api/v1/wells/search');
  });

  it('does not attempt a refresh on a 401 from an excluded auth endpoint', async () => {
    mock.onPost('/api/v1/auth/login').reply(401);

    await expect(http.post('/api/v1/auth/login', {})).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(authApi.refresh).not.toHaveBeenCalled();
  });

  it('refreshes once and retries on a 401 from a normal endpoint', async () => {
    secureStore.refresh_token = 'my-refresh-token';
    (authApi.refresh as jest.Mock).mockResolvedValue({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      token_type: 'bearer',
    });

    let firstAttempt = true;
    mock.onGet('/api/v1/auth/me').reply((config) => {
      if (firstAttempt) {
        firstAttempt = false;
        return [401];
      }
      expect(config.headers?.Authorization).toBe('Bearer new-access-token');
      return [200, { ok: true }];
    });

    const response = await http.get('/api/v1/auth/me');

    expect(response.data).toEqual({ ok: true });
    expect(authApi.refresh).toHaveBeenCalledTimes(1);
  });

  it('shares a single refresh across concurrent 401s', async () => {
    secureStore.refresh_token = 'my-refresh-token';
    (authApi.refresh as jest.Mock).mockResolvedValue({
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      token_type: 'bearer',
    });

    const attempted = new Set<string>();
    mock.onGet('/api/v1/wells/one').reply((config) => {
      const key = 'one';
      if (!attempted.has(key)) {
        attempted.add(key);
        return [401];
      }
      return [200, { ok: 'one' }];
    });
    mock.onGet('/api/v1/wells/two').reply((config) => {
      const key = 'two';
      if (!attempted.has(key)) {
        attempted.add(key);
        return [401];
      }
      return [200, { ok: 'two' }];
    });

    await Promise.all([http.get('/api/v1/wells/one'), http.get('/api/v1/wells/two')]);

    expect(authApi.refresh).toHaveBeenCalledTimes(1);
  });

  it('clears tokens and calls the force-logout listener when refresh fails', async () => {
    secureStore.access_token = 'stale-access-token';
    secureStore.refresh_token = 'stale-refresh-token';
    (authApi.refresh as jest.Mock).mockRejectedValue(new Error('refresh failed'));
    const forceLogout = jest.fn();
    setForceLogoutListener(forceLogout);

    mock.onGet('/api/v1/wells/search').reply(401);

    await expect(http.get('/api/v1/wells/search')).rejects.toBeTruthy();

    expect(forceLogout).toHaveBeenCalledTimes(1);
    expect(secureStore.access_token).toBeUndefined();
    expect(secureStore.refresh_token).toBeUndefined();
  });
});
