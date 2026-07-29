import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../lib/api/auth";
import FormField from "@/components/molecules/FormField";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SuccessModal from "@/components/organisms/SuccessModal";
import { colors } from "@/components/theme";

export default function ResetPassword() {
  const { reset_token } = useLocalSearchParams<{ reset_token: string }>();
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
          Set a new password for your account. Make sure it's strong and easy for you to remember.
        </Text>

        <FormField
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <FormField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loading ? "Saving…" : "Save Password"}
          onPress={handleSave}
          disabled={disabled}
          loading={loading}
        />
      </View>

      <SuccessModal
        visible={showSuccess}
        title="Password Reset Successfully"
        body={successMessage}
        buttonLabel="Log in"
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
