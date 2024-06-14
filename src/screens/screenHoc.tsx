import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthenticatedChildren } from "../components";
import { useEffect } from "react";
import { useDeepLinkStatus } from "../hooks";
import { FETCH_STATUS } from "../custom-config";
import {
  ScreenConfiguration,
  ScreenParamList,
  ScreenValue,
  screenNames,
  screenValuesSet,
} from "./ScreenTypes";
import { AppDispatchType } from "../../store";
import { updateShouldRedirectAfterDeepLinkStatus } from "../globalReducers/deepLinkSlice";
import {
  ScreenLoadDataKey,
  screenDataLoadingApi,
} from "./screenApi/dataLoadingApi";
import { ResetReduxStatekey, resetReduxState } from "./screenApi/dateResetApi";

const DEFAULT_REDIRECT_PATH = screenNames.home;
const DEFAULT_SPLASH_TIMEOUT = 3000;
type ScreenProps<TName extends ScreenValue> = NativeStackScreenProps<
  ScreenParamList,
  TName
>;

const useRedirect = <TName extends ScreenValue>(
  screen: ScreenConfiguration<TName> & {
    navigationProps: ScreenProps<TName>;
    dispatch: AppDispatchType;
    splashRedirectOption?: {
      path: any;
      params?: any;
    };
  }
) => {
  const {
    isSplashScreen,
    splashRedirectOption,
    navigationProps,
    dispatch,
    name,
  } = screen;
  const { params, path = DEFAULT_REDIRECT_PATH } = splashRedirectOption || {};
  const {
    deepLinkStatus,
    shouldRedirectAfterDeepLink,
    redirectPath,
    redirectPathParams,
  } = useDeepLinkStatus();
  const {
    navigation,
    route: { params: pathParams },
  } = navigationProps;
  const routeName = name as ScreenLoadDataKey;
  const loadData = (screenDataLoadingApi || {})[routeName];
  const shouldLoadData = typeof loadData === "function";

  const redirectCb = () => {
    dispatch(updateShouldRedirectAfterDeepLinkStatus(false));
    if (shouldRedirectAfterDeepLink) {
      if (!screenValuesSet.has(redirectPath)) return;
      if (isSplashScreen) {
        navigation.replace(redirectPath as any, redirectPathParams);
      } else {
        navigation.navigate(redirectPath as any, redirectPathParams);
      }
    } else if (isSplashScreen) {
      if (!screenValuesSet.has(redirectPath)) return;
      navigation.replace(path as any, params);
    }
  };

  useEffect(() => {
    if (deepLinkStatus === FETCH_STATUS.succeeded) {
      if (shouldLoadData) {
        dispatch(loadData(pathParams))
          .then(() => redirectCb())
          .catch(() => redirectCb());
      } else {
        if (isSplashScreen) {
          setTimeout(redirectCb, DEFAULT_SPLASH_TIMEOUT);
        } else {
          redirectCb();
        }
      }
    }
  }, [deepLinkStatus]);

  useEffect(() => {
    if (shouldRedirectAfterDeepLink) {
      redirectCb();
    }
  }, [shouldRedirectAfterDeepLink]);
};

const useResetReduxState = <TName extends ScreenValue>(
  screen: ScreenConfiguration<TName>,
  dispatch: AppDispatchType
) => {
  const { name } = screen;
  const routeName = name as ResetReduxStatekey;
  const resetState = (resetReduxState || {})[routeName];
  const shouldCallReset = typeof resetState === "function";
  useEffect(() => {
    return () => {
      if (shouldCallReset) {
        dispatch(resetState());
      }
    };
  }, []);
};

export function screenHoc<
  TName extends ScreenValue,
  TSplashRedirect extends ScreenValue = ScreenValue,
  TRedirect extends ScreenValue = ScreenValue
>(
  screenConfigurations: ScreenConfiguration<TName, TSplashRedirect, TRedirect>,
  dispatch: AppDispatchType
) {
  const { name } = screenConfigurations;
  return function InnerApp(props: ScreenProps<typeof name>) {
    const {
      component: Comp,
      auth,
      unAuthRedirectOption,
      redirectOnUnauthorized,
    } = screenConfigurations;
    const navigationProps = props;
    const { path, params } = unAuthRedirectOption || {};

    useRedirect<typeof name>({
      ...screenConfigurations,
      navigationProps,
      dispatch,
    });

    useResetReduxState(screenConfigurations, dispatch);

    return auth ? (
      <AuthenticatedChildren
        redirectOnUnauthorized={!!redirectOnUnauthorized}
        redirectTo={path || screenNames.login}>
        <Comp {...navigationProps} />
      </AuthenticatedChildren>
    ) : (
      <Comp {...navigationProps} />
    );
  };
}
