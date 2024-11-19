/**
 * @format
 */
import 'core-js/actual/url';
import 'core-js/actual/url-search-params';
import './src/i18n/i18n.config';
import {config} from './src/custom-config';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NativePushNotification, PushNotificationEventName} from './src/hooks';

//==================== Initialize Configuration =================

//============================================

const registerPushNotificationBackgroundEventHandler = enableEventHandler => {
  if (enableEventHandler) {
    const sampleLocalEventObserverCb = (eventdetails, eventName) => {
      console.log(
        'Background event details:',
        eventdetails,
        'eventName:',
        eventName,
        eventName === PushNotificationEventName.PRESS,
      );
    };
    // Add/Remove  your own custom observer callback as per your needs.
    const localEventObervers = {
      UNKNOWN: [sampleLocalEventObserverCb],
      DISMISSED: [sampleLocalEventObserverCb],
      PRESS: [sampleLocalEventObserverCb],
      ACTION_PRESS: [sampleLocalEventObserverCb],
      DELIVERED: [sampleLocalEventObserverCb],
      APP_BLOCKED: [sampleLocalEventObserverCb],
      CHANNEL_BLOCKED: [sampleLocalEventObserverCb],
      CHANNEL_GROUP_BLOCKED: [sampleLocalEventObserverCb],
      TRIGGER_NOTIFICATION_CREATED: [sampleLocalEventObserverCb],
      FG_ALREADY_EXIST: [sampleLocalEventObserverCb],
    };
    const remoteEventObsevers = message => {
      // Write your own logic for remote background event here
      // console.log(message)
    };
    NativePushNotification.eventHandler.background({
      localEventObservers: localEventObervers,
      remoteEventObservers: remoteEventObsevers,
    });
  }
};

registerPushNotificationBackgroundEventHandler(
  config.isPushNotificationEnabled,
);
AppRegistry.registerComponent(appName, () => App);
