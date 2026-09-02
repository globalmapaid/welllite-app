import { Stack } from "expo-router";
import { useT } from "@/lib/i18n";
import LanguageSwitcher from "@/components/molecules/LanguageSwitcher";

export default function AuthLayout() {
  const t = useT();

  return (
    <Stack screenOptions={{ headerRight: () => <LanguageSwitcher /> }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-in"
        options={{ title: t('logIn'), headerBackTitle: "" }}
      />
      <Stack.Screen
        name="vision"
        options={{
          title: t('visionAndMethod'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="ready-to-sign-up"
        options={{
          title: t('readyToSignUp'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: t('privacyAndPolicy'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: t('signUp'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          title: t('accountVerification'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: t('forgotPassword'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: t('resetPassword'),
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
