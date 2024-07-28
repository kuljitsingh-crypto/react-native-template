import Home from "./Home/Home";
import Splash from "./Splash/Splash";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import { ScreenConfiguration, screenNames } from "./screenNames";

type ScreenConfigurations = {
  [K in keyof typeof screenNames]: ScreenConfiguration<(typeof screenNames)[K]>;
}[keyof typeof screenNames];

export const screenConfigurations = (): ScreenConfigurations[] => {
  return [
    {
      name: screenNames.splash,
      component: Splash,
      isSplashScreen: true,
    },
    {
      name: screenNames.home,
      component: Home,
    },
    {
      name: screenNames.profile,
      component: Profile,
      auth: true,
    },

    {
      name: screenNames.login,
      component: Login,
    },
  ];
};
