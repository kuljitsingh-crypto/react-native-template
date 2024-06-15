import { Image, SafeAreaView, StyleSheet, Text } from "react-native";
import React, { useEffect } from "react";
import { colors, fonts } from "../../utill";
import { useIntl } from "../../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { container } from "../../styles/appDefaultStyle";
import { ScreenParamList } from "../screenTypes";

type SplashProps = NativeStackScreenProps<ScreenParamList, "splash">;

const Splash = (props: SplashProps) => {
  const { navigation } = props;
  const intl = useIntl();
  return (
    <SafeAreaView style={styles.container}>
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
    width: 128,
    height: 128,
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
