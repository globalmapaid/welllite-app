import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyEmail, verifyResetOtp } from '../../lib/api/auth';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import SuccessModal from '@/components/organisms/SuccessModal';
import { colors } from '@/components/theme';
import { useT, useTranslateServerMessage } from '@/lib/i18n';

function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex < 0) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  if (local.length <= 4) return `${local[0]}***${domain}`;
  return `${local.slice(0, 3)}*****${local.slice(-1)}${domain}`;
}

export default function VerifyEmailScreen() {
  const { email, mode } = useLocalSearchParams<{ email: string; mode?: string }>();
  const t = useT();
  const translateServerMessage = useTranslateServerMessage();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  function handleChange(value: string, index: number) {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join('');
    if (code.length < 4) return;
    setLoading(true);
    try {
      if (mode === 'reset') {
        const { reset_token } = await verifyResetOtp({ email, code });
        setResetToken(reset_token);
        setShowSuccess(true);
      } else {
        await verifyEmail({ email, code });
        setShowSuccess(true);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Verification failed. Please try again.';
      Alert.alert('Verification failed', translateServerMessage(message));
    } finally {
      setLoading(false);
    }
  }

  function handleSuccessButton() {
    if (mode === 'reset') {
      setShowSuccess(false);
      router.push({ pathname: '/(auth)/reset-password', params: { reset_token: resetToken, email } });
    } else {
      router.replace({ pathname: '/(auth)/sign-in', params: { fresh: 'true' } });
    }
  }

  const codeComplete = digits.every((d) => d !== '');
  const maskedEmail = maskEmail(email ?? '');
  const verifyBody = t('verifyEmailBody', { email: maskedEmail });
  const [verifyBodyBefore, verifyBodyAfter] = verifyBody.split(maskedEmail);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.body}>
          {verifyBodyBefore}
          <Text style={styles.email}>{maskedEmail}</Text>
          {verifyBodyAfter}
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loading ? 'Verifying…' : t('verifyCode')}
          onPress={handleVerify}
          disabled={!codeComplete}
          loading={loading}
        />
      </View>

      <SuccessModal
        visible={showSuccess}
        title={mode === 'reset' ? t('codeVerifiedTitle') : 'Registration Successful'}
        body={
          mode === 'reset'
            ? t('codeVerifiedBody')
            : 'Your account has been created successfully. Please log in to continue.'
        }
        buttonLabel={mode === 'reset' ? t('resetPassword') : t('logIn')}
        onButtonPress={handleSuccessButton}
        onClose={mode === 'reset' ? () => setShowSuccess(false) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 40,
  },
  otpBox: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: colors.inputBg,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  otpBoxFilled: {
    backgroundColor: colors.iconCircleBg,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
