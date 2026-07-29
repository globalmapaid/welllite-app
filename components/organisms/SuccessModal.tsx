import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors } from '../theme';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  body: string;
  buttonLabel: string;
  onButtonPress: () => void;
  onClose?: () => void;
}

export default function SuccessModal({
  visible,
  title,
  body,
  buttonLabel,
  onButtonPress,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}

          <View style={styles.iconCircle}>
            <Image
              source={require('../../assets/checkMark.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>

          <PrimaryButton
            label={buttonLabel}
            onPress={onButtonPress}
            style={styles.button}
          />
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: colors.text,
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
  checkIcon: {
    width: 36,
    height: 36,
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
  button: {
    width: '100%',
    marginTop: 28,
  },
});
