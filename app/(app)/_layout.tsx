import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import HeaderAvatarButton from '@/components/molecules/HeaderAvatarButton';
import LanguageSwitcher from '@/components/molecules/LanguageSwitcher';
import { useAuth } from '@/lib/auth';

export default function AppLayout() {
  const { status } = useAuth();
  const signedIn = status === 'signedIn';

  return (
    <Stack
      screenOptions={{
        headerBackTitle: '',
        headerStyle: { backgroundColor: '#ffffff' },
        headerShadowVisible: false,
        headerTintColor: '#000000',
        headerRight: () => (
          <View style={styles.headerRight}>
            <LanguageSwitcher />
            {signedIn && <HeaderAvatarButton />}
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Map' }} />
      <Stack.Screen name="enter-well-data" />
      <Stack.Screen name="profile" options={{ title: 'Profile', headerRight: () => <LanguageSwitcher /> }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
