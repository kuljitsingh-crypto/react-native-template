import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  NativePushNotification,
  PushNotification,
  PushNotificationEventDetail,
  PushNotificationEventNames,
  useIntl,
} from '../hooks';
import {config} from '../custom-config';
import {RemoteMessage} from '../utill';

const enablePushNotificationEvents = config.isPushNotificationEnabled;
type ProviderProps = PropsWithChildren;
const PushNotificationProvider = (props: ProviderProps) => {
  const {children} = props;
  const intl = useIntl();

  const sampleLocalEventObserverCb = (
    eventdetails: PushNotificationEventDetail,
    eventName: PushNotificationEventNames,
  ) => {
    console.log('event Name:', eventName, 'event details:', eventdetails);
  };
  // Add/Remove  your own custom observer callback as per your needs.
  const localEventObservers = {
    UNKNOWN: [sampleLocalEventObserverCb],
    DISMISSED: [sampleLocalEventObserverCb],
    PRESS: [sampleLocalEventObserverCb],
    ACTION_PRESS: [sampleLocalEventObserverCb],
    DELIVERED: [sampleLocalEventObserverCb],
    APP_BLOCKED: [sampleLocalEventObserverCb],
    CHANNEL_BLOCKED: [sampleLocalEventObserverCb],
    CHANNEL_GROUP_BLOCKED: [sampleLocalEventObserverCb],
    TRIGGER_NOTIFICATION_CREATED: [sampleLocalEventObserverCb],
  };

  const remoteEventObsevers = (message: RemoteMessage) => {
    // Write your own logic for remote foreground event here
    console.log(message);
  };

  useEffect(() => {
    if (enablePushNotificationEvents) {
      NativePushNotification.backgroundRestriction.check(intl);
      NativePushNotification.eventHandler.foreground({
        localEventObservers: localEventObservers,
        remoteEventObservers: remoteEventObsevers,
      });
      return () => {
        NativePushNotification.unsuscribeForegroundEvent();
      };
    }
  }, [enablePushNotificationEvents]);
  return <View style={styles.container}>{children}</View>;
};

export default PushNotificationProvider;

const styles = StyleSheet.create({
  container: {flex: 1, flexGrow: 1, flexDirection: 'column'},
});
