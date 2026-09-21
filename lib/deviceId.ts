import * as Device from 'expo-device';

// Derived from static OS/model facts (not stored data), so it needs no persistence
// layer and is naturally stable across app uninstall/reinstall. osVersion is
// deliberately excluded — including it would change the hint on every OS update.
export function getDeviceHint(): string {
  const os = (Device.osName ?? 'unknown').toLowerCase().replace(/\s+/g, '');
  const model = (Device.modelName ?? 'unknown').toLowerCase().replace(/\s+/g, '');
  return `${os}-${model}`;
}
