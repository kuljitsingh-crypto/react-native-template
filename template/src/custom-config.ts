import {storableError} from './errorHelper';
const enablePushNotifications = process.env.ENABLE_PUSH_NOTIFICATION;
const isPushNotificationEnabled = enablePushNotifications === 'true';
const isRemotePushNotificationEnabled =
  process.env.ENABLE_REMOTE_PUSH_NOTIFICATION === 'true';

const FETCH_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

const deepLinkOriginType = {
  initiateUrl: 'initiateUrl',
  eventListener: 'eventListener',
  none: 'none',
} as const;

export const config = {
  isPushNotificationEnabled,
  isRemotePushNotificationEnabled,
  deepLinkOriginType,
  fetchStatus: FETCH_STATUS,
};

export type FetchStatusValues =
  (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
export type ErrorType = null | undefined | ReturnType<typeof storableError>;

export type DeepLinkOrigin =
  (typeof deepLinkOriginType)[keyof typeof deepLinkOriginType];

export type ObjectValues<T extends object> = T[keyof T];
export type ObjectKeys<T extends object> = keyof T;
