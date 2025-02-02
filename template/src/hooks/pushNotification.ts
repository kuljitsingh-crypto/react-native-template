import notifee, {
  AndroidBadgeIconType,
  AndroidChannel,
  AndroidChannelGroup,
  AndroidImportance,
  AndroidNotificationSettings,
  AndroidStyle,
  AndroidVisibility,
  AuthorizationStatus,
  EventDetail,
  EventType,
  IntervalTrigger,
  IOSNotificationCategory,
  IOSNotificationSettings,
  Notification,
  NotificationAndroid,
  NotificationSettings,
  RepeatFrequency,
  TimestampTrigger,
} from '@notifee/react-native';
import {
  deviceInfo,
  Firebase,
  NativeAlert,
  RemoteMessageHandler,
} from '../utill';
import {PermissionsAndroid} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {IntlShape} from './translation';

export const NotificationEventType = EventType;
export type PushNotificationEventType = EventType;
export type PushNotificationEventDetail = EventDetail;
export type PushNotificationEventNames = keyof typeof NotificationEventType;
export type PushNotification = Notification;

type PushNotificationEventTypeKeys = keyof typeof EventType;

export const PushNotificationEventName: {
  [key in PushNotificationEventTypeKeys]: PushNotificationEventTypeKeys;
} = {
  PRESS: 'PRESS',
  UNKNOWN: 'UNKNOWN',
  ACTION_PRESS: 'ACTION_PRESS',
  APP_BLOCKED: 'APP_BLOCKED',
  CHANNEL_BLOCKED: 'CHANNEL_BLOCKED',
  CHANNEL_GROUP_BLOCKED: 'CHANNEL_GROUP_BLOCKED',
  DELIVERED: 'DELIVERED',
  DISMISSED: 'DISMISSED',
  FG_ALREADY_EXIST: 'FG_ALREADY_EXIST',
  TRIGGER_NOTIFICATION_CREATED: 'TRIGGER_NOTIFICATION_CREATED',
};

/**
 * The frequency at which the trigger repeats. If unset, the notification will only be displayed once.
 *
 * For example: if set to "HOURLY", the notification will repeat every hour from the
 * timestamp specified. if set to "DAILY", the notification will repeat every day
 * from the timestamp specified. if set to "WEEKLY", the notification will repeat
 * every week from the timestamp specified.
 *
 * IOS Limitation:
 * "HOURLY": the starting date and hour will be ignored, and only the minutes and seconds will
 * be taken into the account. If the timestamp is set to trigger in 3 hours and repeat every
 * 5th minute of the hour, the alert will not fire in 3 hours, but will instead fire immediately
 *  on the next 5th minute of the hour.
 * "DAILY": the starting day will be ignored, and only the time will be taken into account.
 * If it is January 1 at 10 AM and you schedule a daily recurring notification for
 * January 2 at 11 AM, it will fire on January 1 at 11 AM and every day thereafter.
 * "WEEKLY": the starting week will be ignored, and only the day and time will be taken into account.
 *
 * To Avoid this scenario WEEKLY has removed from CustomRepeatFrequency
 */
enum CustomRepeatFrequency {
  DAILY = RepeatFrequency.DAILY,
  HOURLY = RepeatFrequency.HOURLY,
  NONE = RepeatFrequency.NONE,
}

type IosNotificationPermission = IOSNotificationSettings;

type AndroidNotificationPermission = AndroidNotificationSettings;

type NotificationPermission = {
  isPushNotificationAllowed: boolean;
  android?: AndroidNotificationPermission;
  ios?: IosNotificationPermission;
};

type NotificationDisplayParams = {
  androidChannelDetails?: AndroidChannel & {channelId?: string};
  notificationDetails: Omit<PushNotification, 'android'> & {
    android?: Omit<PushNotification['android'], 'channelId'>;
  };
};
type TriggerNotificationParams = NotificationDisplayParams & {
  timestampTrigger?: Omit<TimestampTrigger, 'repeatFrequency'> & {
    repeatFrequency: CustomRepeatFrequency;
  };
  intervalTrigger?: IntervalTrigger;
};

type ModififedPushNotificationEventNames = Exclude<
  PushNotificationEventNames,
  'FG_ALREADY_EXIST'
>;
type NotificationEventHandleParams = {
  [k in ModififedPushNotificationEventNames]?: ((
    eventDetails: PushNotificationEventDetail,
    eventName: PushNotificationEventNames,
  ) => void | Promise<void>)[];
};

/**
 * For details about Default Android Notification,
 * see: https://notifee.app/react-native/reference/notificationandroid
 */
type AndroidProgressIndicatorNotification = Omit<
  NotificationAndroid,
  | 'asForegroundService'
  | 'autoCancel'
  | 'colorized'
  | 'defaults'
  | 'fullScreenAction'
  | 'showTimestamp'
  | 'timeoutAfter'
  | 'timestamp'
  | 'channelId'
>;

/**
 * For details about Default Android Notification,
 * see: https://notifee.app/react-native/reference/notificationandroid
 */
