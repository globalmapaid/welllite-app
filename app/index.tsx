import { Image, StyleSheet, View } from "react-native";

export default function Splash() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/wellLite-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "60%",
  },
});
