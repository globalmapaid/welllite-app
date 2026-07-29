import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";

function OutlinedButton({
  label,
  icon,
  onPress,
  filled,
}: {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  filled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, filled && styles.buttonFilled]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const goToApp = () => router.push("/(auth)/sign-in");
const goToSignUp = () => router.push("/(auth)/ready-to-sign-up");

export default function Landing() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.logoArea}>
        <Image
          source={require("../../assets/wellLite-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonArea}>
        {/* <OutlinedButton
          label="To Research Wells Data Entry"
          onPress={goToApp}
          filled
        /> */}

        {/* <View style={styles.gap} /> */}

        <OutlinedButton
          label="Create Account"
          onPress={() => router.push("/(auth)/sign-up")}
          filled
        />
        {/* <OutlinedButton
          label="Sign in with Facebook"
          icon={<FontAwesome name="facebook" size={20} color="#000" />}
          onPress={goToSignUp}
          filled
        /> */}
        {/* <OutlinedButton
          label="Sign in with Google"
          icon={<AntDesign name="google" size={20} color="#000" />}
          onPress={goToSignUp}
          filled
        /> */}
        <OutlinedButton
          label="Sign in with Email"
          icon={<Ionicons name="mail-outline" size={20} color="#fff" />}
          onPress={() => router.push("/(auth)/sign-in")}
        />

        <TouchableOpacity
          style={styles.visionLink}
          onPress={() => router.push("/(auth)/vision")}
        >
          <Text style={styles.visionText}>Vision and method ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  logoArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "55%",
  },
  buttonArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  iconSlot: {
    position: "absolute",
    left: 20,
  },
  buttonFilled: {
    backgroundColor: "#ffffff",
    borderColor: "transparent",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  buttonTextFilled: {
    color: "#000000",
  },
  gap: {
    height: 16,
  },
  visionLink: {
    marginTop: 6,
    paddingVertical: 8,
  },
  visionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
});