type AndroidForegroundServiceNotification = Omit<
  NotificationAndroid,
  'autoCancel' | 'defaults' | 'fullScreenAction' | 'timeoutAfter' | 'channelId'
>;

type ProgressIndicatorNotificationParams = {
  androidChannelDetails?: AndroidChannel & {channelId?: string};
  notificationDetails: Omit<PushNotification, 'android'> & {
    android?: AndroidProgressIndicatorNotification;
  };
  showNotificationOnlyInAndroid?: boolean;
};

type ForegroundServiceNotificationParams = {
  androidChannelDetails?: AndroidChannel & {channelId?: string};
  notificationDetails: Omit<PushNotification, 'android'> & {
    android?: AndroidForegroundServiceNotification;
  };
  showNotificationOnlyInAndroid?: boolean;
  onServiceUpdate?: (params: {
    notification: PushNotification;
    updateNotification: (notification: PushNotification) => Promise<void>;
  }) => void | Promise<void>;
  eventObservers?: {
    [k in PushNotificationEventNames]?: ((params: {
      eventDetails: PushNotificationEventDetail;
      eventName: PushNotificationEventNames;
      notification: PushNotification;
    }) => void | Promise<void>)[];
  };
};

// ============================================= helper functions =================================

//========================================================= Android ===============================

const androidPermissionStatus = (settings: NotificationSettings) => {
  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    return {...settings.android, isPushNotificationAllowed: true};
  }
  return {isPushNotificationAllowed: false};
};

const checkAndroidChannelPermission = async (channelId: string) => {
  if (deviceInfo.isAndroidPlatform) {
    const channel = await notifee.getChannel(channelId);
    return channel;
  }
  return null;
};

const checkAndroidChannelGroupPermission = async () => {
  if (deviceInfo.isAndroidPlatform) {
    const channelGrps = await notifee.getChannelGroups();
    return channelGrps;
  }
  return [];
};

/**
 * Notifications can be categorized into groups, allowing you to control how the system displays them.
 * In Android platforms this is acheive by Channel And Groups.
 * Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
 * Applications can create one or more notification channels. Each channel can be customised
 * with its own unique visual & auditory behaviour. Once a channel has been created with
 * initial settings, the user then has full control in changing those settings and can
 * also decide how intrusive notifications from your application can be.
 * For more information: https://notifee.app/react-native/reference/androidchannel
 */
const createAndroidNotificationChannel = async (channel: AndroidChannel) => {
  if (deviceInfo.isAndroidPlatform) {
    if (deviceInfo.androidVersion < 26) {
      return null;
    }
    const channelId = await notifee.createChannel(channel);
    return channelId;
  }
  return null;
};

/**
 * Notifications can be categorized into groups, allowing you to control how the system displays them.
 * In Android platforms this is acheive by Channel And Groups.
 * Channel Groups are available if you'd further like to organize the appearance of your
 * channels in the settings UI. Creating channel groups is a good idea when your application
 * has many channels, or for example supports multiple accounts (such as work profiles).
 * Groups allow users to easily identify and control multiple notification channels.
 * For more information: https://notifee.app/react-native/reference/androidchannelgroup
 */
const createAndroidNotificationChannelGroup = async (
  channelGrp: AndroidChannelGroup,
) => {
  if (deviceInfo.isAndroidPlatform) {
    if (deviceInfo.androidVersion < 26) {
      return null;
    }
    const channelGrpId = await notifee.createChannelGroup(channelGrp);
    return channelGrpId;
  }
  return null;
};

const deleteAndroidChannel = async (chnnelId: string) => {
  if (deviceInfo.isAndroidPlatform) {
    if (deviceInfo.androidVersion < 26) {
      return;
    }
    await notifee.deleteChannel(chnnelId);
  }
  return;
};

const deleteAndroidChannelGroup = async (chnnelGrpId: string) => {
  if (deviceInfo.isAndroidPlatform) {
    if (deviceInfo.androidVersion < 26) {
      return;
    }
    await notifee.deleteChannelGroup(chnnelGrpId);
  }
  return;
};

