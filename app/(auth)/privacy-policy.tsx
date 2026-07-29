import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/wellLite-logo-black.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/ethiopia-flag.png")}
            style={styles.flag}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.paragraph}>
          We work in accordance with legal code for Personal Data Protection Proclamation No.
          1321/2024 under the Ethiopian Communications Authority.
        </Text>

        <Text style={styles.paragraph}>
          In summary, we use personal data with your permission, within lawfulness, fairness, and
          transparency. All data including personal data is used to promote development for wells, or
          for the benefit of other sustainable development, under the leading authority of the
          University of Arba Minch and the Ministry of Water and Energy and our WellMapr project.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  logo: {
    width: "55%",
    height: 40,
    marginBottom: 16,
  },
  flag: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  paragraph: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 20,
  },
});
