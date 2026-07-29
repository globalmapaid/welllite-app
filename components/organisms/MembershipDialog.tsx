import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Membership } from '@/lib/api/auth';
import { colors } from '../theme';

interface MembershipDialogProps {
  visible: boolean;
  memberships: Membership[];
  loading?: boolean;
  onSelect: (membershipId: string) => void;
}

export default function MembershipDialog({
  visible,
  memberships,
  loading,
  onSelect,
}: MembershipDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Select organisation</Text>
          <Text style={styles.subtitle}>Choose which organisation to sign in with.</Text>

          <View style={styles.list}>
            {memberships.map((membership, i) => (
              <TouchableOpacity
                key={membership.membership_id}
                style={[styles.row, i === memberships.length - 1 && styles.rowLast]}
                onPress={() => onSelect(membership.membership_id)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <View style={styles.rowText}>
                  <Text style={styles.clientName}>{membership.client_name}</Text>
                  <Text style={styles.role}>{membership.role}</Text>
                </View>
                {loading && <ActivityIndicator size="small" color={colors.text} />}
              </TouchableOpacity>
            ))}
          </View>
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
    padding: 24,
    width: '88%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitleGray,
    textAlign: 'center',
    marginTop: 8,
  },
  list: {
    marginTop: 20,
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
  rowText: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  role: {
    fontSize: 13,
    color: colors.subtitleGray,
    marginTop: 2,
  },
});
