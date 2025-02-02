import Home from './Home/Home';
import Splash from './Splash/Splash';
import Profile from './Profile/Profile';
import Login from './Login/Login';
import {loadData as splashLoadData} from './Splash/splashSlice';
import {resetHomeState} from './Home/homeSlice';
import {redirectOnLogoutSuccess} from './Profile/profileSlice';

import {
  ConditionalRedirectApi,
  ScreenConfiguration,
  ScreenDataLoadingApi,
  screenNames,
  ScreenStateResetApi,
} from './screenNames';

type ScreenConfigurations = {
  [K in keyof typeof screenNames]: ScreenConfiguration<(typeof screenNames)[K]>;
}[keyof typeof screenNames];

//======================= Screen Api===========================//
const screenDataLoadingApi: ScreenDataLoadingApi = {
  [screenNames.splash]: splashLoadData,
} as ScreenDataLoadingApi;

const screenStateResetApi: ScreenStateResetApi = {
  [screenNames.home]: resetHomeState,
} as ScreenStateResetApi;

const conditionalRedirectApi = {
  [screenNames.profile]: redirectOnLogoutSuccess,
} as unknown as ConditionalRedirectApi;

//======================= Screen Api===========================//

export const screenConfigurations = (): ScreenConfigurations[] => {
  return [
    {
      name: screenNames.splash,
      component: Splash,
      isSplashScreen: true,
      options: {headerShown: false},
      loadData: screenDataLoadingApi.splash,
    },
    {
      name: screenNames.home,
      component: Home,
      resetData: screenStateResetApi.home,
    },
    {
      name: screenNames.profile,
      component: Profile,
      auth: true,
      conditionalRedirect: conditionalRedirectApi.profile,
    },

    {
      name: screenNames.login,
      component: Login,
    },
  ];
};
