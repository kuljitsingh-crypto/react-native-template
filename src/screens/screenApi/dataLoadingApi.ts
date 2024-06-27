import { screenNames } from "../screenNames";
import { loadData as splashLoadData } from "../Splash/splashSlice";

export const screenDataLoadingApi = {
  [screenNames.splash]: splashLoadData,
};

export type ScreenLoadData =
  (typeof screenDataLoadingApi)[keyof typeof screenDataLoadingApi];
export type ScreenLoadDataKey = keyof typeof screenDataLoadingApi;
