import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NetworkProvider, useNetwork } from '@/lib/network';
import { AuthProvider, useAuth } from '@/lib/auth';

function OfflineBanner() {
  const { isConnected } = useNetwork();
  if (isConnected !== false) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>No internet connection</Text>
    </View>
  );
}

function RootNavigator() {
  const { status } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={status === 'loading'}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={status === 'signedIn'}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={status === 'signedOut'}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NetworkProvider>
          <OfflineBanner />
          <RootNavigator />
        </NetworkProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
