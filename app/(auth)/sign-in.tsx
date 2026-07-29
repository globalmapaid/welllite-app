import { useLayoutEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import FormField from "@/components/molecules/FormField";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import LinkRow from "@/components/atoms/LinkRow";
import MembershipDialog from "@/components/organisms/MembershipDialog";
import { colors } from "@/components/theme";
import { useAuth } from "@/lib/auth";

export default function SignIn() {
  const { fresh } = useLocalSearchParams<{ fresh?: string }>();
  const navigation = useNavigation();
  const { signIn, selectMembership, pendingSelection } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (fresh) {
      navigation.setOptions({ headerBackVisible: false });
    }
  }, [fresh, navigation]);

  async function handleLogin() {
    setLoading(true);
    try {
      await signIn(email, password);
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

  async function handleSelectMembership(membershipId: string) {
    setLoading(true);
    try {
      await selectMembership(membershipId);
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
      <View style={styles.logoArea}>
        <Image
          source={require("../../assets/wellLite-logo-black.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.forgotWrapper}
          onPress={() => router.push("/(auth)/forgot-password")}
        >
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>

        <PrimaryButton
          label={loading ? "Logging in…" : "Log in"}
          onPress={handleLogin}
          disabled={loading || !email || !password}
          loading={loading}
        />

        <LinkRow
          prompt="Don't have account? "
          linkText="Sign up"
          onPress={() => {}}
        />
      </View>

      <MembershipDialog
        visible={!!pendingSelection}
        memberships={pendingSelection?.memberships ?? []}
        loading={loading}
        onSelect={handleSelectMembership}
      />
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    width: "55%",
    height: 40,
  },
  form: {
    paddingHorizontal: 24,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 28,
  },
  forgotText: {
    fontSize: 15,
    color: colors.text,
  },
});