const checkAndroidBackgroundRestriction = async (intl: IntlShape) => {
  if (deviceInfo.isAndroidPlatform) {
    const alertTitle = intl.formatMessage('Android.RestrictedBackground.title');
    const alertDesc = intl.formatMessage('Android.RestrictedBackground.desc');
    const okText = intl.formatMessage(
      'Android.RestrictedBackground.openSetting',
    );
    const cancelText = intl.formatMessage(
      'Android.RestrictedBackground.cancel',
    );
    // 1. get info on the device and the Power Manager settings
    const powerManagerInfo = await notifee.getPowerManagerInfo();
    if (powerManagerInfo.activity) {
      // 2. ask your users to adjust their settings
      NativeAlert.show({
        title: alertTitle,
        desc: alertDesc,
        button: {
          // 3. launch intent to navigate the user to the appropriate screen
          positive: {
            text: okText,
            onPress: async () => await notifee.openPowerManagerSettings(),
          },
          negative: {
            text: cancelText,
            onPress: () => {},
            iosOnly: {style: 'cancel'},
          },
        },
        alertOptions: {
          androidOnly: {cancelable: false},
        },
      });
    } else {
      // 1. checks if battery optimization is enabled
      const batteryOptimizationEnabled =
        await notifee.isBatteryOptimizationEnabled();
      if (batteryOptimizationEnabled) {
        // 2. ask your users to disable the feature
        NativeAlert.show({
          title: alertTitle,
          desc: alertDesc,
          button: {
            // 3. launch intent to navigate the user to the appropriate screen
            positive: {
              text: okText,
              onPress: async () =>
                await notifee.openBatteryOptimizationSettings(),
            },
            negative: {
              text: cancelText,
              onPress: () => console.log('Cancel Pressed'),
              iosOnly: {style: 'cancel'},
            },
          },
          alertOptions: {
            androidOnly: {cancelable: false},
          },
        });
      }
    }
  }
};

const updateAndroidChannelDetailsForNotification = async (params: {
  androidChannelDetails?: AndroidChannel & {channelId?: string};
}): Promise<string | undefined> => {
  let channelId = null;
  if (deviceInfo.isAndroidPlatform) {
    const newChannelDetails = params.androidChannelDetails;
    if (
      typeof newChannelDetails?.channelId === 'string' &&
      newChannelDetails?.channelId
    ) {
      channelId = newChannelDetails.channelId;
    } else {
      const channelDetails = newChannelDetails || {
        id: 'default',
        name: 'Default Channel',
      };
      channelId = await createAndroidNotificationChannel(channelDetails);
    }
  }
  if (channelId === null) {
    channelId = undefined;
  }
  return channelId;
};

// ============================================= IOS =============================================

/**
 * Constants that indicate the importance and delivery timing of a notification.
 */
enum IosInterruptionLevel {
  /**
   * The system presents the notification immediately, lights up the screen, and can play a sound.
   */
  active = 'active',
  /**
   * The system presents the notification immediately, lights up the screen, and bypasses the mute switch to play a sound
   */
  critical = 'critical',

  /**
   * The system adds the notification to the notification list without lighting up the screen or playing a sound.
   */
  passive = 'passive',

  /**
   * The system presents the notification immediately, lights up the screen, can play a sound, and breaks
   * through system notification controls.
   */
  timeSensitive = 'timeSensitive',
}

const iosPermissionStatus = (settings: NotificationSettings) => {
  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    return {...settings.ios, isPushNotificationAllowed: true};
  }
  return {isPushNotificationAllowed: false};
};

/**
 *
 * @param {number} count - It should be number.
 * Pass Positive number to increment count.
 * Negative number to decrement count.
 * @returns
 */
const updateIosNotificationBadgeCount = async (count: number) => {
  if (deviceInfo.isIosPlatform) {
    if (typeof count === 'number' && !!count) {
      const isIncrease = count > 0;
      if (isIncrease) {
        await notifee.incrementBadgeCount(count);
      } else {
        await notifee.decrementBadgeCount(count);
      }
    }
    return notifee.getBadgeCount();
  }
  return 0;
};

const getIosNotificationBadgeCount = async () => {
  if (deviceInfo.isIosPlatform) {
    return notifee.getBadgeCount();
  }
  return 0;
};

const deleteIosNotificationBadgeCount = async () => {
  if (deviceInfo.isIosPlatform) {
    await notifee.setBadgeCount(0);
  }
  return;
};

/**
 * Notifications can be categorized into groups, allowing you to control how the system displays them.
 * In Ios platforms this is acheive by Cateogry.At minimum, a category must be created with a unique identifier
 * using the setNotificationCategories method, one of more categories will be set on the device. All
 * categories must be set at once with this method as it overrides any pre-existing categories on the device.
 * For more information: https://notifee.app/react-native/reference/iosnotificationcategory
 */
const setIosNotificationCategory = async (
  categoryOptions: IOSNotificationCategory[],
) => {
  if (deviceInfo.isIosPlatform) {
    await notifee.setNotificationCategories(categoryOptions);
  }
  return;
};

// ============================================ Both iOS and Android =================================

const checkPushNotificationPermission = async () => {
  const settings = await notifee.getNotificationSettings();
  const permission = {
    isPushNotificationAllowed: false,
  } as NotificationPermission;
  if (deviceInfo.isIosPlatform) {
    const {isPushNotificationAllowed, ...rest} = iosPermissionStatus(settings);
    permission.isPushNotificationAllowed = isPushNotificationAllowed;
    permission.ios = rest as IosNotificationPermission;
  } else if (deviceInfo.isAndroidPlatform) {
    const {isPushNotificationAllowed, ...rest} =
      androidPermissionStatus(settings);
    permission.isPushNotificationAllowed = isPushNotificationAllowed;
    permission.android = rest as AndroidNotificationPermission;
  }
  return permission;
};

