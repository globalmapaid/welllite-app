import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useT } from "@/lib/i18n";

export default function VisionAndMethod() {
  const t = useT();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{t('ourVision')}</Text>
      <Text style={styles.body}>{t('visionBody')}</Text>

      <Text style={styles.heading}>{t('ourMethod')}</Text>
      <Text style={styles.body}>{t('methodBody')}</Text>

      <Text style={styles.callout}>{t('canYouHelp')}</Text>
      <Text style={styles.body}>{t('gpsNeeded')}</Text>

      <Text style={styles.sectionLabel}>
        {t('leadingProject')}
      </Text>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/mow-logo.png")}
          style={styles.logoMedium}
          resizeMode="contain"
        />
        <Text style={styles.orgLabel}>{t('ministryOrg')}</Text>
      </View>

      <View style={styles.logoBlock}>
        <Image
          source={require("../../assets/amu-logo.png")}
          style={styles.logoMedium}
          resizeMode="contain"
        />
        <Text style={styles.orgLabel}>{t('arbaMinchOrg')}</Text>
      </View>

      <Text style={styles.sectionLabel}>
        {t('fullySupported')}
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
