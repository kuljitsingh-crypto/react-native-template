import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const screenNames = {
  splash: "splash",
  home: "home",
  profile: "profile",
  login: "login",
} as const;

// add params for specific screen or leave blank object
type SpecificScreenParamList = {
  [screenNames.profile]: { username: string };
};

type BaseScreenParamList = Record<
  (typeof screenNames)[keyof typeof screenNames],
  undefined
>;

export type ScreenParamList = Omit<
  BaseScreenParamList,
  keyof SpecificScreenParamList
> &
  SpecificScreenParamList;

export type ScreenParamKey = keyof ScreenParamList;

export const screenValuesSet = new Set(Object.values(screenNames));

export type ScreenValue = (typeof screenNames)[keyof typeof screenNames];

export type ScreenParamType = ScreenParamList[ScreenParamKey];

export type ScreenRouteType<Tname extends ScreenParamKey> =
  undefined extends ScreenParamList[Tname]
    ? { name: Tname; params?: ScreenParamList[Tname] }
    : { name: Tname; params: ScreenParamList[Tname] };

type AuthOption<Tname extends ScreenParamKey> = {
  auth?: boolean;
  redirectOnUnauthorized?: boolean;
  unAuthRedirectOption?: ScreenRouteType<Tname>;
};

type SplashOption<Tname extends ScreenParamKey> = {
  isSplashScreen?: boolean;
  splashRedirectOption?: ScreenRouteType<Tname>;
};

export type ScreenConfiguration<
  TName extends ScreenValue,
  TSplashRedirect extends ScreenParamKey = ScreenParamKey,
  TAuthRedirect extends ScreenParamKey = ScreenParamKey
> = {
  name: TName;
  component: (props: any) => React.JSX.Element;
  options?: NativeStackNavigationOptions;
} & AuthOption<TAuthRedirect> &
  SplashOption<TSplashRedirect>;
