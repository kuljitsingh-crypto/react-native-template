import { storableError } from "./utill";
export const FETCH_STATUS = {
  idle: "idle",
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
} as const;

export const deepLinkOriginType = {
  initiateUrl: "initiateUrl",
  eventListener: "eventListener",
  none: "none",
} as const;

export type FetchStatusValues =
  (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
export type ErrorType = null | undefined | ReturnType<typeof storableError>;

export type DeepLinkOrigin =
  (typeof deepLinkOriginType)[keyof typeof deepLinkOriginType];
