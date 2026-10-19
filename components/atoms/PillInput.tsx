import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '@/lib/i18n';
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
  const t = useT();
  const [hidden, setHidden] = useState(true);

  const input = (
    <TextInput
      style={[
        styles.base,
        multiline && styles.multiline,
        secureTextEntry && styles.password,
        error && styles.error,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      secureTextEntry={secureTextEntry && hidden}
      keyboardType={keyboardType}
      autoCapitalize={secureTextEntry ? 'none' : autoCapitalize}
      autoCorrect={secureTextEntry ? false : undefined}
      textContentType={secureTextEntry ? 'password' : undefined}
      autoComplete={secureTextEntry ? 'password' : undefined}
      multiline={multiline}
      editable={editable}
      textAlignVertical={multiline ? 'top' : undefined}
    />
  );

  if (!secureTextEntry) return input;

  // Password fields get a show/hide toggle on the right.
  return (
    <View>
      {input}
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setHidden((h) => !h)}
        accessibilityRole="button"
        accessibilityLabel={hidden ? t('showPassword') : t('hidePassword')}
        hitSlop={8}
      >
        <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.placeholder} />
      </TouchableOpacity>
    </View>
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
  password: {
    paddingRight: 52,
  },
  toggle: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  error: {
    borderWidth: 1,
    borderColor: colors.error,
  },
});
