import { AppSelectorType } from "../../../store";
import { redirectOnLogoutSuccess } from "../Profile/profileSlice";
import { ScreenParamList, ScreenValue, screenNames } from "../screenNames";

type ConditionalRedirectFunc = (
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

export const conditionalRedirectApi: {
  [name: string]: ConditionalRedirectFunc;
} = {
  [screenNames.profile]: redirectOnLogoutSuccess,
};

export type ConditionalRedirect =
  (typeof conditionalRedirectApi)[keyof typeof conditionalRedirectApi];
export type ConditionalRedirectKey = keyof typeof conditionalRedirectApi;
