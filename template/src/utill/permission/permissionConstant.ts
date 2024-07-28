import {Platform} from 'react-native';
import {Permission, PermissionStatus, RESULTS} from 'react-native-permissions';
import {ObjectKeys, ObjectValues} from '../../custom-config';

const IOS = Object.freeze({
  APP_TRACKING_TRANSPARENCY: 'ios.permission.APP_TRACKING_TRANSPARENCY',
  BLUETOOTH: 'ios.permission.BLUETOOTH',
  CALENDARS: 'ios.permission.CALENDARS',
  CALENDARS_WRITE_ONLY: 'ios.permission.CALENDARS_WRITE_ONLY',
  CAMERA: 'ios.permission.CAMERA',
  CONTACTS: 'ios.permission.CONTACTS',
  FACE_ID: 'ios.permission.FACE_ID',
  LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS',
  LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
  MEDIA_LIBRARY: 'ios.permission.MEDIA_LIBRARY',
  MICROPHONE: 'ios.permission.MICROPHONE',
  MOTION: 'ios.permission.MOTION',
  PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
  PHOTO_LIBRARY_ADD_ONLY: 'ios.permission.PHOTO_LIBRARY_ADD_ONLY',
  REMINDERS: 'ios.permission.REMINDERS',
  //   SIRI: 'ios.permission.SIRI', // remove siri (certificate required)
  SPEECH_RECOGNITION: 'ios.permission.SPEECH_RECOGNITION',
  STOREKIT: 'ios.permission.STOREKIT',
} as const);

const ANDROID = Object.freeze({
  ACCEPT_HANDOVER: 'android.permission.ACCEPT_HANDOVER',
  ACCESS_BACKGROUND_LOCATION: 'android.permission.ACCESS_BACKGROUND_LOCATION',
  ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
  ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  ACCESS_MEDIA_LOCATION: 'android.permission.ACCESS_MEDIA_LOCATION',
  ACTIVITY_RECOGNITION: 'android.permission.ACTIVITY_RECOGNITION',
  ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL',
  ANSWER_PHONE_CALLS: 'android.permission.ANSWER_PHONE_CALLS',
  BLUETOOTH_ADVERTISE: 'android.permission.BLUETOOTH_ADVERTISE',
  BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
  BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
  BODY_SENSORS: 'android.permission.BODY_SENSORS',
  BODY_SENSORS_BACKGROUND: 'android.permission.BODY_SENSORS_BACKGROUND',
  CALL_PHONE: 'android.permission.CALL_PHONE',
  CAMERA: 'android.permission.CAMERA',
  GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS',
  NEARBY_WIFI_DEVICES: 'android.permission.NEARBY_WIFI_DEVICES',
  POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
  PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS',
  READ_CALENDAR: 'android.permission.READ_CALENDAR',
  READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
  READ_CONTACTS: 'android.permission.READ_CONTACTS',
  READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
  READ_MEDIA_AUDIO: 'android.permission.READ_MEDIA_AUDIO',
  READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES',
  READ_MEDIA_VIDEO: 'android.permission.READ_MEDIA_VIDEO',
  READ_MEDIA_VISUAL_USER_SELECTED:
    'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
  READ_PHONE_NUMBERS: 'android.permission.READ_PHONE_NUMBERS',
  READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
  READ_SMS: 'android.permission.READ_SMS',
  RECEIVE_MMS: 'android.permission.RECEIVE_MMS',
  RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
  RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH',
  RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
  SEND_SMS: 'android.permission.SEND_SMS',
  USE_SIP: 'android.permission.USE_SIP',
  UWB_RANGING: 'android.permission.UWB_RANGING',
  WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR',
  WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG',
  WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS',
  WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
} as const);

const ANDROID_CUSTOM = Object.freeze({
  ACCESS_FOREGROUND_LOCATION: {
    name: 'ACCESS_FOREGROUND_LOCATION',
    permission: [ANDROID.ACCESS_COARSE_LOCATION, ANDROID.ACCESS_FINE_LOCATION],
  },
  ACCESS_CALENDAR: {
    name: 'ACCESS_CALENDAR',
    permission: [ANDROID.READ_CALENDAR, ANDROID.WRITE_CALENDAR],
  },
  ACCESS_CONTACT: {
    name: 'ACCESS_CONTACT',
    permission: [ANDROID.READ_CONTACTS, ANDROID.WRITE_CONTACTS],
  },
  ACCESS_MEDIA: {
    name: 'ACCESS_MEDIA',
  },
  ACCESS_BLUETOOTH: {
    name: 'ACCESS_BLUETOOTH',
  },
});