const requestPushNotificationPermission = async () => {
  const permissionStatus = await checkPushNotificationPermission();
  if (permissionStatus.isPushNotificationAllowed) {
    return permissionStatus;
  }
  const permission = {
    isPushNotificationAllowed: false,
  } as NotificationPermission;
  if (deviceInfo.isIosPlatform) {
    const settings = await notifee.requestPermission();
    const {isPushNotificationAllowed, ...rest} = iosPermissionStatus(settings);
    permission.isPushNotificationAllowed = isPushNotificationAllowed;
    permission.ios = rest as IosNotificationPermission;
  } else if (deviceInfo.isAndroidPlatform) {
    const status = await PermissionsAndroid.request(
      'android.permission.POST_NOTIFICATIONS',
    );
    if (status === 'granted') {
      const settings = await checkPushNotificationPermission();
      permission.isPushNotificationAllowed = settings.isPushNotificationAllowed;
      permission.android = settings.android;
    }
  }
  return permission;
};

const checkNotificationPermissionStatus = async () => {
  let settings = await checkPushNotificationPermission();
  if (!settings.isPushNotificationAllowed) {
    settings = await requestPushNotificationPermission();
  }
  return settings.isPushNotificationAllowed;
};

const displayPushNotification = async (params: NotificationDisplayParams) => {
  const isPermissionsGiven = await checkNotificationPermissionStatus();
  if (!isPermissionsGiven) {
    return;
  }

  const channelId = await updateAndroidChannelDetailsForNotification({
    androidChannelDetails: params.androidChannelDetails,
  });
  const {android = {}} = params.notificationDetails;
  const notificationDetails = params.notificationDetails;
  notificationDetails.android = {
    ...android,
    channelId,
  };

  const notificationId = await notifee.displayNotification(notificationDetails);
  return {notificationId};
};

const cancelPushNotification = async (notificationId: string) => {
  await notifee.cancelNotification(notificationId);
};

const getEventName = (type: PushNotificationEventType) => {
  let eventName: PushNotificationEventNames;
  switch (type) {
    case NotificationEventType.ACTION_PRESS:
      eventName = 'ACTION_PRESS';
      break;
    case NotificationEventType.APP_BLOCKED:
      eventName = 'APP_BLOCKED';
      break;
    case NotificationEventType.CHANNEL_BLOCKED:
      eventName = 'CHANNEL_BLOCKED';
      break;
    case NotificationEventType.CHANNEL_GROUP_BLOCKED:
      eventName = 'CHANNEL_GROUP_BLOCKED';
      break;
    case NotificationEventType.DELIVERED:
      eventName = 'DELIVERED';
      break;
    case NotificationEventType.DISMISSED:
      eventName = 'DISMISSED';
      break;
    case NotificationEventType.FG_ALREADY_EXIST:
      eventName = 'FG_ALREADY_EXIST';
      break;
    case NotificationEventType.PRESS:
      eventName = 'PRESS';
      break;
    case NotificationEventType.TRIGGER_NOTIFICATION_CREATED:
      eventName = 'TRIGGER_NOTIFICATION_CREATED';
      break;
    case NotificationEventType.UNKNOWN:
      eventName = 'UNKNOWN';
      break;
  }
  return eventName;
};

const registerEventHandler = (params: {
  eventName: PushNotificationEventNames;
  detail: PushNotificationEventDetail;
  observers?: NotificationEventHandleParams;
}) => {
  const {eventName, detail, observers} = params;
  if (eventName) {
    if (eventName === 'FG_ALREADY_EXIST') {
      completForegorundService(true);
    } else {
      const eventObservers = observers?.[eventName];
      if (
        eventObservers &&
        Array.isArray(eventObservers) &&
        eventObservers.length > 0
      ) {
        eventObservers.forEach(observer => observer(detail, eventName));
      }
    }
  }
};

const foregroundNotificationEventHandler = (
  observers?: NotificationEventHandleParams,
) => {
  return notifee.onForegroundEvent(({type, detail}) => {
    const eventName: PushNotificationEventNames = getEventName(type);
    registerEventHandler({eventName, detail, observers});
  });
};

const backgroundNotificationEventHandler = (
  observers?: NotificationEventHandleParams,
) => {
  notifee.onBackgroundEvent(async ({type, detail}) => {
    const eventName: PushNotificationEventNames = getEventName(type);
    registerEventHandler({eventName, detail, observers});
  });
};

