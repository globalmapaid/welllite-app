import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormLabel from '../atoms/FormLabel';
import { colors, dimensions } from '../theme';

type DropdownOption = string | { label: string; value: string };

interface DropdownFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: DropdownOption[];
  isOpen: boolean;
  loading?: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

export default function DropdownField({
  label,
  value,
  placeholder,
  options,
  isOpen,
  loading,
  onToggle,
  onSelect,
}: DropdownFieldProps) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt,
  );
  const selectedLabel = normalizedOptions.find((opt) => opt.value === value)?.label ?? value;

  return (
    <View style={styles.container}>
      <FormLabel text={label} />
      <TouchableOpacity
        style={styles.trigger}
        onPress={onToggle}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.placeholder} />
        ) : (
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.placeholder}
          />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionList}>
          {normalizedOptions.map((opt, i) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, i === normalizedOptions.length - 1 && styles.optionLast]}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  trigger: {
    backgroundColor: colors.inputBg,
    borderRadius: dimensions.radius,
    height: dimensions.inputHeight,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    color: colors.placeholder,
  },
  optionList: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 15,
    color: colors.text,
  },
});