const IOS_CUSTOM = Object.freeze({
  ACCESS_MEDIA: {
    name: 'ACCESS_MEDIA',
    permission: [IOS.PHOTO_LIBRARY, IOS.PHOTO_LIBRARY_ADD_ONLY],
  },

  ACCESS_BLUETOOTH: {
    name: 'ACCESS_BLUETOOTH',
    permission: [IOS.BLUETOOTH],
  },
  ACCESS_CALENDAR: {
    name: 'ACCESS_CALENDAR',
    permission: [IOS.CALENDARS, IOS.CALENDARS_WRITE_ONLY],
  },
});

const status = Object.freeze({
  ...RESULTS,
  UNKNOWN: 'unknown',
  FAILED: 'failed',
} as const);

export type CustomPermisionStatus = (typeof status)[keyof typeof status];

export const permissions = Object.freeze({
  android: ANDROID,
  ios: IOS,
  status,
  android_custom: ANDROID_CUSTOM,
  ios_custom: IOS_CUSTOM,
});

export const permissionScope = {limited: 'limited', all: 'all'};
export type PermissionRef = Record<Permission, string>;
export type GranularPermissions = 'audio' | 'video' | 'image';
export type BluetoothOptions =
  | 'communicate'
  | 'public-visibility'
  | 'background-communicate';

export type FormattedStatus = {
  permissionName: string;
  canAskAgain: boolean;
  granted: boolean;
  status: PermissionStatus | CustomPermisionStatus;
  scope?: (typeof permissionScope)[keyof typeof permissionScope];
};
export type PermissionResponse = Record<string, Array<FormattedStatus>>;

export type PlatformPermissionOptions = {
  mediaGranularPermissions?: GranularPermissions[];
  bluetoothOptions?: BluetoothOptions[];
};

export type PlatformPermissionOptionKeys =
  ObjectKeys<PlatformPermissionOptions>;

class PermissionName {
  static #instance: null | PermissionName = null;
  #permissionsName = {} as Record<Permission, string>;
  constructor() {
    if (PermissionName.#instance === null) {
      PermissionName.#instance = this;
      this.#createPermisionName();
    }
    return PermissionName.#instance;
  }
  #createPermisionName() {
    let androidEntry: keyof typeof permissions.android,
      iosEntry: keyof typeof permissions.ios;
    for (androidEntry in permissions.android) {
      this.#permissionsName[permissions.android[androidEntry]] = androidEntry;
    }
    for (iosEntry in permissions.ios) {
      this.#permissionsName[permissions.ios[iosEntry]] = iosEntry;
    }
  }
  permissionName(permision: Permission) {
    return this.#permissionsName[permision];
  }
}
export const permissionName = new PermissionName();

export const isIosPlatform = Platform.OS === 'ios' || Platform.OS === 'macos';
export const isAndroidPlatform = Platform.OS === 'android';
export const androidVersion = isAndroidPlatform
  ? parseInt(Platform.Version.toString())
  : 0;

const foregroundLocationScope = {
  none: 'none',
  all: 'all',
  fine: 'fine',
  corase: 'corase',
};

const readWriteScope = {
  none: 'none',
  all: 'all',
  read: 'read',
  write: 'write',
};

const mediaScope = {
  none: 'none',
  all: 'all',
  limited: 'limited',
};

const bluetoothScope = {
  none: 'none',
  all: 'all',
  communicate: 'communicate',
  publicVisibility: 'public-visibility',
  backgroundCommunicate: 'background-communicate',
};

