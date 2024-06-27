import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SecondaryButton } from "./Button";
import Icon from "./Icon";
import {
  GoogleLoginError,
  GoogleLoginUser,
  googleLogin,
  GoogleSignInError,
} from "../utill";
import { normalFont } from "../styles/appDefaultStyle";
import { useToast } from "./SimpleToast";
import { FormatedMessage } from "./translation";
import { colors } from "../constants";

const defaultLoginError = {
  title: "Google Sign-In/Sign-Out Error",
  message:
    "An unknown error occurred during the Google sign-in/sign-out process. Please try again later.",
};
type GoogleSignInProps = {
  loginText: string;
  onError?: (errOptions: GoogleLoginError) => void;
  onSuccess: (user: GoogleLoginUser) => Promise<void>;
};

const GoogleSignInButton = (props: GoogleSignInProps) => {
  const { loginText, onError, onSuccess } = props;
  const toast = useToast();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const buttonTextStyleMaybe = { style: styles.socialBtnText };
  const buttonStyleMaybe = { style: styles.socialBtn };
  const handleError = (options: GoogleLoginError) => {
    setLoginInProgress(false);
    toast.show({ title: options.title, desc: options.message, type: "error" });
    if (typeof onError === "function") {
      onError(options);
    }
  };
  const handleSuccess = async (user: GoogleLoginUser) => {
    try {
      if (typeof onSuccess === "function") {
        await onSuccess(user);
      }
    } catch (e) {
      handleError({
        nativeError: e,
        ...defaultLoginError,
        errorCode: GoogleSignInError.OTHER,
      });
    }
  };

  const signIn = async () => {
    if (loginInProgress) return;
    setLoginInProgress(true);
    googleLogin.login({
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };

  return googleLogin.isGoogleLoginEnabled ? (
    <SecondaryButton
      {...buttonStyleMaybe}
      onPress={signIn}
      inProgress={loginInProgress}>
      <Icon name='google' iconType='ant' color={colors.primaryDark} />
      <Text {...buttonTextStyleMaybe}>{loginText}</Text>
    </SecondaryButton>
  ) : (
    <FormatedMessage
      id='InvalidGoogleLoginId'
      style={styles.inActiveGoogleSignIn}
    />
  );
};

export default GoogleSignInButton;
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
