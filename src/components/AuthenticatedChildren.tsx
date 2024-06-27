import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../globalReducers/userSlice";
import { FormatedMessage } from "./translation";
import { PrimaryButton } from "./Button";
import { container, headerText } from "../styles/appDefaultStyle";
import { useIntl, useScreenNavigation } from "../hooks";
import { colors, fonts } from "../constants";
import {
  ScreenParamKey,
  ScreenParamList,
  ScreenRouteType,
  ScreenValue,
  screenNames,
} from "../screens/screenNames";
import NamedRedirect from "./NamedRedirect";

type AuthenticatedChildrenProps<Tname extends ScreenParamKey> = {
  children: React.ReactNode;
  unAuthHeaderMessage?: string;
  unAuthHeaderStyle?: Record<string, string | number>;
  unAuthDescriptionMessage?: string;
  unAuthDescriptionStyle?: Record<string, string | number>;
} & {
  redirectOnUnauthorized?: boolean;
  redirectOptions?: ScreenRouteType<Tname>;
};

const AuthenticatedChildren = <Tname extends ScreenParamKey>(
  props: AuthenticatedChildrenProps<Tname>
) => {
  const {
    children,
    unAuthHeaderMessage,
    unAuthDescriptionMessage,
    unAuthHeaderStyle,
    unAuthDescriptionStyle,
    redirectOnUnauthorized,
    redirectOptions,
  } = props;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigation = useScreenNavigation();
  const intl = useIntl();
  const headerStyle = [
    headerText,
    ...(unAuthHeaderStyle ? [unAuthHeaderStyle] : []),
  ];
  const descStyle = [
    styles.desc,
    ...(unAuthDescriptionStyle ? [unAuthDescriptionStyle] : []),
  ];

  const handlePress = () => {
    navigation.navigate(screenNames.login as never);
  };

  const { name = screenNames.login, params } = redirectOptions || {};

  return redirectOnUnauthorized ? (
    <NamedRedirect
      name={name as Tname}
      params={params as ScreenParamList[Tname]}
      replace={true}
    />
  ) : (
    <SafeAreaView style={styles.container}>
      {isAuthenticated ? (
        children
      ) : (
        <View>
          <Text style={headerStyle}>
            {unAuthHeaderMessage ||
              intl.formatMessage("AuthenticatedChildren.title")}
          </Text>
          <Text style={descStyle}>
            {unAuthDescriptionMessage ||
              intl.formatMessage("AuthenticatedChildren.desc")}
          </Text>
          <PrimaryButton style={styles.button} onPress={handlePress}>
            <FormatedMessage
              id='AuthenticatedChildren.loginText'
              style={styles.btnText}
            />
          </PrimaryButton>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuthenticatedChildren;

const styles = StyleSheet.create({
  container: {
    ...container,
    padding: 8,
  },
  desc: {
    color: colors.black,
    fontFamily: fonts.regluar,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.primary,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 28,
  },
});