export const availablePermissions = {
  // add multiToSingleConfig = undefined if not require, else typescript throw error
  camera: {name: 'camera', multiToSingleConfig: undefined},
  microphone: {name: 'microphone', multiToSingleConfig: undefined},
  background_location: {
    name: 'background_location',
    multiToSingleConfig: undefined,
  },
  remainders: {name: 'remainders', multiToSingleConfig: undefined},
  cellular: {name: 'cellular', multiToSingleConfig: undefined},
  motion: {name: 'motion', multiToSingleConfig: undefined},
  foreground_location: {
    name: 'foreground_location',
    multiToSingleConfig: {
      acceptedScopeName: foregroundLocationScope.all,
      rejectedScopeName: foregroundLocationScope.none,
      permissionGrpName:
        permissions.android_custom.ACCESS_FOREGROUND_LOCATION.name,
      scopeOptionsFrOneSucsCond: {
        [ANDROID.ACCESS_FINE_LOCATION]: foregroundLocationScope.fine,
        [ANDROID.ACCESS_COARSE_LOCATION]: foregroundLocationScope.corase,
      },
    },
  },
  calender: {
    name: 'calender',
    multiToSingleConfig: {
      acceptedScopeName: readWriteScope.all,
      rejectedScopeName: readWriteScope.none,
      permissionGrpName: isIosPlatform
        ? permissions.ios_custom.ACCESS_CALENDAR.name
        : permissions.android_custom.ACCESS_CALENDAR.name,
      scopeOptionsFrOneSucsCond: {
        [ANDROID.READ_CALENDAR]: readWriteScope.read,
        [ANDROID.WRITE_CALENDAR]: readWriteScope.write,
        [IOS.CALENDARS_WRITE_ONLY]: readWriteScope.write,
      },
    },
  },
  contact: {
    name: 'contact',
    multiToSingleConfig: {
      acceptedScopeName: readWriteScope.all,
      rejectedScopeName: readWriteScope.none,
      permissionGrpName: permissions.android_custom.ACCESS_CONTACT.name,
      scopeOptionsFrOneSucsCond: {
        [ANDROID.READ_CONTACTS]: readWriteScope.read,
        [ANDROID.WRITE_CONTACTS]: readWriteScope.write,
      },
    },
  },
  media: {
    name: 'media',
    multiToSingleConfig: {
      acceptedScopeName: mediaScope.all,
      rejectedScopeName: mediaScope.none,
      permissionGrpName: isIosPlatform
        ? permissions.ios_custom.ACCESS_MEDIA.name
        : permissions.android_custom.ACCESS_MEDIA.name,
      scopeOptionsFrOneSucsCond: {
        [ANDROID.READ_MEDIA_VISUAL_USER_SELECTED]: mediaScope.limited,
        [IOS.PHOTO_LIBRARY_ADD_ONLY]: mediaScope.limited,
      },
    },
  },
  bluetooth: {
    name: 'bluetooth',
    multiToSingleConfig: {
      acceptedScopeName: bluetoothScope.all,
      rejectedScopeName: bluetoothScope.none,
      permissionGrpName: isIosPlatform
        ? permissions.ios_custom.ACCESS_BLUETOOTH.name
        : permissions.android_custom.ACCESS_BLUETOOTH.name,
      scopeOptionsFrOneSucsCond: {
        [ANDROID.BLUETOOTH_CONNECT]: bluetoothScope.communicate,
        [ANDROID.BLUETOOTH_ADVERTISE]: bluetoothScope.publicVisibility,
        [ANDROID.ACCESS_BACKGROUND_LOCATION]:
          bluetoothScope.backgroundCommunicate,
      },
    },
  },
} as const;

export type PermissionsNameKey = ObjectValues<
  typeof availablePermissions
>['name'];

export type PermissionsGroupKey =
  | PermissionsNameKey
  | {name: PermissionsNameKey; options?: PlatformPermissionOptions};

export type MediaPermissions =
  | typeof permissions.android.READ_EXTERNAL_STORAGE
  | typeof permissions.android.WRITE_EXTERNAL_STORAGE
  | typeof permissions.android.READ_MEDIA_VISUAL_USER_SELECTED
  | typeof permissions.android.READ_MEDIA_AUDIO
  | typeof permissions.android.READ_MEDIA_IMAGES
  | typeof permissions.android.READ_MEDIA_VIDEO
  | typeof permissions.ios.PHOTO_LIBRARY
  | typeof permissions.ios.PHOTO_LIBRARY_ADD_ONLY;

export type BluetoothPermissions =
  | typeof permissions.android.BLUETOOTH_SCAN
  | typeof permissions.android.BLUETOOTH_CONNECT
  | typeof permissions.android.BLUETOOTH_ADVERTISE
  | typeof permissions.android.ACCESS_FINE_LOCATION
  | typeof permissions.android.ACCESS_COARSE_LOCATION
  | typeof permissions.android.ACCESS_BACKGROUND_LOCATION
  | typeof permissions.ios.BLUETOOTH;

export type ProcessFilterCb = (
  filtererd: FormattedStatus[],
  options: {
    grantedPermissionName: string;
    scopeOptionsFrOneSucsCond: {[x: string]: string};
  },
) => FormattedStatus[];
