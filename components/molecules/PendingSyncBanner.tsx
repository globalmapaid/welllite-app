import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { useNetwork } from '@/lib/network';
import { getPendingCount, runSync } from '@/lib/sync';
import { colors, dimensions } from '@/components/theme';

export default function PendingSyncBanner() {
  const { status } = useAuth();
  const { isConnected } = useNetwork();
  const insets = useSafeAreaInsets();

  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);

  const active = isConnected === true && status === 'signedIn';

  useEffect(() => {
    if (!active) return;
    getPendingCount().then(setPendingCount);
  }, [active]);

  async function handleSync() {
    setSyncing(true);
    setSyncFailed(false);
    setRejectedCount(0);
    try {
      const { rejected } = await runSync();
      const count = await getPendingCount();
      setPendingCount(count);
      setSyncFailed(count > 0);
      setRejectedCount(rejected);
    } catch {
      setSyncFailed(true);
    } finally {
      setSyncing(false);
    }
  }

  if (!active || pendingCount === 0) return null;

  return (
    <View style={[styles.banner, { marginTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <Ionicons name="cloud-upload-outline" size={18} color={colors.white} style={styles.icon} />
        <Text style={styles.text}>
          {pendingCount} well{pendingCount === 1 ? '' : 's'} saved offline
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSync} disabled={syncing}>
          {syncing ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Text style={styles.buttonText}>Sync now</Text>
          )}
        </TouchableOpacity>
      </View>
      {syncFailed && rejectedCount > 0 && (
        <Text style={styles.errorText}>
          {rejectedCount} item{rejectedCount === 1 ? '' : 's'} couldn&apos;t be saved and{' '}
          {rejectedCount === 1 ? 'was' : 'were'} discarded.
        </Text>
      )}
      {syncFailed && rejectedCount === 0 && (
        <Text style={styles.errorText}>Couldn&apos;t sync — check your connection and try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: dimensions.paddingH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surveyedBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 6,
  },
});
