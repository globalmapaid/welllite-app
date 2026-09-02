import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import DropdownField from '@/components/molecules/DropdownField';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import LinkRow from '@/components/atoms/LinkRow';
import ErrorText from '@/components/atoms/ErrorText';
import { colors, dimensions } from '@/components/theme';
import { useT } from '@/lib/i18n';

// Stable slugs stored in form state; display labels come from translations.
// The English label (not the slug, and not whatever's currently displayed)
// is what gets submitted to the API, keeping stored data language-independent.
const OCCUPATION_SLUGS = [
  'well_drilling_contractor',
  'teacher',
  'student',
  'ngo_aid_worker',
  'government_scientist',
  'government_aid_worker',
  'other',
] as const;

const OCCUPATION_TRANSLATION_KEYS: Record<(typeof OCCUPATION_SLUGS)[number], string> = {
  well_drilling_contractor: 'occupationWellDrilling',
  teacher: 'occupationTeacher',
  student: 'occupationStudent',
  ngo_aid_worker: 'occupationNgoAidWorker',
  government_scientist: 'occupationGovScientist',
  government_aid_worker: 'occupationGovAidWorker',
  other: 'occupationOther',
};

const OCCUPATION_ENGLISH_LABELS: Record<(typeof OCCUPATION_SLUGS)[number], string> = {
  well_drilling_contractor: 'Well drilling or digging contractor',
  teacher: 'Teacher',
  student: 'Student',
  ngo_aid_worker: 'NGO aid worker',
  government_scientist: 'Government scientist',
  government_aid_worker: 'Government aid worker',
  other: 'Other',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
  firstName?: string;
  secondName?: string;
  confirmPhone?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpScreen() {
  const t = useT();
  const occupationOptions = OCCUPATION_SLUGS.map((slug) => ({
    label: t(OCCUPATION_TRANSLATION_KEYS[slug]),
    value: slug,
  }));
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [occupationOpen, setOccupationOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const next: Errors = {};

    if (!firstName.trim()) {
      next.firstName = 'First name is required.';
    } else if (firstName.trim().length > 150) {
      next.firstName = 'First name must be 150 characters or fewer.';
    }

    if (!secondName.trim()) {
      next.secondName = 'Last name is required.';
    } else if (secondName.trim().length > 150) {
      next.secondName = 'Last name must be 150 characters or fewer.';
    }

    if (phone && confirmPhone !== phone) {
      next.confirmPhone = 'Phone numbers do not match.';
    }

    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }

    if (!confirmEmail.trim()) {
      next.confirmEmail = 'Please confirm your email.';
    } else if (confirmEmail.trim() !== email.trim()) {
      next.confirmEmail = 'Email addresses do not match.';
    }

    if (!password) {
      next.password = 'Password is required.';
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue() {
    if (!validate()) return;
    router.push({
      pathname: '/(auth)/ready-to-sign-up',
      params: {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        phone,
        occupation: occupation
          ? OCCUPATION_ENGLISH_LABELS[occupation as (typeof OCCUPATION_SLUGS)[number]]
          : '',
        jobDescription,
        organisation,
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FormField
            label={t('firstName')}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('enterFirstName')}
            error={errors.firstName}
          />

          <FormField
            label={t('secondName')}
            value={secondName}
            onChangeText={setSecondName}
            placeholder={t('enterSecondName')}
            error={errors.secondName}
          />

          {/* Phone number — one-off prefix layout, stays inline */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('phoneNumber')}</Text>
            <View style={styles.phoneRow}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>UK  +44</Text>
              </View>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Confirm phone number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t('confirmPhoneNumber')}</Text>
            <View style={styles.phoneRow}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>UK  +44</Text>
              </View>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                value={confirmPhone}
                onChangeText={setConfirmPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
              />
            </View>
            <ErrorText message={errors.confirmPhone} />
          </View>

          <FormField
            label={t('email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('enterEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <FormField
            label={t('confirmEmail')}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder={t('enterEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.confirmEmail}
          />

          <DropdownField
            label={t('occupation')}
            value={occupation}
            placeholder={t('selectOccupation')}
            options={occupationOptions}
            isOpen={occupationOpen}
            onToggle={() => setOccupationOpen((v) => !v)}
            onSelect={(v) => {
              setOccupation(v);
              setOccupationOpen(false);
            }}
          />

          <FormField
            label={t('jobDescription')}
            value={jobDescription}
            onChangeText={setJobDescription}
            placeholder={t('enterJobDescription')}
            multiline
          />

          <FormField
            label={t('organisation')}
            value={organisation}
            onChangeText={setOrganisation}
            placeholder={t('addOrganisationDetails')}
            multiline
          />

          <FormField
            label={t('password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('enterPassword')}
            secureTextEntry
            error={errors.password}
          />

          <FormField
            label={t('confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('confirmPassword')}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <PrimaryButton
            label={t('agreeContinue')}
            onPress={handleContinue}
            style={styles.submitButton}
          />

          <LinkRow
            prompt={t('alreadyHaveAccountPrompt')}
            linkText={t('signInLink')}
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.signInRow}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: dimensions.paddingH, paddingTop: 8, paddingBottom: 40 },

  fieldGroup: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: 10 },

  phoneRow: {
    backgroundColor: colors.inputBg,
    borderRadius: dimensions.radius,
    height: dimensions.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    height: dimensions.inputHeight,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
  },

  submitButton: { marginTop: 36 },
  signInRow: { marginTop: 20 },
});
