import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { register } from "../../lib/api/auth";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import ErrorText from "@/components/atoms/ErrorText";
import { colors } from "@/components/theme";
import { useT, useTranslateServerMessage } from "@/lib/i18n";

export default function ReadyToSignUp() {
  const t = useT();
  const translateServerMessage = useTranslateServerMessage();
  const params = useLocalSearchParams<{
    email: string;
    password: string;
    firstName: string;
    secondName: string;
    phone?: string;
    occupation?: string;
    jobDescription?: string;
    organisation?: string;
  }>();

  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!privacyChecked) {
      setPrivacyError(true);
      return;
    }
    setPrivacyError(false);
    setLoading(true);
    try {
      await register({
        email: params.email,
        password: params.password,
        first_name: params.firstName,
        last_name: params.secondName,
        phone_number: params.phone || null,
        occupation: params.occupation || null,
        job_description: params.jobDescription || null,
        organisation: params.organisation || null,
        privacy_policy_agreed: true,
        terms_agreed: true,
      });
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: params.email },
      });
    } catch (error: any) {
      console.error('[auth] register error:', error);
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      Alert.alert('Registration failed', translateServerMessage(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/wellLite-logo-black.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/ethiopia-map.png")}
            style={styles.map}
            resizeMode="contain"
          />
        </View>

        <View style={styles.checkboxArea}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => {
              setPrivacyChecked((v) => !v);
              setPrivacyError(false);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, privacyChecked && styles.checkboxChecked, privacyError && styles.checkboxErrorBorder]}>
              {privacyChecked && <View style={styles.checkInner} />}
            </View>
            <Pressable onPress={() => router.push("/(auth)/privacy-policy")}>
              <Text style={styles.linkText}>{t('privacyAndPolicy')}</Text>
            </Pressable>
          </TouchableOpacity>
          {privacyError && (
            <View style={styles.errorRow}>
              <ErrorText message="You must agree to the Privacy and Policy to continue." />
            </View>
          )}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setMarketingChecked((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, marketingChecked && styles.checkboxChecked]}>
              {marketingChecked && <View style={styles.checkInner} />}
            </View>
            <Text style={styles.checkboxLabel}>{t('wantUpdates')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={loading ? 'Creating account…' : t('agreeContinue')}
          onPress={handleContinue}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logo: {
    width: "55%",
    height: 40,
    marginBottom: 16,
  },
  map: {
    width: "80%",
    height: 240,
  },
  checkboxArea: {
    marginTop: 28,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#888",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  checkboxErrorBorder: {
    borderColor: colors.error,
  },
  checkInner: {
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#000",
    flexShrink: 1,
  },
  linkText: {
    fontSize: 15,
    color: "#000",
    textDecorationLine: "underline",
  },
  errorRow: {
    marginLeft: 34,
    marginTop: -8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
