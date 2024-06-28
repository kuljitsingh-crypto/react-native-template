import { useEffect } from "react";
import { Linking } from "react-native";
import { AppDispatchType, AppSelectorType } from "../store";
import {
  DeepLinkOrigin,
  FETCH_STATUS,
  FetchStatusValues,
  deepLinkOriginType,
} from "./custom-config";
import { useConnect } from "./hooks";
import {
  processDeepLink,
  selectDeepLinkStatus,
  selectRedirectPath,
  selectRedirectPathParams,
  selectShouldRedirectAfterDeepLink,
  updateDeepLinkStatus,
} from "./globalReducers/deepLinkSlice";

const mapStateToProps = (selector: AppSelectorType) => {
  return {
    deepLinkStatus: selector(selectDeepLinkStatus),
    redirectPath: selector(selectRedirectPath),
    redirectPathParams: selector(selectRedirectPathParams),
    shouldRedirectAfterDeepLink: selector(selectShouldRedirectAfterDeepLink),
  };
};

const mapDispatchToProps = (dispatch: AppDispatchType) => ({
  onUpdateDeepLinkStatus: (status: FetchStatusValues) =>
    dispatch(updateDeepLinkStatus(status)),
  onProcessDeepLink: (params: { url: string | null; origin: DeepLinkOrigin }) =>
    dispatch(processDeepLink(params)),
});

export function useDeepLink() {
  const { onProcessDeepLink, onUpdateDeepLinkStatus } = useConnect(
    null,
    mapDispatchToProps
  );

  const onChange = (url: string | null, type: DeepLinkOrigin) => {
    return onProcessDeepLink({ url, origin: type });
  };

  useEffect(() => {
    onUpdateDeepLinkStatus(FETCH_STATUS.loading);
    const subscription = Linking.addEventListener("url", ({ url }) => {
      onChange(url, deepLinkOriginType.eventListener);
    });
    Linking.getInitialURL()
      .then((url) => {
        onChange(url, deepLinkOriginType.initiateUrl);
      })
      .catch(() => {
        onUpdateDeepLinkStatus(FETCH_STATUS.succeeded);
      });
    return () => subscription.remove();
  }, []);
}

export const useDeepLinkStatus = () => {
  const {
    deepLinkStatus,
    redirectPath,
    redirectPathParams,
    shouldRedirectAfterDeepLink,
  } = useConnect(mapStateToProps, null);
  return {
    deepLinkStatus,
    redirectPath,
    redirectPathParams,
    shouldRedirectAfterDeepLink,
  };
};
