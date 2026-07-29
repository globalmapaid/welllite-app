import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Text } from "react-native";
import { forgotPassword } from "../../lib/api/auth";
import FormField from "@/components/molecules/FormField";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { colors } from "@/components/theme";

export default function ForgotPassword() {
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!contact.trim()) return;
    setLoading(true);
    try {
      await forgotPassword({ email: contact.trim() });
      router.push({ pathname: "/(auth)/verify-email", params: { email: contact.trim(), mode: "reset" } });
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

  const disabled = !contact.trim() || loading;

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <View style={styles.logoArea}>
        <Image
          source={require("../../assets/wellLite-logo-black.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>
          Please choose how you'd like to recover your account.
        </Text>

        <FormField
          label="Enter email or phone number"
          value={contact}
          onChangeText={setContact}
          placeholder="Enter email or phone number"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loading ? "Sending…" : "Next"}
          onPress={handleNext}
          disabled={disabled}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  logoArea: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
  },
  logo: {
    width: "45%",
    height: 32,
  },
  body: {
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 28,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
});
