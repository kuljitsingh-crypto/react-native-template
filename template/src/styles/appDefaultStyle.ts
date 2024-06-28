import React from "react";
import { StyleSheet } from "react-native";
import { fonts, colors } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    fontFamily: fonts.regluar,
    color: colors.black,
    padding: 16,
  },
  headerTextStyle: {
    fontFamily: fonts.semiBold,
    color: colors.black,
    fontSize: 20,
    lineHeight: 32,
  },
  normalFont: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regluar,
  },
});

export const container = styles.container;
export const headerText = styles.headerTextStyle;
export const normalFont = styles.normalFont;
