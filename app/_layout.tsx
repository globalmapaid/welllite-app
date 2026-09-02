import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NetworkProvider, useNetwork } from '@/lib/network';
import { AuthProvider, useAuth } from '@/lib/auth';
import { LocaleProvider } from '@/lib/i18n';
import { colors, dimensions } from '@/components/theme';
import DevNetworkToggle from '@/components/molecules/DevNetworkToggle';
import PendingSyncBanner from '@/components/molecules/PendingSyncBanner';

function OfflineBanner() {
  const { status } = useAuth();
  const { isConnected } = useNetwork();
  const insets = useSafeAreaInsets();
  if (isConnected !== false) return null;

  const message =
    status === 'signedOut'
      ? "You're offline — browsing without an account. Well data you submit will be saved on this device and synced once you're back online and signed in."
      : 'No internet connection';

  return (
    <View style={[styles.banner, { marginTop: insets.top + 8 }]}>
      <Ionicons name="cloud-offline-outline" size={18} color={colors.white} style={styles.bannerIcon} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

function RootNavigator() {
  const { status } = useAuth();
  const { isConnected } = useNetwork();
  const loading = status === 'loading' || isConnected === null;
  const guest = status === 'signedOut' && isConnected === false;

  return (
    <Stack>
      <Stack.Protected guard={loading}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!loading && (status === 'signedIn' || guest)}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!loading && status === 'signedOut' && !guest}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <LocaleProvider>
        <AuthProvider>
          <NetworkProvider>
            <OfflineBanner />
            <PendingSyncBanner />
            <RootNavigator />
            <DevNetworkToggle />
          </NetworkProvider>
        </AuthProvider>
      </LocaleProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: dimensions.paddingH,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.error,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerIcon: {
    marginRight: 8,
  },
  bannerText: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
