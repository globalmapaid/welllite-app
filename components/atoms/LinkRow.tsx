import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme';

interface LinkRowProps {
  prompt: string;
  linkText: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function LinkRow({ prompt, linkText, onPress, style }: LinkRowProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.prompt}>{prompt}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  prompt: {
    fontSize: 15,
    color: colors.text,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
});
