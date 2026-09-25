let netInfoListener: ((state: { isConnected: boolean | null; type: string }) => void) | null = null;

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn((listener) => {
      netInfoListener = listener;
      return () => {
        netInfoListener = null;
      };
    }),
  },
}));

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NetworkProvider, useNetwork } from './network';

function Probe({ onValue }: { onValue: (value: ReturnType<typeof useNetwork>) => void }) {
  onValue(useNetwork());
  return null;
}

function renderNetwork() {
  let latest!: ReturnType<typeof useNetwork>;
  act(() => {
    TestRenderer.create(
      <NetworkProvider>
        <Probe onValue={(value) => (latest = value)} />
      </NetworkProvider>,
    );
  });
  return () => latest;
}

describe('NetworkProvider', () => {
  afterEach(() => {
    netInfoListener = null;
  });

  it('reflects the real NetInfo connectivity value', () => {
    const getValue = renderNetwork();

    act(() => {
      netInfoListener?.({ isConnected: true, type: 'wifi' });
    });
    expect(getValue().isConnected).toBe(true);

    act(() => {
      netInfoListener?.({ isConnected: false, type: 'none' });
    });
    expect(getValue().isConnected).toBe(false);
  });
});
