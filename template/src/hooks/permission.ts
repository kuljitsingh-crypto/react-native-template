import {useEffect, useMemo, useRef, useState} from 'react';
import {
  PermissionRef,
  PermissionResponse,
  PermissionsGroupKey,
  PlatformPermissionOptionKeys,
  PlatformPermissionOptions,
  checkPermission,
  getPlatformPermission,
  isValidPermissionFormat,
  multiPermissionHelper,
  requestPermission,
} from '../utill';
import {Permission} from 'react-native-permissions';

const initializePermissions = (
  permissions: PermissionsGroupKey[],
  options?: PlatformPermissionOptions,
) => {
  const permissionRef = {} as PermissionRef;
  for (let key of permissions) {
    const permissionKeyName = typeof key === 'string' ? key : key.name;
    const permissionOption = typeof key === 'string' ? options : key?.options;
    const permission = getPlatformPermission(
      permissionKeyName,
      permissionOption,
    );
    if (Array.isArray(permission) && permission.length > 0) {
      for (let permissionName of permission) {
        permissionRef[permissionName] = permissionKeyName;
      }
    } else if (typeof permission === 'string' && permission) {
      permissionRef[permission] = permissionKeyName;
    }
  }
  return {
    permissionRef,
    permissions: Object.keys(permissionRef) as Permission[],
  };
};

const usePermissionHandler = (
  permissions: Permission[],
  permissionRef: PermissionRef,
) => {
  const isMounted = useRef(true);
  const [status, setStatus] = useState<PermissionResponse | null>(null);

  const customRequestPermission = () => {
    if (permissions.length > 0 && isMounted.current) {
      requestPermission(permissions, permissionRef).then(status => {
        setStatus(status);
      });
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      if (isValidPermissionFormat(permissions)) {
        checkPermission(permissions, permissionRef).then(status =>
          setStatus(status),
        );
      } else {
        setStatus(null);
      }
    }
  }, [permissions.length]);

  // Workaround for unmounting components receiving state updates
  useEffect(function didMount() {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {status, requestPermission: customRequestPermission};
};

const usePreparePermissionHandler = (
  permissions: PermissionsGroupKey[],
  options?: PlatformPermissionOptions,
) => {
  const permissionsObject = useRef<{
    permissions: PermissionsGroupKey[];
    permissionsName: Permission[];
    permissionRef: PermissionRef;
  } | null>(null);
  if (permissionsObject.current === null) {
    const {permissionRef, permissions: permissionsName} = initializePermissions(
      permissions,
      options,
    );
    permissionsObject.current = {
      permissions: permissions,
      permissionsName,
      permissionRef,
    };
  }
  const permissionNames = permissionsObject.current.permissionsName;
  const permissionRef = permissionsObject.current.permissionRef;
  const {status, requestPermission} = usePermissionHandler(
    permissionNames,
    permissionRef,
  );
  return {status, requestPermission};
};

const usePreparePermissionStatus = (
  status: PermissionResponse | null,
  options: {
    processName: PermissionsGroupKey | PermissionsGroupKey[];
  },
) => {
  const {processName} = options;

  const finalStatus = useMemo(() => {
    if (status === null) {
      return status;
    }
    const permissionNames = Array.isArray(processName)
      ? processName
      : [processName];
    const finalStatus = permissionNames.reduce((acc, name) => {
      const strName = typeof name === 'string' ? name : name?.name || null;
      if (strName) {
        acc[strName] = multiPermissionHelper({
          permissionsStatus: status,
          permissionKeyName: strName,
        });
      }
      return acc;
    }, {} as PermissionResponse);
    return finalStatus;
  }, [status]);

  return finalStatus;
};

type PermissionHandlerOptons<K extends PlatformPermissionOptionKeys = never> = {
  hasMultiplePlatformPermissions?: boolean;
  permissionOptions?: K[];
};

type SpecificPermissionOptions<K extends PlatformPermissionOptionKeys> = Pick<
  PlatformPermissionOptions,
  K
>;

function permissionHelper<K extends PlatformPermissionOptionKeys = never>(
  permissions: PermissionsGroupKey[],
  options?: PermissionHandlerOptons<K>,
) {
  const {hasMultiplePlatformPermissions, permissionOptions} = options || {};
  const hasPermissionOptions =
    permissionOptions &&
    Array.isArray(permissionOptions) &&
    permissionOptions.length > 0;

  const usePermission = () => {
    const {status, requestPermission} =
      usePreparePermissionHandler(permissions);

    const finalStatus = hasMultiplePlatformPermissions
      ? usePreparePermissionStatus(status, {processName: permissions})
      : status;

    return {status: finalStatus, requestPermission};
  };

  const usePermissionWithOptions = (options?: SpecificPermissionOptions<K>) => {
    const {status, requestPermission} = usePreparePermissionHandler(
      permissions,
      options,
    );

    const finalStatus = hasMultiplePlatformPermissions
      ? usePreparePermissionStatus(status, {processName: permissions})
      : status;

    return {status: finalStatus, requestPermission};
  };

  return hasPermissionOptions ? usePermissionWithOptions : usePermission;
}

export class PermissionHandler {
  static useCameraPermission = permissionHelper(['camera']);
  static useCameraWithAudioPermission = permissionHelper([
    'camera',
    'microphone',
  ]);
  static useForegroundLocationPermission = permissionHelper(
    ['foreground_location'],
    {hasMultiplePlatformPermissions: true},
  );
  static useBackgroundLocationPermission = permissionHelper([
    'background_location',
  ]);
  static useMicrophonePermission = permissionHelper(['microphone']);

  static useCalenderPermission = permissionHelper(['calender'], {
    hasMultiplePlatformPermissions: true,
  });

  static useRemainderPermission = permissionHelper(['remainders']);
  static useCellularPermission = permissionHelper(['cellular']);

  static useContactPermission = permissionHelper(['contact'], {
    hasMultiplePlatformPermissions: true,
  });

  static useMediaLibaryPermission = permissionHelper(['media'], {
    hasMultiplePlatformPermissions: true,
    permissionOptions: ['mediaGranularPermissions'],
  });

  static useBluetoothPermission = permissionHelper(['bluetooth'], {
    hasMultiplePlatformPermissions: true,
    permissionOptions: ['bluetoothOptions'],
  });

  static useMotionPermission = permissionHelper(['motion']);
}
