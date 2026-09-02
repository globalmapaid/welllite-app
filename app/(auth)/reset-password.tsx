import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../lib/api/auth";
import FormField from "@/components/molecules/FormField";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SuccessModal from "@/components/organisms/SuccessModal";
import { colors } from "@/components/theme";
import { useT } from "@/lib/i18n";

export default function ResetPassword() {
  const { reset_token } = useLocalSearchParams<{ reset_token: string }>();
  const t = useT();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const valid = newPassword.length > 0 && newPassword === confirmPassword;
  const disabled = !valid || loading;

  async function handleSave() {
    if (!valid) return;
    setLoading(true);
    try {
      const result = await resetPassword({ reset_token, new_password: newPassword });
      setSuccessMessage(result.message);
      setShowSuccess(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <View style={styles.body}>
        <Text style={styles.description}>
          {t('resetPasswordDescription')}
        </Text>

        <FormField
          label={t('newPassword')}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('enterPassword')}
          secureTextEntry
        />

        <FormField
          label={t('confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('confirmPassword')}
          secureTextEntry
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loading ? "Saving…" : t('savePassword')}
          onPress={handleSave}
          disabled={disabled}
          loading={loading}
        />
      </View>

      <SuccessModal
        visible={showSuccess}
        title="Password Reset Successfully"
        body={successMessage}
        buttonLabel={t('logIn')}
        onButtonPress={() => router.replace({ pathname: "/(auth)/sign-in", params: { fresh: "true" } })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
});
