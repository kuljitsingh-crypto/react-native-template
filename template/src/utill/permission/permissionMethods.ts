import {
  Permission,
  PermissionStatus,
  RESULTS,
  check,
  checkMultiple,
  request,
  requestMultiple,
} from 'react-native-permissions';
import {ObjectKeys} from '../../custom-config';
import {
  availablePermissions,
  BluetoothOptions,
  BluetoothPermissions,
  FormattedStatus,
  GranularPermissions,
  MediaPermissions,
  permissionName,
  PermissionRef,
  PermissionResponse,
  permissions,
  permissionScope,
  PermissionsNameKey,
  PlatformPermissionOptions,
  ProcessFilterCb,
} from './permissionConstant';
import {deviceInfo} from '../deviceInfo';

const getMediaPermissions = (
  granularPermissions?: GranularPermissions[],
): MediaPermissions[] | null => {
  if (deviceInfo.isIosPlatform) {
    return permissions.ios_custom.ACCESS_MEDIA.permission;
  } else if (deviceInfo.isAndroidPlatform) {
    if (deviceInfo.androidVersion <= 32) {
      return [
        permissions.android.READ_EXTERNAL_STORAGE,
        permissions.android.WRITE_EXTERNAL_STORAGE,
      ];
    }
    const permissionArr: MediaPermissions[] =
      deviceInfo.androidVersion >= 34
        ? [permissions.android.READ_MEDIA_VISUAL_USER_SELECTED]
        : [];
    const isValidGranularPermissions =
      granularPermissions &&
      Array.isArray(granularPermissions) &&
      granularPermissions.length > 0 &&
      granularPermissions.length < 3;
    if (isValidGranularPermissions) {
      granularPermissions.forEach(permsn => {
        if (permsn === 'image') {
          permissionArr.push(permissions.android.READ_MEDIA_IMAGES);
        } else if (permsn === 'video') {
          permissionArr.push(permissions.android.READ_MEDIA_VIDEO);
        } else if (permsn === 'audio') {
          permissionArr.push(permissions.android.READ_MEDIA_AUDIO);
        }
      });
    } else {
      permissionArr.push(
        permissions.android.READ_MEDIA_AUDIO,
        permissions.android.READ_MEDIA_IMAGES,
        permissions.android.READ_MEDIA_VIDEO,
      );
    }

    return permissionArr;
  }
  return null;
};

const getBluetoothPermissions = (
  bluetoothOptions?: BluetoothOptions[],
): BluetoothPermissions[] | null => {
  if (deviceInfo.isIosPlatform) {
    return permissions.ios_custom.ACCESS_BLUETOOTH.permission;
  } else if (deviceInfo.isAndroidPlatform) {
    const permissionArr: BluetoothPermissions[] =
      deviceInfo.androidVersion > 30
        ? [permissions.android.BLUETOOTH_SCAN]
        : [
            permissions.android.ACCESS_FINE_LOCATION,
            permissions.android.ACCESS_COARSE_LOCATION,
          ];
    const isValidOption =
      bluetoothOptions &&
      Array.isArray(bluetoothOptions) &&
      bluetoothOptions.length > 0;

    if (isValidOption) {
      bluetoothOptions.forEach(option => {
        if (option === 'communicate' && deviceInfo.androidVersion > 30) {
          permissionArr.push(permissions.android.BLUETOOTH_CONNECT);
        } else if (
          option === 'public-visibility' &&
          deviceInfo.androidVersion > 30
        ) {
          permissionArr.push(permissions.android.BLUETOOTH_ADVERTISE);
        } else if (option === 'background-communicate') {
          permissionArr.push(permissions.android.ACCESS_BACKGROUND_LOCATION);
        }
      });
    }
    return permissionArr;
  }
  return null;
};

export const getPlatformPermission = (
  permisionName: PermissionsNameKey,
  options?: PlatformPermissionOptions,
) => {
  const {mediaGranularPermissions, bluetoothOptions} = options || {};
  switch (permisionName) {
    case 'camera':
      return deviceInfo.isAndroidPlatform
        ? permissions.android.CAMERA
        : deviceInfo.isIosPlatform
        ? permissions.ios.CAMERA
        : null;

    case 'microphone':
      return deviceInfo.isAndroidPlatform
        ? permissions.android.RECORD_AUDIO
        : deviceInfo.isIosPlatform
        ? permissions.ios.MICROPHONE
        : null;

    case 'foreground_location':
      return deviceInfo.isAndroidPlatform
        ? permissions.android_custom.ACCESS_FOREGROUND_LOCATION.permission
        : deviceInfo.isIosPlatform
        ? permissions.ios.LOCATION_WHEN_IN_USE
        : null;

    case 'background_location':
      return deviceInfo.isAndroidPlatform
        ? permissions.android.ACCESS_BACKGROUND_LOCATION
        : deviceInfo.isIosPlatform
        ? permissions.ios.LOCATION_WHEN_IN_USE
        : null;

    case 'calender':
      return deviceInfo.isAndroidPlatform
        ? permissions.android_custom.ACCESS_CALENDAR.permission
        : deviceInfo.isIosPlatform
        ? permissions.ios_custom.ACCESS_CALENDAR.permission
        : null;

    case 'remainders':
      return deviceInfo.isIosPlatform ? permissions.ios.REMINDERS : null;

    case 'cellular':
      return deviceInfo.isAndroidPlatform
        ? permissions.android.READ_PHONE_STATE
        : null;

    case 'contact':
      return deviceInfo.isAndroidPlatform
        ? permissions.android_custom.ACCESS_CONTACT.permission
        : deviceInfo.isIosPlatform
        ? permissions.ios.CONTACTS
        : null;

    case 'motion':
      return deviceInfo.isIosPlatform ? permissions.ios.MOTION : null;
    case 'media':
      return getMediaPermissions(mediaGranularPermissions);
    case 'bluetooth':
      return getBluetoothPermissions(bluetoothOptions);
    default:
      return null;
  }
};

