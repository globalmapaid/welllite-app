import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';

interface FormLabelProps {
  text: string;
}

export default function FormLabel({ text }: FormLabelProps) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: colors.text,
    marginBottom: 10,
  },
});
