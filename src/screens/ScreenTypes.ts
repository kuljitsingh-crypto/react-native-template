import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const screenNames = {
  splash: "splash",
  home: "home",
  profile: "profile",
  login: "login",
} as const;

export const screenValuesSet = new Set(Object.values(screenNames));

export type ScreenValue = (typeof screenNames)[keyof typeof screenNames];

export type ScreenParamList = {
  [screenNames.splash]: undefined;
  [screenNames.home]: undefined;
  [screenNames.profile]: undefined;
  [screenNames.login]: undefined;
};

export type ScreenParamType = ScreenParamList[keyof ScreenParamList];

export type ScreenConfiguration<
  TName extends ScreenValue,
  TSplashRedirect extends ScreenValue = ScreenValue,
  TRedirect extends ScreenValue = ScreenValue
> = {
  name: TName;
  component: (props: any) => React.JSX.Element;
  options?: NativeStackNavigationOptions;
  auth?: boolean;
  redirectOnUnauthorized?: boolean;
  unAuthRedirectOption?: {
    path: TRedirect;
    params?: ScreenParamList[TRedirect];
  };
  isSplashScreen?: boolean;
  splashRedirectOption?: {
    path: TSplashRedirect;
    params?: ScreenParamList[TSplashRedirect];
  };
};
