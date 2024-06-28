import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SecondaryButton } from "./Button";
import {
  FacebookLoginAccesToken,
  FacebookLoginError,
  FacebookSignInError,
  facebookLogin,
} from "../utill";
import { normalFont } from "../styles/appDefaultStyle";
import Icon from "./Icon";
import { useToast } from "./SimpleToast";
import { FormatedMessage } from "./translation";
import { colors } from "../constants";

type FacebookSignInProps = {
  loginText: string;
  onError?: (errOptions: FacebookLoginError) => void;
  onSuccess: (accessToken: FacebookLoginAccesToken) => Promise<void>;
};

const defaultLoginError = {
  title: "Facebook Sign-In/Sign-Out Error",
  message:
    "An unknown error occurred during the Facebook sign-in/sign-out process. Please try again later.",
};

const FacebookSignInButton = (props: FacebookSignInProps) => {
  const { loginText, onError, onSuccess } = props;
  const [loginInProgress, setLoginInProgress] = useState(false);
  const toast = useToast();
  const buttonTextStyleMaybe = { style: styles.socialBtnText };
  const buttonStyleMaybe = { style: styles.socialBtn };

  const handleError = (options: FacebookLoginError) => {
    setLoginInProgress(false);
    toast.show({ title: options.title, desc: options.message, type: "error" });
    if (typeof onError === "function") {
      onError(options);
    }
  };

  const handleSuccess = async (accessToken: FacebookLoginAccesToken) => {
    try {
      if (typeof onSuccess === "function") {
        await onSuccess(accessToken);
      }
    } catch (e) {
      handleError({
        nativeError: e,
        ...defaultLoginError,
        errorCode: FacebookSignInError.OTHER,
      });
    }
  };

  const handleFacebookLogin = async () => {
    if (loginInProgress) return;
    setLoginInProgress(true);
    facebookLogin.login({ onError: handleError, onSuccess: handleSuccess });
  };

  return facebookLogin.hasFacebookId ? (
    <SecondaryButton
      {...buttonStyleMaybe}
      onPress={handleFacebookLogin}
      inProgress={loginInProgress}>
      <Icon
        name='logo-facebook'
        iconType='ionicons'
        color={colors.primaryDark}
      />
      <Text {...buttonTextStyleMaybe}>{loginText}</Text>
    </SecondaryButton>
  ) : (
    <FormatedMessage
      id='InvalidFacebookLoginId'
      style={styles.inActiveGoogleSignIn}
    />
  );
};

export default FacebookSignInButton;

const styles = StyleSheet.create({
  socialBtn: {
    flexDirection: "row",
    gap: 12,
    borderColor: colors.primaryDark,
  },
  socialBtnText: {
    color: colors.primaryDark,
    ...normalFont,
  },
  inActiveGoogleSignIn: {
    color: colors.black,
    paddingVertical: 4,
  },
});
