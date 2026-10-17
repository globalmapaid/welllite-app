import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors, typography } from '../theme';
import { useT } from '@/lib/i18n';

interface PhotoPolicyModalProps {
  visible: boolean;
  onContinue: () => void;
  onCancel: () => void;
  onDismiss?: () => void;
}

export default function PhotoPolicyModal({ visible, onContinue, onCancel, onDismiss }: PhotoPolicyModalProps) {
  const t = useT();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
      onDismiss={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={36} color={colors.text} />
          </View>
          <Text style={styles.title}>{t('photoPolicyTitle')}</Text>
          <Text style={styles.body}>{t('photoPolicyBody')}</Text>
          <PrimaryButton label={t('photoPolicyContinue')} onPress={onContinue} style={styles.continueButton} />
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
            <Text style={styles.cancelText}>{t('photoPolicyCancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    padding: 28,
    width: '88%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.iconCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  body: {
    alignSelf: 'stretch',
    fontSize: 15,
    color: colors.subtitleGray,
    lineHeight: 22,
    marginTop: 12,
  },
  continueButton: {
    width: '100%',
    marginTop: 28,
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
  },
  cancelText: {
    color: colors.text,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
});
