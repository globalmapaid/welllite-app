import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LOCALES, useLocale } from '@/lib/i18n';
import { colors } from '../theme';

export default function LanguageSwitcher({ iconColor = colors.text }: { iconColor?: string }) {
  const { locale, setLocale } = useLocale();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="globe-outline" size={24} color={iconColor} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Language</Text>

            <View style={styles.list}>
              {LOCALES.map((item, i) => (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.row, i === LOCALES.length - 1 && styles.rowLast]}
                  onPress={() => {
                    setLocale(item.code);
                    setVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.code === locale && (
                    <Ionicons name="checkmark" size={18} color={colors.text} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginHorizontal: 24,
    padding: 24,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
