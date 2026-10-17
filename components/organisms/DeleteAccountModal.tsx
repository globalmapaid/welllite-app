import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../atoms/PrimaryButton';
import ErrorText from '../atoms/ErrorText';
import FormField from '../molecules/FormField';
import { colors, typography } from '../theme';

export type DeleteAccountStep = 'unsynced' | 'confirm' | 'credentials';

interface DeleteAccountModalProps {
  step: DeleteAccountStep | null;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onSubmit: (email: string, password: string) => void;
  onCancel: () => void;
}

export default function DeleteAccountModal({
  step,
  loading,
  error,
  onConfirm,
  onSubmit,
  onCancel,
}: DeleteAccountModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const visible = step !== null;

  // Keep rendering the last step while the modal fades out.
  const lastStep = useRef<DeleteAccountStep>('confirm');
  if (step) lastStep.current = step;
  const shownStep = lastStep.current;

  useEffect(() => {
    if (!visible) {
      setEmail('');
      setPassword('');
    }
  }, [visible]);

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
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          {shownStep === 'unsynced' && (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-upload-outline" size={36} color={colors.text} />
              </View>
              <Text style={styles.title}>Unsynced data</Text>
              <Text style={styles.body}>
                Please sync your local data before deleting your account.
              </Text>
              <PrimaryButton label="OK" onPress={onCancel} style={styles.primaryButton} />
            </>
          )}

          {shownStep === 'confirm' && (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="trash-outline" size={36} color={colors.error} />
              </View>
              <Text style={styles.title}>Delete account</Text>
              <Text style={styles.body}>
                This will permanently delete your account and all associated data. This action
                cannot be undone.
              </Text>
              <PrimaryButton
                label="Delete"
                onPress={onConfirm}
                style={[styles.primaryButton, styles.deleteButton]}
              />
            </>
          )}

          {shownStep === 'credentials' && (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="trash-outline" size={36} color={colors.error} />
              </View>
              <Text style={styles.title}>Confirm your identity</Text>
              <Text style={styles.body}>
                Enter your email and password to permanently delete your account.
              </Text>
              <View style={styles.form}>
                <FormField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FormField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  secureTextEntry
                />
                <ErrorText message={error} />
              </View>
              <PrimaryButton
                label={loading ? 'Deleting…' : 'Delete account'}
                onPress={() => onSubmit(email.trim(), password)}
                disabled={!email.trim() || !password}
                loading={loading}
                style={[styles.primaryButton, styles.deleteButton]}
              />
            </>
          )}

          {shownStep !== 'unsynced' && (
            <TouchableOpacity
              style={[styles.cancelButton, loading && styles.disabled]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  form: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    marginTop: 28,
  },
  deleteButton: {
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