const createTriggerNotification = async (params: TriggerNotificationParams) => {
  const isPermissionsGiven = await checkNotificationPermissionStatus();
  if (!isPermissionsGiven) return;

  const {timestampTrigger, intervalTrigger} = params;
  if (!timestampTrigger && !intervalTrigger) {
    throw new Error(
      'Either one of timestampTrigger or intervalTrigger is required.',
    );
  }
  const channelId = await updateAndroidChannelDetailsForNotification({
    androidChannelDetails: params.androidChannelDetails,
  });
  const {android = {}} = params.notificationDetails;
  const notificationDetails = params.notificationDetails;
  notificationDetails.android = {
    ...android,
    channelId,
  };
  if (
    timestampTrigger &&
    typeof timestampTrigger.repeatFrequency !== 'undefined' &&
    deviceInfo.iosVersion
  ) {
    if (timestampTrigger.repeatFrequency === CustomRepeatFrequency.DAILY) {
      timestampTrigger.repeatFrequency = RepeatFrequency.WEEKLY as any;
    }
    if (timestampTrigger.repeatFrequency === CustomRepeatFrequency.HOURLY) {
      timestampTrigger.repeatFrequency = RepeatFrequency.DAILY as any;
    }
  }
  const trigger = (timestampTrigger ?? intervalTrigger) as any;

  const notificationId = await notifee.createTriggerNotification(
    notificationDetails,
    trigger,
  );

  return {notificationId};
};

const getTriggerNotificationIds = async () => {
  const ids = await notifee.getTriggerNotificationIds();
  return ids.map(id => ({notificationId: id}));
};

const createProgressIndicatorNotification = async (
  params: ProgressIndicatorNotificationParams,
) => {
  let notificationId: string | undefined;
  const isPermissionsGiven = await checkNotificationPermissionStatus();
  if (!isPermissionsGiven) {
    return;
  }

  const channelId = await updateAndroidChannelDetailsForNotification({
    androidChannelDetails: params.androidChannelDetails,
  });

  const createNotificationForAndroidOnly = !!(
    params.showNotificationOnlyInAndroid && !deviceInfo.isAndroidPlatform
  );

  const createNotification = async (
    notificationDetails: ProgressIndicatorNotificationParams['notificationDetails'],
  ) => {
    if (createNotificationForAndroidOnly) {
      return;
    }
    const newNotificationDetails = notificationDetails as PushNotification;
    const {android = {}} = notificationDetails;
    newNotificationDetails.android = {
      ...android,
      channelId,
    };

    const notificationId = await notifee.displayNotification(
      notificationDetails,
    );
    return notificationId;
  };

  const cancelNotification = async () => {
    if (createNotificationForAndroidOnly) {
      return;
    }
    await notifee.cancelNotification(notificationId as string);
  };

  const updateNotification = async (
    notificationDetails: ProgressIndicatorNotificationParams['notificationDetails'],
  ) => {
    if (createNotificationForAndroidOnly) return;
    await createNotification({...notificationDetails, id: notificationId});
  };
  notificationId = await createNotification(params.notificationDetails);

  return {onUpdate: updateNotification, onComplete: cancelNotification};
};

const completForegorundService = async (shouldStopService: boolean) => {
  if (shouldStopService) {
    await notifee.stopForegroundService();
    NativePushNotification.reSuscribeForegroundEventAfterFGSEnd();
  }
};

const createForegroundServiceNotification = async (
  params: ForegroundServiceNotificationParams,
) => {
  let fgUnsuscribeCb: Function | null = null;
  const isPermissionsGiven = await checkNotificationPermissionStatus();
  if (!isPermissionsGiven) {
    return {
      onServiceComplete: async () => {
        completForegorundService(false);
      },
    };
  }

  const channelId = await updateAndroidChannelDetailsForNotification({
    androidChannelDetails: params.androidChannelDetails,
  });
  const {onServiceUpdate, eventObservers, showNotificationOnlyInAndroid} =
    params;
  const canCreateNotification = showNotificationOnlyInAndroid
    ? deviceInfo.isAndroidPlatform
    : true;

  const isForegroundService =
    params.notificationDetails.android?.asForegroundService;

  const onServiceComplete = async () => {
    const shouldStopService = !!(isForegroundService && canCreateNotification);
    if (!shouldStopService) return;
    fgUnsuscribeCb?.();
    await completForegorundService(shouldStopService);
  };
  const updateNotificationDetails = async (notification: PushNotification) => {
    if (canCreateNotification) {
      await notifee.displayNotification(notification);
    }
  };

  const android = (params.notificationDetails.android ||
    {}) as NotificationAndroid;
  android.channelId = channelId;
  params.notificationDetails.android = android;

  if (canCreateNotification) {
    if (isForegroundService) {
      notifee.registerForegroundService(notification => {
        NativePushNotification.unsuscribeForegroundEvent();
        return new Promise(() => {
          if (typeof onServiceUpdate === 'function') {
            onServiceUpdate({
              notification,
              updateNotification: updateNotificationDetails,
            });
          }
          fgUnsuscribeCb = notifee.onForegroundEvent(({type, detail}) => {
            const eventName: PushNotificationEventNames = getEventName(type);
            if (eventName) {
              const observers = eventObservers?.[eventName];
              if (
                observers &&
                Array.isArray(observers) &&
                observers.length > 0
              ) {
                observers.forEach(observer =>
                  observer({eventDetails: detail, eventName, notification}),
                );
              }
            }
          });
        });
      });
    }
    await notifee.displayNotification(params.notificationDetails);
  }

  return {onServiceComplete};
};

//================================================ Remote Notifications =============================

