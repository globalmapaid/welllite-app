jest.mock('./api/auth', () => ({
  ...jest.requireActual('./api/auth'),
  login: jest.fn(),
  getMe: jest.fn(),
  selectClient: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('./http', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  getUser: jest.fn(),
  storeTokens: jest.fn(),
  storeUser: jest.fn(),
  clearTokens: jest.fn(),
  clearUser: jest.fn(),
  setActiveMembershipId: jest.fn(),
  setForceLogoutListener: jest.fn(),
}));

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import * as authApi from './api/auth';
import * as http from './http';
import { AuthProvider, useAuth } from './auth';

function Probe({ onValue }: { onValue: (value: ReturnType<typeof useAuth>) => void }) {
  onValue(useAuth());
  return null;
}

async function flushBootstrap() {
  await act(async () => {
    jest.advanceTimersByTime(1300);
    // drain the promise microtask queue that the timer's resolution kicked off
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
  });
}

async function renderAuth() {
  let latest!: ReturnType<typeof useAuth>;
  await act(async () => {
    TestRenderer.create(
      <AuthProvider>
        <Probe onValue={(value) => (latest = value)} />
      </AuthProvider>,
    );
  });
  await flushBootstrap();
  return () => latest;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (http.getAccessToken as jest.Mock).mockResolvedValue(null);
    (http.getRefreshToken as jest.Mock).mockResolvedValue(null);
    (http.getUser as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts signed out when there is no stored access token', async () => {
    const getValue = await renderAuth();

    expect(getValue().status).toBe('signedOut');
    expect(authApi.getMe).not.toHaveBeenCalled();
  });

  it('signs in immediately with a cached user, then refreshes it from the server', async () => {
    const cachedUser = { id: 'u1', email: 'cached@example.com' } as authApi.MeResponse;
    const freshUser = { id: 'u1', email: 'fresh@example.com' } as authApi.MeResponse;
    (http.getAccessToken as jest.Mock).mockResolvedValue('token');
    (http.getUser as jest.Mock).mockResolvedValue(cachedUser);
    (authApi.getMe as jest.Mock).mockResolvedValue(freshUser);

    const getValue = await renderAuth();

    expect(getValue().status).toBe('signedIn');
    expect(getValue().user).toEqual(freshUser);
    expect(http.storeUser).toHaveBeenCalledWith(freshUser);
  });

  it('falls back to the cached user when the background refresh fails', async () => {
    const cachedUser = { id: 'u1', email: 'cached@example.com' } as authApi.MeResponse;
    (http.getAccessToken as jest.Mock).mockResolvedValue('token');
    (http.getUser as jest.Mock).mockResolvedValue(cachedUser);
    (authApi.getMe as jest.Mock).mockRejectedValue(new Error('offline'));

    const getValue = await renderAuth();

    expect(getValue().status).toBe('signedIn');
    expect(getValue().user).toEqual(cachedUser);
  });

  it('signIn stores tokens and the user on a plain login response', async () => {
    const me = { id: 'u1', email: 'me@example.com' } as authApi.MeResponse;
    (authApi.login as jest.Mock).mockResolvedValue({
      access_token: 'a',
      refresh_token: 'r',
      token_type: 'bearer',
    });
    (authApi.getMe as jest.Mock).mockResolvedValue(me);

    const getValue = await renderAuth();
    await act(async () => {
      await getValue().signIn('me@example.com', 'password');
    });

    expect(http.storeTokens).toHaveBeenCalledWith({
      access_token: 'a',
      refresh_token: 'r',
      token_type: 'bearer',
    });
    expect(getValue().status).toBe('signedIn');
    expect(getValue().user).toEqual(me);
  });

  it('signIn stores a pending selection instead of tokens when memberships must be chosen', async () => {
    const memberships: authApi.Membership[] = [
      { membership_id: 'm1', client_id: 'c1', client_name: 'Client', role: 'admin' },
    ];
    (authApi.login as jest.Mock).mockResolvedValue({
      pre_auth_token: 'pre-token',
      token_type: 'bearer',
      memberships,
    });

    const getValue = await renderAuth();
    await act(async () => {
      await getValue().signIn('me@example.com', 'password');
    });

    expect(http.storeTokens).not.toHaveBeenCalled();
    expect(getValue().status).toBe('signedOut');
    expect(getValue().pendingSelection).toEqual({ preAuthToken: 'pre-token', memberships });
  });

  it('selectMembership completes sign-in and clears the pending selection', async () => {
    const memberships: authApi.Membership[] = [
      { membership_id: 'm1', client_id: 'c1', client_name: 'Client', role: 'admin' },
    ];
    (authApi.login as jest.Mock).mockResolvedValue({
      pre_auth_token: 'pre-token',
      token_type: 'bearer',
      memberships,
    });
    const me = { id: 'u1', email: 'me@example.com' } as authApi.MeResponse;
    (authApi.selectClient as jest.Mock).mockResolvedValue({
      access_token: 'a',
      refresh_token: 'r',
      token_type: 'bearer',
    });
    (authApi.getMe as jest.Mock).mockResolvedValue(me);

    const getValue = await renderAuth();
    await act(async () => {
      await getValue().signIn('me@example.com', 'password');
    });
    await act(async () => {
      await getValue().selectMembership('m1');
    });

    expect(authApi.selectClient).toHaveBeenCalledWith({ membership_id: 'm1' }, 'pre-token');
    expect(http.setActiveMembershipId).toHaveBeenCalledWith('m1');
    expect(getValue().pendingSelection).toBeNull();
    expect(getValue().status).toBe('signedIn');
    expect(getValue().user).toEqual(me);
  });

  it('signOut clears local session state even when the server call fails', async () => {
    (http.getRefreshToken as jest.Mock).mockResolvedValue('refresh-token');
    (authApi.logout as jest.Mock).mockRejectedValue(new Error('network error'));

    const getValue = await renderAuth();
    await act(async () => {
      await getValue().signOut();
    });

    expect(http.clearTokens).toHaveBeenCalled();
    expect(http.clearUser).toHaveBeenCalled();
    expect(getValue().status).toBe('signedOut');
    expect(getValue().user).toBeNull();
  });

  it('a triggered force-logout resets an authenticated session', async () => {
    const cachedUser = { id: 'u1', email: 'cached@example.com' } as authApi.MeResponse;
    (http.getAccessToken as jest.Mock).mockResolvedValue('token');
    (http.getUser as jest.Mock).mockResolvedValue(cachedUser);
    (authApi.getMe as jest.Mock).mockResolvedValue(cachedUser);

    const getValue = await renderAuth();
    expect(getValue().status).toBe('signedIn');

    const listener = (http.setForceLogoutListener as jest.Mock).mock.calls.find(
      ([fn]) => typeof fn === 'function',
    )?.[0];
    expect(typeof listener).toBe('function');

    await act(async () => {
      listener?.();
    });

    expect(getValue().status).toBe('signedOut');
    expect(getValue().user).toBeNull();
    expect(getValue().pendingSelection).toBeNull();
  });
});
