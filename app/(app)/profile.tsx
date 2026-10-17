import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import * as authApi from '@/lib/api/auth';
import type { Membership } from '@/lib/api/auth';
import { getActiveMembershipId, setActiveMembershipId } from '@/lib/http';
import FormLabel from '@/components/atoms/FormLabel';
import PillInput from '@/components/atoms/PillInput';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import DropdownField from '@/components/molecules/DropdownField';
import DeleteAccountModal, {
  type DeleteAccountStep,
} from '@/components/organisms/DeleteAccountModal';
import LogoutModal from '@/components/organisms/LogoutModal';
import SuccessModal from '@/components/organisms/SuccessModal';
import { colors, dimensions, typography } from '@/components/theme';
import { useTranslateServerMessage } from '@/lib/i18n';
import { hasUnsyncedData } from '@/lib/sync';

export default function ProfileScreen() {
  const { user, signOut, switchMembership, deleteAccount } = useAuth();
  const translateServerMessage = useTranslateServerMessage();
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteStep, setDeleteStep] = useState<DeleteAccountStep | 'done' | null>(null);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [switching, setSwitching] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [membershipDropdownOpen, setMembershipDropdownOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fetchedMemberships, activeId] = await Promise.all([
          authApi.getMemberships(),
          getActiveMembershipId(),
        ]);
        if (!cancelled) {
          setMemberships(fetchedMemberships);
          const resolvedId = activeId ?? fetchedMemberships[0]?.membership_id ?? '';
          setSelectedMembershipId(resolvedId);
          if (!activeId && resolvedId) {
            await setActiveMembershipId(resolvedId);
          }
        }
      } catch (error: any) {
        if (!cancelled) {
          const message =
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong. Please try again.';
          Alert.alert('Error', translateServerMessage(message));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
    } catch {
      setLogoutModalVisible(false);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  }

  async function openDeleteAccount() {
    setDeleteError(undefined);
    setDeleteStep((await hasUnsyncedData()) ? 'unsynced' : 'confirm');
  }

  async function handleDeleteAccount(email: string, password: string) {
    setDeleting(true);
    setDeleteError(undefined);
    try {
      await deleteAccount(email, password);
      setDeleteStep('done');
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      setDeleteError(translateServerMessage(message));
    } finally {
      setDeleting(false);
    }
  }

  function handleMembershipSelect(membershipId: string) {
    setMembershipDropdownOpen(false);
    if (switching || membershipId === selectedMembershipId) return;
    Alert.alert(
      'Switch membership',
      "You're about to switch your membership. Are you sure?",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => handleSwitchMembership(membershipId) },
      ],
    );
  }

  async function handleSwitchMembership(membershipId: string) {
    setSwitching(true);
    try {
      await switchMembership(membershipId);
      setSelectedMembershipId(membershipId);
      Alert.alert('Success', 'Your membership has been switched.');
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      Alert.alert('Error', translateServerMessage(message));
    } finally {
      setSwitching(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={40} color={colors.text} />
        </View>

        <View style={styles.fieldGroup}>
          <FormLabel text="First name" />
          <PillInput
            value={user?.first_name ?? ''}
            onChangeText={() => {}}
            placeholder=""
            editable={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <FormLabel text="Last name" />
          <PillInput
            value={user?.last_name ?? ''}
            onChangeText={() => {}}
            placeholder=""
            editable={false}
          />
        </View>

        <View style={styles.fullWidth}>
          <DropdownField
            label="Membership"
            value={selectedMembershipId}
            placeholder="Select"
            options={memberships.map((m) => ({ label: m.client_name, value: m.membership_id }))}
            isOpen={membershipDropdownOpen}
            loading={switching}
            onToggle={() => {
              if (!switching) setMembershipDropdownOpen((o) => !o);
            }}
            onSelect={handleMembershipSelect}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loggingOut ? 'Logging out…' : 'Log out'}
          onPress={() => setLogoutModalVisible(true)}
          disabled={loggingOut || deleting}
          loading={loggingOut}
          style={styles.logoutButton}
        />
        <TouchableOpacity
          style={[styles.deleteButton, (loggingOut || deleting) && styles.disabled]}
          onPress={openDeleteAccount}
          disabled={loggingOut || deleting}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>Delete account</Text>
        </TouchableOpacity>
      </View>

      <LogoutModal
        visible={logoutModalVisible}
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />

      <DeleteAccountModal
        step={deleteStep === 'done' ? null : deleteStep}
        loading={deleting}
        error={deleteError}
        onConfirm={() => setDeleteStep('credentials')}
        onSubmit={handleDeleteAccount}
        onCancel={() => setDeleteStep(null)}
      />

      <SuccessModal
        visible={deleteStep === 'done'}
        title="Account deleted"
        body="Your account has been permanently deleted."
        buttonLabel="OK"
        onButtonPress={signOut}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: dimensions.paddingH, alignItems: 'center' },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.iconCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },

  fieldGroup: { width: '100%', marginTop: 16 },
  fullWidth: { width: '100%' },

  footer: {
    paddingHorizontal: dimensions.paddingH,
    paddingTop: 48,
    paddingBottom: 24,
  },
  logoutButton: { backgroundColor: colors.error },
  deleteButton: { marginTop: 16, alignItems: 'center', padding: 8 },
  deleteText: {
    color: colors.error,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  disabled: { opacity: 0.4 },
});