const getDeviceFCMToken = async () => {
  return Firebase.cloudMessaging.getFCMToken();
};

const remoteForegroundNotificationEventHandler = (
  messageHandler: RemoteMessageHandler,
) => {
  return Firebase.cloudMessaging.foregroundMessageHandler(messageHandler);
};

const remoteBackgroundNotificationEventHandler = (
  messageHandler: RemoteMessageHandler,
) => {
  return Firebase.cloudMessaging.backgroundMessageHandler(messageHandler);
};

//=========================================== hooks ==================================================
const useCheckPushNotificationPermission = () => {
  const [settings, setSettings] = useState<NotificationPermission>({
    isPushNotificationAllowed: false,
  });

  useEffect(() => {
    checkPushNotificationPermission().then(settings => {
      setSettings(settings);
    });
  }, []);

  return settings;
};

const useRequestPushNotificationPermission = () => {
  const [settings, setSettings] = useState<NotificationPermission>({
    isPushNotificationAllowed: false,
  });

  useEffect(() => {
    requestPushNotificationPermission().then(settings => {
      setSettings(settings);
    });
  }, []);

  return settings;
};

//===================================== Notification Class======================================================
export class NativePushNotification {
  //=========================== Private Properties =========================
  static #foregroundEventUnsuscribeCb: Function | null = null;
  static #foregroundRemoteEventUnsuscribeCb: Function | null = null;

  static #foregroundEventObservers: NotificationEventHandleParams | undefined =
    undefined;
  static #foregroundRemoteEventObservers: RemoteMessageHandler | undefined =
    undefined;

