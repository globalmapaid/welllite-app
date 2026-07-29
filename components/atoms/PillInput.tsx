import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { colors, dimensions, typography } from '../theme';

interface PillInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  editable?: boolean;
}

export default function PillInput({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  editable,
}: PillInputProps) {
  return (
    <TextInput
      style={[
        styles.base,
        multiline && styles.multiline,
        error && styles.error,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      editable={editable}
      textAlignVertical={multiline ? 'top' : undefined}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: dimensions.inputHeight,
    backgroundColor: colors.inputBg,
    borderRadius: dimensions.radius,
    paddingHorizontal: 20,
    fontSize: typography.input.fontSize,
    color: colors.text,
  },
  multiline: {
    height: dimensions.multilineHeight,
    borderRadius: dimensions.multilineRadius,
    paddingTop: 14,
    paddingBottom: 14,
  },
  error: {
    borderWidth: 1,
    borderColor: colors.error,
  },
});
