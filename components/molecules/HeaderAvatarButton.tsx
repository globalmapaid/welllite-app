import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/components/theme';

export default function HeaderAvatarButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/profile')}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="person-circle-outline" size={26} color={colors.text} />
    </TouchableOpacity>
  );
}
