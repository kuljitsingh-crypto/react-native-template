import { AppSelectorType } from "../../../store";
import { redirectOnLogoutSuccess } from "../Profile/profileSlice";
import { ScreenParamList, ScreenValue, screenNames } from "../screenTypes";

export const conditionalRedirectApi: {
  [name: string]: (
    selector: AppSelectorType,
    routeName?: ScreenValue
  ) => {
    redirectCondition: boolean;
    redirectOptions: {
      pathName: ScreenValue;
      pathParams?: ScreenParamList;
      isReplace?: boolean;
    } | null;
  };
} = {
  [screenNames.profile]: redirectOnLogoutSuccess,
};

export type ConditionalRedirect =
  (typeof conditionalRedirectApi)[keyof typeof conditionalRedirectApi];
export type ConditionalRedirectKey = keyof typeof conditionalRedirectApi;
