import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetwork } from '@/lib/network';

const LABELS: Record<'auto' | 'offline' | 'online', string> = {
  auto: 'Network: Auto',
  offline: 'Network: Offline',
  online: 'Network: Online',
};

function modeOf(devOverride: boolean | null): 'auto' | 'offline' | 'online' {
  if (devOverride === null) return 'auto';
  return devOverride ? 'online' : 'offline';
}

function nextOverride(devOverride: boolean | null): boolean | null {
  const mode = modeOf(devOverride);
  if (mode === 'auto') return false;
  if (mode === 'offline') return true;
  return null;
}

export default function DevNetworkToggle() {
  const insets = useSafeAreaInsets();
  const { devOverride, setDevOverride } = useNetwork();

  if (!__DEV__) return null;

  return (
    <TouchableOpacity
      style={[styles.button, { top: insets.top + 4, left: insets.left + 8 }]}
      onPress={() => setDevOverride(nextOverride(devOverride))}
    >
      <Text style={styles.text}>{LABELS[modeOf(devOverride)]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