  static #foregroundEventHandler = (params?: {
    localEventObservers?: NotificationEventHandleParams;
    remoteEventObservers?: RemoteMessageHandler;
  }) => {
    const {localEventObservers, remoteEventObservers} = params || {};
    NativePushNotification.#foregroundEventUnsuscribeCb?.();
    NativePushNotification.#foregroundRemoteEventUnsuscribeCb?.();

    NativePushNotification.#foregroundEventObservers = localEventObservers;
    NativePushNotification.#foregroundRemoteEventObservers =
      remoteEventObservers;
    const unsuscribe = foregroundNotificationEventHandler(
      NativePushNotification.#foregroundEventObservers,
    );
    let remoteUnsuscribe: Function | null = null;
    if (typeof remoteEventObservers === 'function') {
      remoteUnsuscribe =
        remoteForegroundNotificationEventHandler(remoteEventObservers);
    }
    NativePushNotification.#foregroundEventUnsuscribeCb = unsuscribe;
    NativePushNotification.#foregroundRemoteEventUnsuscribeCb =
      remoteUnsuscribe;
  };

  static #backgroundEventHandler = (params?: {
    localEventObservers?: NotificationEventHandleParams;
    remoteEventObservers?: RemoteMessageHandler;
  }) => {
    const {localEventObservers, remoteEventObservers} = params || {};
    backgroundNotificationEventHandler(localEventObservers);
    if (typeof remoteEventObservers === 'function') {
      remoteBackgroundNotificationEventHandler(remoteEventObservers);
    }
  };
  //===================== constants ===================

  /**
   * The importance of a notification changes how it is presented to users.
   *
   * Possible values are:
   * "DEFAULT" - The notification will show in the device statusbar. When the user pulls down the
   * notification shade, the notification will show in it's expanded state (if applicable).
   * "HIGH" - The notifications will appear on-top of applications, allowing direct interaction without pulling
   * down the notification shade.
   * "LOW" - The notifications will show in the device statusbar, however the notification will not alert
   * the user (no sound or vibration). The notification will show in it's expanded state when the
   * notification shade is pulled down.
   * "MIN" - The notifications will not show up in the statusbar, or alert the user. The notification
   * will be in a collapsed state in the notification shade and placed at the bottom of the list.
   * "NONE" - The notification will not be shown. This has the same effect as the user disabling notifications
   * in the application settings.
   */
  static AndroidPushNotificationImortance = AndroidImportance;
  /**
   * Android devices on 8.0 (API level 26) and above have a feature called "notification badges".
   * Badges are a way for users to interact with notifications without pulling down the
   * notification shade, or opening the app.
   *
   * Possible Values are:
   * "None" -	Uses the default preference of the device launcher. Some launchers will display no icon,
   * others will use the largeIcon (if provided).
   * "Small" -	Uses the icon provided to smallIcon, if available.
   * "Large" -	Uses the icon provided to largeIcon, if available.
   */
  static AndroidPushNotificationBadgeIconType = AndroidBadgeIconType;

  /**
   * Controlling the visibility of a notification on the users device is important,
   * especially if a notification contains sensitive information (such as a banking app).
   * Setting the visibility controls how a notification is shown to a locked device on the
   * lockscreen.
   *
   * Possible Values are:
   * "Private" - Show the notification on all lockscreens, but conceal information on devices with secure lockscreens enabled.
   * "Public" - Show the notification in its entirety on all lockscreens.
   * "Secret"	- Do not reveal/show any part of this notification on a secure lockscreen.
   *
   * The default visibility is Private.
   */
  static AndroidPushNotificationVisibility = AndroidVisibility;

  /** A basic notification usually includes a title, a line of text and/or actions.
   * Using the style property on a notification, you can provide additional information
   * which can be viewed when the user expands the notification, giving better overall
   * context of the notification.
   *
   * Possible Values are:
   * "BIGPICTURE" - The big picture style allows you to display a large resolution image within 
    the body of your notification when expanded, and it's possible to also override any large icons.
   * "BIGTEXT" - In its collapsed form, the notification body of text will truncate itself if it spans 
    more than a few lines (depending on space). The big text style allows you to show a large volume 
    of text when expanded. 
   * "INBOX"	- Inbox style notifications are used to display multiple lines of content inside of a single notification. 
    Depending on space, the device will show as many lines of text as possible, and "hide" the remainder.
   * "MESSAGING"	- Message style notifications are used when you wish to display the history of an ongoing chat.
   *
   */
  static AndroidNotificationStyle = AndroidStyle;

  /**
   * Constants that indicate the importance and delivery timing of a notification.
   * With iOS 15’s new Focus Mode, users are more in control over when app notifications can “interrupt”
   * them with a sound or vibration. We can make use of the IosInterruptionLevel to control
   * the notification’s importance and required delivery timing.
   * Possible Values are:
   * "active" - The system presents the notification immediately, lights up the screen, and can play a sound.
   * "critical" - The system presents the notification immediately, lights up the screen, and bypasses the mute
   * switch to play a sound.
   * "passive"	- The system adds the notification to the notification list without lighting up the screen or playing a sound.
   * "timeSensitive"	- The system presents the notification immediately, lights up the screen, can play a sound, and
   * breaks through system notification controls.
   */
  static IOSInterruptionLevel = IosInterruptionLevel;

  /**
   * The frequency at which the trigger repeats. If unset, the notification will only be displayed once.
   *
   * For example: if set to "HOURLY", the notification will repeat every hour from the
   * timestamp specified. if set to "DAILY", the notification will repeat every day
   * from the timestamp specified.
   */
  static TimestampRepeatFrequency = CustomRepeatFrequency;

  // ======================================= object properties =============================
  /**
   * This is IOS only property. You can call this property but it which only work, if device is IOS.
   */
  static badgeCount = Object.freeze({
    /**
     *
     * @param {number} count - It should be number.
     * Pass Positive number to increment count.
     * Negative number to decrement count.
     * @returns
     */
    update: updateIosNotificationBadgeCount,
    get: getIosNotificationBadgeCount,
    delete: deleteIosNotificationBadgeCount,
  });

  /**
   * This is IOS only property. You can call this property but it which only work, if device is IOS.
   */
  static category = Object.freeze({
    /**
     * Notifications can be categorized into groups, allowing you to control how the system displays them.
     * In Ios platforms this is acheive by Cateogry.At minimum, a category must be created with a unique identifier
     * using the setNotificationCategories method, one of more categories will be set on the device. All
     * categories must be set at once with this method as it overrides any pre-existing categories on the device.
     * For more information: https://notifee.app/react-native/reference/iosnotificationcategory
     */
    set: setIosNotificationCategory,
  });

  /**
   * This is Android only property. You can call this property but it which only work, if device is Android.
   */
  static channel = Object.freeze({
    /**
     * Notifications can be categorized into groups, allowing you to control how the system displays them.
     * In Android platforms this is acheive by Channel And Groups.
     * Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
     * Applications can create one or more notification channels. Each channel can be customised
     * with its own unique visual & auditory behaviour. Once a channel has been created with
     * initial settings, the user then has full control in changing those settings and can
     * also decide how intrusive notifications from your application can be.
     * For more information: https://notifee.app/react-native/reference/androidchannel
     */
    create: createAndroidNotificationChannel,
    delete: deleteAndroidChannel,
    checkPermissionStatus: checkAndroidChannelPermission,
  });

  /**
   * This is Android only property. You can call this property but it which only work, if device is Android.
   */
  static channelGroup = Object.freeze({
    /**
     * Notifications can be categorized into groups, allowing you to control how the system displays them.
     * In Android platforms this is acheive by Channel And Groups.
     * Channel Groups are available if you'd further like to organize the appearance of your
     * channels in the settings UI. Creating channel groups is a good idea when your application
     * has many channels, or for example supports multiple accounts (such as work profiles).
     * Groups allow users to easily identify and control multiple notification channels.
     * For more information: https://notifee.app/react-native/reference/androidchannelgroup
     */
    create: createAndroidNotificationChannelGroup,
    delete: deleteAndroidChannelGroup,
    checkPermissionStatus: checkAndroidChannelGroupPermission,
  });

  static notification = Object.freeze({
    checkPermissionStatus: checkPushNotificationPermission,
    requestPermission: requestPushNotificationPermission,
    /**
     * For Information about notification properties, see https://notifee.app/react-native/reference/notification.
     * For Android notification properties, see https://notifee.app/react-native/reference/notificationandroid.
     * For IOS notification properties, see https://notifee.app/react-native/reference/notificationios.
     *
     * Note: To update the notification, pass the notification ID as notificationDetails.id to
     * the method, which was returned during the initial call.
     */
    show: displayPushNotification,
    delete: cancelPushNotification,
    progressIndicator: Object.freeze({
      /**
       * Notifications can display progress indicators to show users a status of an ongoing operation, for example,
       * the progress of file being uploaded/download.
       * This property is only available on Android Platform, on other platforms it shows as normal notification.
       * It return two method, one is onUpdate which updates the progress indicator value and
       * the other is onComplete which complete the operation and cancel the notification.
       * For more info about progress indicator, see https://notifee.app/react-native/docs/android/progress-indicators
       *
       * For Android notification properties, see https://notifee.app/react-native/reference/notificationandroid.
       * For IOS notification properties, see https://notifee.app/react-native/reference/notificationios.
       *
       * For Android some properties are removed only for this feature, which are
       * 'asForegroundService', 'autoCancel', 'colorized', 'defaults', 'fullScreenAction', 'showTimestamp',
       * 'timeoutAfter', 'timestamp', 'channelId'
       */
      show: createProgressIndicatorNotification,
    }),
    foregroundService: Object.freeze({
      /**
       * Foreground services are an advanced Android concept which allows you to display notifications
       * to your users when running long lived background tasks. The notification acts like any other
       * notification, however it cannot be removed by the user and lives for the duration of the service.
       *
       * It extra three params then the usual notification
       * showNotificationOnlyInAndroid -  indicating whether the notification should only
       * be shown in Android
       * onServiceUpdate - whenever you have update in your ongoing task , we can also update the
       * current notification to display different content.
       * eventObservers - Much like other notifications, we can subscribe to events when the user
       * interacts with the Foreground Service notification. The service task runs in its own context,
       * allowing us to subscribe to events within itself. You have to pass the function for the event
       * you want to subscribe.
       *
       * It return one params
       * onServiceComplete - Only way to stop foreground service notification is call this function.
       *
       * For Android notification properties, see https://notifee.app/react-native/reference/notificationandroid.
       * For IOS notification properties, see https://notifee.app/react-native/reference/notificationios.
       *
       * For Android some properties are removed only for this feature, which are
       *  'autoCancel' , 'defaults' , 'fullScreenAction' , 'timeoutAfter' , 'channelId'
       */
      create: createForegroundServiceNotification,
      stop: async () => {
        await completForegorundService(true);
      },
    }),
    trigger: Object.freeze({
      /**
       * For Information about trigger notification, see https://notifee.app/react-native/docs/triggers and
       * https://notifee.app/react-native/reference/trigger.
       *
       * Note: To update the notification, pass the notification ID as notificationDetails.id to
       * the method, which was returned during the initial call.
       */
      create: createTriggerNotification,
      savedIds: getTriggerNotificationIds,
      delete: cancelPushNotification,
    }),
    /**
     * Firebase Cloud Messaging (FCM) is a messaging solution that lets you reliably send
     * messages at no cost to both Android & iOS devices.
     * Using FCM, you can send data payloads (via a message) to a device for a specific application.
     * Each message can transfer a payload of up to 4KB to a client. FCM also provides features to
     * build basic notifications from the Firebase console, versatile message targeting,
     * client-to-client communication and web notifications support.
     *
     * For more information about it,
     * see https://notifee.app/react-native/docs/integrations/fcm#subscribing-to-messages
     */
    remote: Object.freeze({
      /**
       * FCM provides a handy method for retrieving our device-specific token.
       * Device-specific token is used to identify the device.
       * Once the token is retrieved, it is advised that you store the token in
       * your backend database of choice as you will need to use the token to send
       * messages via FCM to that specific device.
       */
      getFCMToken: getDeviceFCMToken,
    }),
  });

  static eventHandler = Object.freeze({
    foreground: NativePushNotification.#foregroundEventHandler,
    background: NativePushNotification.#backgroundEventHandler,
  });

  static backgroundRestriction = Object.freeze({
    check: checkAndroidBackgroundRestriction,
  });

  //==================helper functions =================

  static reSuscribeForegroundEventAfterFGSEnd = () => {
    NativePushNotification.#foregroundEventHandler({
      localEventObservers: NativePushNotification.#foregroundEventObservers,
      remoteEventObservers:
        NativePushNotification.#foregroundRemoteEventObservers,
    });
  };

  static unsuscribeForegroundEvent = () => {
    NativePushNotification.#foregroundEventUnsuscribeCb?.();
    NativePushNotification.#foregroundRemoteEventUnsuscribeCb?.();
  };

  // ================= hooks ==================================//
  static useCheckPushNotificationPermission =
    useCheckPushNotificationPermission;

  static useRequestPushNotificationPermission =
    useRequestPushNotificationPermission;
}
