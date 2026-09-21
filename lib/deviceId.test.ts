jest.mock('expo-device', () => ({
  osName: 'iOS',
  modelName: 'iPhone 15 Pro',
}));

import * as Device from 'expo-device';
import { getDeviceHint } from './deviceId';

describe('getDeviceHint', () => {
  it('combines os name and model name for iOS', () => {
    expect(getDeviceHint()).toBe('ios-iphone15pro');
  });

  it('combines os name and model name for Android', () => {
    (Device as { osName: string | null }).osName = 'Android';
    (Device as unknown as { modelName: string | null }).modelName = 'Pixel 8';

    expect(getDeviceHint()).toBe('android-pixel8');
  });

  it('falls back to "unknown" when osName is missing', () => {
    (Device as { osName: string | null }).osName = null;
    (Device as unknown as { modelName: string | null }).modelName = 'Pixel 8';

    expect(getDeviceHint()).toBe('unknown-pixel8');
  });

  it('falls back to "unknown" when modelName is missing', () => {
    (Device as { osName: string | null }).osName = 'Android';
    (Device as unknown as { modelName: string | null }).modelName = null;

    expect(getDeviceHint()).toBe('android-unknown');
  });
});
