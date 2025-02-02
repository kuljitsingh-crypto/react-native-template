import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AuthenticatedChildren} from '../components';
import {config} from '../custom-config';
import {
  ScreenConfiguration,
  ScreenParamList,
  ScreenRouteType,
  ScreenValue,
  screenNames,
  screenValuesSet,
} from './screenNames';
import {AppDispatchType} from '../../store';
import {updateShouldRedirectAfterDeepLinkStatus} from '../globalReducers/deepLinkSlice';
import {useDeepLinkStatus} from '../deepLink';

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
  },
) => {
  const {
    isSplashScreen,
    splashRedirectOption,
    navigationProps,
    dispatch,
    name,
    loadData,
  } = screen;
  const {params, name: path = DEFAULT_REDIRECT_PATH} =
    splashRedirectOption || {};
  const {
    deepLinkStatus,
    shouldRedirectAfterDeepLink,
    redirectPath,
    redirectPathParams,
  } = useDeepLinkStatus();
  const {
    navigation,
    route: {params: pathParams},
  } = navigationProps;
  const shouldLoadData = typeof loadData === 'function';

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
    if (deepLinkStatus === config.fetchStatus.succeeded) {
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
  dispatch: AppDispatchType,
) => {
  const {name, resetData} = screen;
  const shouldCallReset = typeof resetData === 'function';
  useEffect(() => {
    return () => {
      if (shouldCallReset) {
        dispatch(resetData());
      }
    };
  }, []);
};

const useConditionalRedirect = <TName extends ScreenValue>(
  screen: ScreenConfiguration<TName>,
  navigation: ScreenProps<TName>['navigation'],
) => {
  const selector = useSelector;
  const {name, conditionalRedirect} = screen;
  const shouldCallRedirect = typeof conditionalRedirect === 'function';
  const {redirectCondition, redirectOptions} = shouldCallRedirect
    ? conditionalRedirect(selector, name)
    : {redirectCondition: false, redirectOptions: null};

  useEffect(() => {
    if (
      redirectCondition &&
      redirectOptions !== null &&
      redirectOptions.pathName
    ) {
      if (redirectOptions.isReplace) {
        navigation.replace(
          redirectOptions.pathName,
          redirectOptions.pathParams as any,
        );
      } else {
        navigation.navigate(
          redirectOptions.pathName,
          redirectOptions.pathParams as any,
        );
      }
    }
  }, [redirectCondition, navigation]);
};

export function screenHoc<
  TName extends ScreenValue,
  TSplashRedirect extends ScreenValue = ScreenValue,
  TRedirect extends ScreenValue = ScreenValue,
>(
  screenConfigurations: ScreenConfiguration<TName, TSplashRedirect, TRedirect>,
  dispatch: AppDispatchType,
) {
  const {name} = screenConfigurations;
  return function InnerApp(props: ScreenProps<typeof name>) {
    const {
      component: Comp,
      auth,
      unAuthRedirectOption,
      redirectOnUnauthorized,
    } = screenConfigurations;
    const navigationProps = props;

    useRedirect<typeof name>({
      ...screenConfigurations,
      navigationProps,
      dispatch,
    });

    useResetReduxState(screenConfigurations, dispatch);
    useConditionalRedirect(screenConfigurations, navigationProps.navigation);
    return auth ? (
      <AuthenticatedChildren
        redirectOnUnauthorized={!!redirectOnUnauthorized}
        redirectOptions={unAuthRedirectOption}>
        <Comp {...navigationProps} />
      </AuthenticatedChildren>
    ) : (
      <Comp {...navigationProps} />
    );
  };
}
