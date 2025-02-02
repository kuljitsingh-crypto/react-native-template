import {Platform} from 'react-native';

const isIosPlatform = Platform.OS === 'ios' || Platform.OS === 'macos';
const isAndroidPlatform = Platform.OS === 'android';
const androidVersion = isAndroidPlatform
  ? parseFloat(Platform.Version.toString())
  : 0;
const iosVersion = isAndroidPlatform ? Platform.Version.toString() : '';

export const deviceInfo = {
  isAndroidPlatform,
  isIosPlatform,
  androidVersion,
  iosVersion,
  details: Platform.constants,
};
