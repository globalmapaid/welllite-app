import { StyleSheet, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import PillInput from '../atoms/PillInput';
import FormLabel from '../atoms/FormLabel';
import ErrorText from '../atoms/ErrorText';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <FormLabel text={label} />
      <PillInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
      />
      <ErrorText message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
