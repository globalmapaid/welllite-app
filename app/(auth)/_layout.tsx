import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-in"
        options={{ title: "Sign in", headerBackTitle: "" }}
      />
      <Stack.Screen
        name="vision"
        options={{
          title: "Vision and Method",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="ready-to-sign-up"
        options={{
          title: "Ready to sign up",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy and policy",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign up",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          title: "Account Verification",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot password",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: "Reset password",
          headerBackTitle: "",
          headerStyle: { backgroundColor: "#ffffff" },
          headerShadowVisible: false,
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
