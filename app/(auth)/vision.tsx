import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function VisionAndMethod() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Our vision</Text>
      <Text style={styles.body}>
        Together we want to research wells to improve rural water supply, and
        support small farmers, help crop yields, improve drinking water, increase
        small farm irrigation.
      </Text>

      <Text style={styles.heading}>Our method</Text>
      <Text style={styles.body}>
        We are building an Artificial Intelligence (AI) called "WallMapr" to
        better detect groundwater levels, to improve successful drills and use
        water sustainably. To succeed, the AI needs data on wells.
      </Text>

      <Text style={styles.callout}>Can you help us research wells please?</Text>
      <Text style={styles.body}>
        You need a modern smartphone that is{" "}
        <Text style={styles.underline}>GPS enabled.</Text>
      </Text>

      <Text style={styles.sectionLabel}>
        We are leading the WellLite project:
      </Text>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/mow-logo.png")}
          style={styles.logoMedium}
          resizeMode="contain"
        />
        <Text style={styles.orgLabel}>
          Ministry of Water and Energy AND{"\n"}Water Bureau across Ethiopia
        </Text>
      </View>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/amu-logo.png")}
          style={styles.logoMedium}
          resizeMode="contain"
        />
        <Text style={styles.orgLabel}>
          Araba Minch University{"\n"}Water Technology Institute
        </Text>
      </View>

      <Text style={styles.sectionLabel}>
        We are fully supported by honourable technologists from these
        organisations:
      </Text>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/cgs-logo.png")}
          style={styles.logoMedium}
          resizeMode="contain"
        />
      </View>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/gmu-logo.png")}
          style={styles.logoLarge}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.logoBlock, styles.lastLogoBlock]}>
        <Image
          source={require("../../assets/mapAid-logo.png")}
          style={styles.logoLarge}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
    marginBottom: 16,
  },
  underline: {
    textDecorationLine: "underline",
  },
  callout: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 16,
  },
  lastLogoBlock: {
    marginBottom: 0,
  },
  logoMedium: {
    width: 120,
    height: 120,
  },
  logoLarge: {
    width: 180,
    height: 80,
  },
  orgLabel: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
