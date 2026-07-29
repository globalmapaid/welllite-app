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

const OCCUPATION_OPTIONS = [
  'Well drilling or digging contractor',
  'Teacher',
  'Student',
  'NGO aid worker',
  'Government scientist',
  'Government aid worker',
  'Other',
];

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
        occupation,
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
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            error={errors.firstName}
          />

          <FormField
            label="Second name"
            value={secondName}
            onChangeText={setSecondName}
            placeholder="Enter second name"
            error={errors.secondName}
          />

          {/* Phone number — one-off prefix layout, stays inline */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone number</Text>
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
            <Text style={styles.label}>Confirm phone number</Text>
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
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <FormField
            label="Confirm email"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.confirmEmail}
          />

          <DropdownField
            label="Occupation"
            value={occupation}
            placeholder="Select occupation"
            options={OCCUPATION_OPTIONS}
            isOpen={occupationOpen}
            onToggle={() => setOccupationOpen((v) => !v)}
            onSelect={(v) => {
              setOccupation(v);
              setOccupationOpen(false);
            }}
          />

          <FormField
            label="Job description"
            value={jobDescription}
            onChangeText={setJobDescription}
            placeholder="Enter job description"
            multiline
          />

          <FormField
            label="Organisation"
            value={organisation}
            onChangeText={setOrganisation}
            placeholder="Add organisation details"
            multiline
          />

          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            error={errors.password}
          />

          <FormField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <PrimaryButton
            label="Agree & Continue"
            onPress={handleContinue}
            style={styles.submitButton}
          />

          <LinkRow
            prompt="Already have account? "
            linkText="Sign in"
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
