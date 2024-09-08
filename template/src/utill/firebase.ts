import cloudMessaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {config} from '../custom-config';

export type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;
export type RemoteMessageHandler = (
  message: RemoteMessage,
) => any | Promise<any>;

console.log(config);

const firebaseMessaging = config.isRemotePushNotificationEnabled
  ? cloudMessaging()
  : null;

const registerDeviceForRemoteMessages = async () => {
  if (
    firebaseMessaging &&
    !firebaseMessaging.isDeviceRegisteredForRemoteMessages &&
    config.isRemotePushNotificationEnabled
  ) {
    await firebaseMessaging.registerDeviceForRemoteMessages();
  }
};

const getFCMToken = async () => {
  if (!config.isRemotePushNotificationEnabled || !firebaseMessaging) {
    return {token: null, isSucess: true};
  }
  try {
    await registerDeviceForRemoteMessages();
    const token = await firebaseMessaging.getToken();
    return {token, isSucess: true};
  } catch (err) {
    return {token: null, isSucess: false};
  }
};

const onForegroundMessageReceived = (messageHandeler: RemoteMessageHandler) => {
  if (!config.isRemotePushNotificationEnabled) {
    return () => {};
  }
  return firebaseMessaging?.onMessage(messageHandeler);
};

const onBackgroundMessageReceived = (messageHandeler: RemoteMessageHandler) => {
  if (!config.isRemotePushNotificationEnabled) {
    return () => {};
  }
  return firebaseMessaging?.setBackgroundMessageHandler(messageHandeler);
};

export class Firebase {
  static cloudMessaging = Object.freeze({
    getFCMToken,
    foregroundMessageHandler: onForegroundMessageReceived,
    backgroundMessageHandler: onBackgroundMessageReceived,
  });
}
