import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SecondaryButton } from "./Button";
import Icon from "./Icon";
import {
  colors,
  GoogleLoginError,
  GoogleLoginUser,
  googleLogin,
  GoogleSignInError,
} from "../utill";
import { normalFont } from "../styles/appDefaultStyle";
import { useToast } from "../SimpleToast";

const defaultLoginError = {
  title: "Google Sign-In/Sign-Out Error",
  message:
    "An unknown error occurred during the Google sign-in/sign-out process. Please try again later.",
};
type GoogleSignInProps = {
  loginText: string;
  buttonStyle?: Record<string, unknown>;
  buttonTextStyle?: Record<string, unknown>;
  iconStyle?: Record<string, unknown>;
  iconColor?: string;
  GoogleIcon?: (props: {
    style?: Record<string, unknown>;
    color: string;
  }) => React.JSX.Element;
  onError?: (errOptions: GoogleLoginError) => void;
  onSuccess: (user: GoogleLoginUser) => Promise<void>;
};

const GoogleSignInButton = (props: GoogleSignInProps) => {
  const {
    loginText,
    iconStyle,
    buttonTextStyle,
    buttonStyle,
    iconColor = colors.black,
    GoogleIcon,
    onError,
    onSuccess,
  } = props;
  const toast = useToast();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const iconStyleMaybe = !!iconStyle ? { style: iconStyle } : {};

  const buttonTextStyleMaybe = !!buttonTextStyle
    ? { style: buttonTextStyle }
    : { style: styles.socialBtnText };

  const buttonStyleMaybe = !!buttonStyle
    ? { style: buttonStyle }
    : { style: styles.socialBtn };

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
      {GoogleIcon ? (
        <GoogleIcon {...iconStyleMaybe} color={iconColor} />
      ) : (
        <Icon name='google' iconType='ant' color={iconColor} />
      )}
      <Text {...buttonTextStyleMaybe}>{loginText}</Text>
    </SecondaryButton>
  ) : (
    <Text style={styles.inActiveGoogleSignIn}>
      To Enable Google Sign in . Add GOOGLE_APP_CLIENT_ID in your .env and build
      your app once again.
    </Text>
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
