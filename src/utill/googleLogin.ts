import {
  GoogleSignin,
  User,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { config } from "./config";

export const GoogleSignInError = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  SIGN_IN_REQUIRED: "SIGN_IN_REQUIRED",
  OTHER: "OTHER",
} as const;

type GoogleSignInErrorValue =
  (typeof GoogleSignInError)[keyof typeof GoogleSignInError];

export type GoogleLoginUser = User;
export type GoogleLoginError = {
  errorCode: GoogleSignInErrorValue;
  title: string;
  message: string;
  nativeError: any;
};

const GoogleSignInErrorTitleAndMessage = {
  [GoogleSignInError.SIGN_IN_CANCELLED]: {
    title: "Google Sign-In Cancelled",
    message: "You have cancelled the sign-in process.",
  },
  [GoogleSignInError.IN_PROGRESS]: {
    title: "Google Sign-In In Progress",
    message:
      "The sign-in process with your Google account is currently in progress. Please wait before trying again.",
  },
  [GoogleSignInError.PLAY_SERVICES_NOT_AVAILABLE]: {
    title: "Google Sign-In Unavailable",
    message:
      "Google Play Services are not available. Please ensure they are installed and try again.",
  },
  [GoogleSignInError.SIGN_IN_REQUIRED]: {
    title: "Google Sign-In Required",
    message: "You need to sign in with your Google account to proceed.",
  },
  [GoogleSignInError.OTHER]: {
    title: "Google Sign-In/Sign-Out Error",
    message:
      "An unknown error occurred during the Google sign-in/sign-out process. Please try again later.",
  },
};

class GoogleLogin {
  static #instance: GoogleLogin | null = null;
  static #googleClientId = config.GOOGLE_APP_CLIENT_ID;
  #hasGoogleClientId = !!(
    GoogleLogin.#googleClientId &&
    typeof GoogleLogin.#googleClientId === "string"
  );
  constructor() {
    if (GoogleLogin.#instance === null) {
      GoogleLogin.#instance = this;
      this.#configureGoogleLogin();
    }
    return GoogleLogin.#instance;
  }

  #configureGoogleLogin() {
    if (this.#hasGoogleClientId) {
      GoogleSignin.configure({
        webClientId: GoogleLogin.#googleClientId,
        offlineAccess: true,
        scopes: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      });
    }
  }

  get isGoogleLoginEnabled() {
    return this.#hasGoogleClientId;
  }

  async login(options: {
    onError: (errOptions: GoogleLoginError) => void;
    onSuccess: (user: GoogleLoginUser) => void;
  }) {
    if (!this.#hasGoogleClientId) {
      throw new Error(
        "GOOGLE_APP_CLIENT_ID needs to be string but found undefined."
      );
    }
    const { onError, onSuccess } = options;
    try {
      await GoogleSignin.hasPlayServices();
      const hasUserLoggedIn = await GoogleSignin.hasPlayServices();
      if (hasUserLoggedIn) {
        await GoogleSignin.signOut();
      }
      const userInfo = await GoogleSignin.signIn();
      onSuccess(userInfo);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            onError({
              errorCode: GoogleSignInError.SIGN_IN_CANCELLED,
              nativeError: error,
              ...GoogleSignInErrorTitleAndMessage[
                GoogleSignInError.SIGN_IN_CANCELLED
              ],
            });
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            onError({
              errorCode: GoogleSignInError.IN_PROGRESS,
              nativeError: error,
              ...GoogleSignInErrorTitleAndMessage[
                GoogleSignInError.IN_PROGRESS
              ],
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            onError({
              errorCode: GoogleSignInError.PLAY_SERVICES_NOT_AVAILABLE,
              nativeError: error,
              ...GoogleSignInErrorTitleAndMessage[
                GoogleSignInError.PLAY_SERVICES_NOT_AVAILABLE
              ],
            });
            break;
          default:
            // some other error happened
            onError({
              errorCode: GoogleSignInError.OTHER,
              nativeError: error,
              ...GoogleSignInErrorTitleAndMessage[GoogleSignInError.OTHER],
            });
        }
      } else {
        onError({
          errorCode: GoogleSignInError.OTHER,
          nativeError: error,
          ...GoogleSignInErrorTitleAndMessage[GoogleSignInError.OTHER],
        });
      }
    }
  }

  async logout(options?: {
    onError?: (errOptions: GoogleLoginError) => void;
    onSuccess?: (isLogout: boolean) => void;
  }) {
    if (!this.#hasGoogleClientId) {
      throw new Error(
        "GOOGLE_APP_CLIENT_ID needs to be string but found undefined."
      );
    }
    const { onError, onSuccess } = options || {};
    try {
      await GoogleSignin.signOut();
      if (typeof onSuccess === "function") {
        onSuccess(true);
      }
    } catch (error) {
      if (typeof onError === "function") {
        onError({
          errorCode: GoogleSignInError.OTHER,
          nativeError: error,
          ...GoogleSignInErrorTitleAndMessage[GoogleSignInError.OTHER],
        });
      }
    }
  }
}

const googleLoginObject = new GoogleLogin();
Object.freeze(googleLoginObject);
export const googleLogin = googleLoginObject;
