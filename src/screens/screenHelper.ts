import Home from './Home/Home';
import Splash from './Splash/Splash';
import Profile from './Profile/Profile';
import Login from './Login/Login';
import {ScreenConfiguration, screenNames} from './ScreenTypes';

type ScreenConfigurations =
  | ScreenConfiguration<'splash'>
  | ScreenConfiguration<'home'>
  | ScreenConfiguration<'profile'>
  | ScreenConfiguration<'login'>;

export const screenConfigurations = (): ScreenConfigurations[] => {
  return [
    {
      name: screenNames.splash,
      component: Splash,
      options: {headerShown: false},
      isSplashScreen: true,
    },
    {
      name: screenNames.home,
      component: Home,
      options: {headerShown: false},
    },
    {
      name: screenNames.profile,
      component: Profile,
      auth: true,
    },

    {
      name: screenNames.login,
      component: Login,
      options: {headerShown: false},
    },
  ];
};