export type PermissionsGroupValue = ReturnType<typeof getPlatformPermission>;

const formatPermissionStatus = (
  rawStatus: Record<Permission, PermissionStatus>,
  permissionRef: PermissionRef,
) => {
  const formatStatus = (status: PermissionStatus, name: string) => {
    const formattedStatus = {
      permissionName: name,
      canAskAgain: false,
      granted: false,
      status: status,
    } as FormattedStatus;

    switch (status) {
      case RESULTS.UNAVAILABLE:
        break;
      case RESULTS.DENIED:
        formattedStatus.canAskAgain = true;
        break;
      case RESULTS.LIMITED:
        formattedStatus.canAskAgain = true;
        formattedStatus.granted = true;
        formattedStatus.scope = permissionScope.limited;
        break;
      case RESULTS.GRANTED:
        formattedStatus.granted = true;
        formattedStatus.scope = permissionScope.all;
        break;
      case RESULTS.BLOCKED:
        break;
      default:
        formattedStatus.canAskAgain = true;
        formattedStatus.status = permissions.status.UNKNOWN;
    }
    return formattedStatus;
  };

  if (
    typeof rawStatus === 'object' &&
    rawStatus !== null &&
    rawStatus.constructor === Object
  ) {
    let entry: Permission;
    const status = {} as PermissionResponse;
    for (entry in rawStatus) {
      const value = rawStatus[entry];
      const permisionGrpName = permissionRef[entry];
      if (permisionGrpName) {
        const name = permissionName.permissionName(entry);
        if (status[permisionGrpName] === undefined) {
          status[permisionGrpName] = [];
        }
        status[permisionGrpName].push(formatStatus(value, name));
      }
    }
    return status;
  }
  return null;
};

const permissionError = (
  permissionArr: Permission[],
  permissionRef: PermissionRef,
  err: Error,
) => {
  return permissionArr.reduce((acc, permission) => {
    const permissionGrpName = permissionRef[permission];
    const name = permissionName.permissionName(permission);
    if (acc[permissionGrpName] === undefined) {
      acc[permissionGrpName] = [];
    }
    acc[permissionGrpName].push({
      status: permissions.status.FAILED,
      canAskAgain: true,
      granted: false,
      permissionName: name,
    });
    return acc;
  }, {} as PermissionResponse);
};

export const isValidPermissionFormat = (permissions: Permission[]) => {
  const isValid = Array.isArray(permissions) && permissions.length > 0;
  return isValid;
};

export const checkPermission = async (
  permission: Permission[],
  permissionRef: PermissionRef,
) => {
  try {
    if (!isValidPermissionFormat(permission)) {
      return Promise.resolve(null);
    }
    if (permission.length > 1) {
      const status = await checkMultiple(permission);
      return formatPermissionStatus(status, permissionRef);
    } else {
      const status = await check(permission[0]);
      const permisionName = permission[0] as Permission;
      return formatPermissionStatus(
        {[permisionName]: status} as Record<Permission, PermissionStatus>,
        permissionRef,
      );
    }
  } catch (err) {
    return permissionError(permission, permissionRef, err as any);
  }
};

export const requestPermission = async (
  permission: Permission[],
  permissionRef: PermissionRef,
) => {
  try {
    if (!isValidPermissionFormat(permission)) {
      return Promise.resolve(null);
    }
    if (permission.length > 1) {
      const status = await requestMultiple(permission);
      return formatPermissionStatus(status, permissionRef);
    } else {
      const status = await request(permission[0]);
      const permisionName = permission[0] as Permission;
      return formatPermissionStatus(
        {[permisionName]: status} as Record<Permission, PermissionStatus>,
        permissionRef,
      );
    }
  } catch (err) {
    return permissionError(permission, permissionRef, err as any);
  }
};

