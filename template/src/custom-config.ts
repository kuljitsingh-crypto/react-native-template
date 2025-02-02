import {storableError} from './errorHelper';
const enablePushNotifications = process.env.ENABLE_PUSH_NOTIFICATION;
const isPushNotificationEnabled = enablePushNotifications === 'true';
const isRemotePushNotificationEnabled =
  process.env.ENABLE_REMOTE_PUSH_NOTIFICATION === 'true';

///=============================== For  Paypal =====================================//
const PAYPAL_PAYMENT_APPROVE_URL_OPENER = {
  insideApp: 'insideApp',
  // For "inside app" paypal approve url open in web view inside the application.

  outsideApp: 'outsideApp',
  // For "outside app" paypal approve url open in default browser using React Native Linking:https://reactnative.dev/docs/linking.
  // For this you need to create custom return  and cancel url (which is generally universal link) and
  // Also handle deep linking, if you use App as return  and cancel url.
  // To handle deep linking you just need to add your logic in "processDeepLinkByPathName" function of "deepLinkSlice.ts"
} as const;

// It is used in web view when "inside-app" is used for "PAYPAL_PAYMENT_APPROVE_URL_OPENER"
// You can use your own website url, if you have own ui for this
const paypalPaymentApproveRedirectUrl = 'https://example.com/returnUrl';
const paypalPaymentCancelRedirectUrl = 'https://example.com/cancelUrl';

//=========================================================================================//

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
  paypalPaymentApproveUrlOpener: PAYPAL_PAYMENT_APPROVE_URL_OPENER,
  paypalPaymentApproveRedirectUrl,
  paypalPaymentCancelRedirectUrl,
};

export type FetchStatusValues =
  (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];
export type ErrorType = null | undefined | ReturnType<typeof storableError>;

export type DeepLinkOrigin =
  (typeof deepLinkOriginType)[keyof typeof deepLinkOriginType];

export type ObjectValues<T extends object> = T[keyof T];
export type ObjectKeys<T extends object> = keyof T;
export type PaypalPaymentType = keyof typeof PAYPAL_PAYMENT_APPROVE_URL_OPENER;
