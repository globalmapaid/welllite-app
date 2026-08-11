import { Stack } from 'expo-router';
import HeaderAvatarButton from '@/components/molecules/HeaderAvatarButton';
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
        headerRight: () => (signedIn ? <HeaderAvatarButton /> : null),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Map' }} />
      <Stack.Screen name="enter-well-data" />
      <Stack.Screen name="profile" options={{ title: 'Profile', headerRight: () => null }} />
    </Stack>
  );
}