function permissionFilterFunc(
  permissions: FormattedStatus[],
  callbackOptions: {
    grantedPermsnNamDuringProcesing?: string;
    scopeOptionsFrOneSucsCond?: {[x: string]: string};
    filterConditionCb: (status: FormattedStatus, index?: number) => boolean;
    processFiltered?: ProcessFilterCb;
  },
) {
  if (!Array.isArray(permissions)) return permissions;
  const {
    filterConditionCb,
    processFiltered,
    scopeOptionsFrOneSucsCond,
    grantedPermsnNamDuringProcesing,
  } = callbackOptions;
  const filtered = permissions.filter(filterConditionCb);
  if (
    typeof processFiltered === 'function' &&
    typeof scopeOptionsFrOneSucsCond === 'object' &&
    scopeOptionsFrOneSucsCond !== null &&
    typeof grantedPermsnNamDuringProcesing === 'string'
  ) {
    return processFiltered(filtered, {
      grantedPermissionName: grantedPermsnNamDuringProcesing,
      scopeOptionsFrOneSucsCond,
    });
  }
  return filtered;
}

function filterPermissions(
  permissionArr: FormattedStatus[],
  options: {
    scope: string;
    grantedPermsnNamDuringProcesing: string;
    scopeOptionsFrOneSucsCond: {[x: string]: string};
    filterConditionCb: (status: FormattedStatus) => boolean;
  },
) {
  const {
    scope,
    grantedPermsnNamDuringProcesing,
    scopeOptionsFrOneSucsCond,
    filterConditionCb,
  } = options;

  const processFiltered = (
    filtererd: FormattedStatus[],
    options: {
      grantedPermissionName: string;
      scopeOptionsFrOneSucsCond: {[x: string]: string};
    },
  ) => {
    const {grantedPermissionName, scopeOptionsFrOneSucsCond = {}} = options;
    if (filtererd.length > 0) {
      if (filtererd.length === permissionArr.length) {
        const [firstPermission] = filtererd;
        firstPermission.permissionName = grantedPermissionName;
        firstPermission.scope = scope;
        return [firstPermission];
      }
      filtererd.forEach(status => {
        const scope =
          scopeOptionsFrOneSucsCond[status.permissionName] ||
          scopeOptionsFrOneSucsCond.default ||
          null;
        if (scope) {
          status.scope = scope;
        }
      });
      return filtererd;
    }
    return filtererd;
  };

  return permissionFilterFunc(permissionArr, {
    grantedPermsnNamDuringProcesing,
    scopeOptionsFrOneSucsCond,
    filterConditionCb,
    processFiltered,
  });
}

const processDiffenPermissionCond = (
  permissionStatus: FormattedStatus[],
  options: {
    acceptedScopeName: string;
    rejectedScopeName: string;
    permissionGrpName: string;
    scopeOptionsFrOneSucsCond: {[x: string]: string};
  },
) => {
  const {
    acceptedScopeName,
    rejectedScopeName,
    permissionGrpName,
    scopeOptionsFrOneSucsCond,
  } = options;
  const grantedPermissions = filterPermissions(permissionStatus, {
    scope: acceptedScopeName,
    grantedPermsnNamDuringProcesing: permissionGrpName,
    scopeOptionsFrOneSucsCond,
    filterConditionCb: (permission: FormattedStatus) => permission.granted,
  });
  if (grantedPermissions.length > 0) return grantedPermissions;
  const canAskAgainPermissions = filterPermissions(permissionStatus, {
    scope: rejectedScopeName,
    grantedPermsnNamDuringProcesing: permissionGrpName,
    scopeOptionsFrOneSucsCond,
    filterConditionCb: (permission: FormattedStatus) => permission.canAskAgain,
  });
  if (canAskAgainPermissions.length > 0) return canAskAgainPermissions;
  const [firstPermission] = permissionStatus;
  firstPermission.permissionName = permissionGrpName;
  firstPermission.scope = rejectedScopeName;
  return [firstPermission];
};

const multiToSinglePermissionsHelper = (
  permissionsStatus: PermissionResponse,
  permissionKeyName: PermissionsNameKey,
  helper: (permissionResponse: FormattedStatus[]) => FormattedStatus[],
) => {
  const permissionResponse = permissionsStatus[permissionKeyName];
  if (!permissionResponse) return permissionResponse;
  if (!Array.isArray(permissionResponse)) {
    return permissionResponse;
  }
  if (permissionResponse.length < 2) return permissionResponse;
  return helper(permissionResponse);
};

export const multiPermissionHelper = (options: {
  permissionsStatus: PermissionResponse;
  permissionKeyName: PermissionsNameKey;
}): FormattedStatus[] => {
  const {permissionsStatus, permissionKeyName} = options;
  const config =
    availablePermissions[permissionKeyName] &&
    availablePermissions[permissionKeyName].multiToSingleConfig;

  if (!config) {
    return permissionsStatus[permissionKeyName];
  }

  return multiToSinglePermissionsHelper(
    permissionsStatus,
    permissionKeyName,
    (status: FormattedStatus[]) => processDiffenPermissionCond(status, config),
  );
};
