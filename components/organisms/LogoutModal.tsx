import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors, typography } from '../theme';

interface LogoutModalProps {
  visible: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ visible, loading, onConfirm, onCancel }: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!loading) onCancel();
      }}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={36} color={colors.error} />
          </View>
          <Text style={styles.title}>Log out</Text>
          <Text style={styles.body}>Are you sure you want to log out?</Text>
          <PrimaryButton
            label={loading ? 'Logging out…' : 'Log out'}
            onPress={onConfirm}
            loading={loading}
            style={styles.logoutButton}
          />
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.disabled]}
            onPress={onCancel}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
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
    fontSize: 15,
    color: colors.subtitleGray,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  logoutButton: {
    width: '100%',
    marginTop: 28,
    backgroundColor: colors.error,
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
  disabled: {
    opacity: 0.4,
  },
});
