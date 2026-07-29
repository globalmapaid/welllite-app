import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';

interface ErrorTextProps {
  message?: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: typography.error.fontSize,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
