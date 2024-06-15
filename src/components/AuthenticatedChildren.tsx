import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../globalReducers/userSlice";
import { FormatedMessage } from "./translation";
import { PrimaryButton } from "./Button";
import { useNavigation } from "@react-navigation/native";
import { container, headerText } from "../styles/appDefaultStyle";
import { useIntl } from "../hooks";
import { colors, fonts } from "../utill";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ScreenParamList,
  ScreenValue,
  screenNames,
} from "../screens/screenTypes";

type AuthenticatedChildrenProps = {
  children: React.ReactNode;
  unAuthHeaderMessage?: string;
  unAuthHeaderStyle?: Record<string, string | number>;
  unAuthDescriptionMessage?: string;
  unAuthDescriptionStyle?: Record<string, string | number>;
  redirectOnUnauthorized?: boolean;
  redirectTo?: ScreenValue;
};
const AuthenticatedChildren = (props: AuthenticatedChildrenProps) => {
  const {
    children,
    unAuthHeaderMessage,
    unAuthDescriptionMessage,
    unAuthHeaderStyle,
    unAuthDescriptionStyle,
    redirectOnUnauthorized,
    redirectTo,
  } = props;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigation = useNavigation<
    NativeStackScreenProps<ScreenParamList>
  >() as any;
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

  useEffect(() => {
    if (redirectOnUnauthorized) {
      const redirectPathName = redirectTo || screenNames.login;
      navigation.replace(redirectPathName as never, {} as never);
    }
  }, []);

  return redirectOnUnauthorized ? null : (
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
