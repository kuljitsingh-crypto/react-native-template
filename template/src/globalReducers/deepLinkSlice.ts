import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  DeepLinkOrigin,
  FETCH_STATUS,
  FetchStatusValues,
  deepLinkOriginType,
} from "../custom-config";
import { AppDispatchType, RootStateType } from "../../store";
import { createCustomAsyncThunk, parse, pathname } from "../utill";
import {
  ScreenParamType,
  ScreenValue,
  screenNames,
} from "../screens/screenNames";

const PROCESS_DEEP_LINK = "app/PROCESS_DEEP_LINK";

type DeepLinkStateType = {
  deepLinkStatus: FetchStatusValues;
  redirectPath: ScreenValue;
  redirectPathParams: ScreenParamType;
  shouldRedirect: boolean;
  deepLinkOriginType: DeepLinkOrigin;
};

type GetStateType = () => RootStateType;
const initialState: DeepLinkStateType = {
  deepLinkStatus: FETCH_STATUS.idle,
  redirectPath: screenNames.home,
  redirectPathParams: undefined,
  deepLinkOriginType: deepLinkOriginType.none,
  shouldRedirect: false,
};

const deepLinkSlice = createSlice({
  name: "deeplink",
  initialState,
  reducers: {
    updateDeepLinkStatus: (state, action) => {
      state.deepLinkStatus = action.payload;
    },
    updateRedirectPath: (
      state,
      action: PayloadAction<{
        path: ScreenValue;
        origin: DeepLinkOrigin;
        params?: ScreenParamType;
        shouldRedirect?: boolean;
      }>
    ) => {
      state.redirectPath = action.payload.path;
      state.redirectPathParams = action.payload.params;
      state.deepLinkOriginType = action.payload.origin;
      state.shouldRedirect = !!action.payload.shouldRedirect;
    },
    updateShouldRedirectAfterDeepLinkStatus: (state, action) => {
      state.shouldRedirect = !!action.payload.shouldRedirect;
    },
  },
});

export const {
  updateDeepLinkStatus,
  updateShouldRedirectAfterDeepLinkStatus,
  updateRedirectPath,
} = deepLinkSlice.actions;

export default deepLinkSlice.reducer;

export const selectDeepLinkStatus = (state: RootStateType) =>
  state.deepLink.deepLinkStatus;
export const selectRedirectPath = (state: RootStateType) =>
  state.deepLink.redirectPath;
export const selectRedirectPathParams = (state: RootStateType) =>
  state.deepLink.redirectPathParams;
export const selectShouldRedirectAfterDeepLink = (state: RootStateType) =>
  state.deepLink.shouldRedirect;

const updateProcessStatusAndRedirectPath = (
  dispatch: AppDispatchType,
  options: {
    path: ScreenValue;
    origin: DeepLinkOrigin;
    params?: ScreenParamType;
    shouldRedirect?: boolean;
  }
) => {
  const { path, params, origin, shouldRedirect } = options;
  dispatch(updateRedirectPath({ path, params, origin, shouldRedirect }));
  dispatch(updateDeepLinkStatus(FETCH_STATUS.succeeded));
};

const processDeepLinkByPathName = (
  params: { url: string; origin: DeepLinkOrigin },
  dispatch: AppDispatchType,
  getState: GetStateType
) => {
  const { url, origin } = params;
  const pathName = pathname(url);
  const queryParams = parse(url);
  switch (pathName) {
    default: {
      updateProcessStatusAndRedirectPath(dispatch, {
        path: screenNames.home,
        origin: deepLinkOriginType.none,
        shouldRedirect: false,
      });
    }
  }
};

export const processDeepLink = createCustomAsyncThunk(
  PROCESS_DEEP_LINK,
  async (
    params: { url: string | null; origin: DeepLinkOrigin },
    { dispatch, getState }
  ) => {
    const { url, origin } = params;
    if (url === null) {
      updateProcessStatusAndRedirectPath(dispatch, {
        path: screenNames.home,
        origin: deepLinkOriginType.none,
        shouldRedirect: false,
      });
      return;
    }
    processDeepLinkByPathName({ url, origin }, dispatch, getState);
  }
);
