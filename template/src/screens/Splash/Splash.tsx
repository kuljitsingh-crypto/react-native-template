import { Image, SafeAreaView, StyleSheet, Text } from "react-native";
import React from "react";
import { colors, fonts } from "../../constants";
import { ScreenNavigation, useIntl } from "../../hooks";
import { container } from "../../styles/appDefaultStyle";

const SplashIcon = require("../../assets/image/splash.png");

type SplashProps = ScreenNavigation<"splash">;

const Splash = (props: SplashProps) => {
  const { navigation } = props;
  const intl = useIntl();
  return (
    <SafeAreaView style={styles.container}>
      <Image source={SplashIcon} style={styles.img} />
      <Text style={styles.title}>{intl.formatMessage("Splash.title")}</Text>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    ...container,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 96,
    height: 96,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    lineHeight: 42,
    marginTop: 8,
    fontWeight: "600",
    fontFamily: fonts.italic,
  },
});
