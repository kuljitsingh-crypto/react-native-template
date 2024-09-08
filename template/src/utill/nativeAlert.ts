import {Alert, AlertButton, AlertOptions} from 'react-native';

export type NativeAlertButton = {
  text: AlertButton['text'];
  onPress: AlertButton['onPress'];
  iosOnly?: {
    isPreferred?: AlertButton['isPreferred'];
    style?: AlertButton['style'];
  };
};
type NativeAlertOptions = {
  title: string;
  desc: string;
  alertOptions?: {
    androidOnly?: {
      cancelable?: AlertOptions['cancelable'];
      onDismiss?: AlertOptions['onDismiss'];
    };
    iosOnly?: {
      userInterfaceStyle: AlertOptions['userInterfaceStyle'];
    };
  };
  button?:
    | {
        positive: NativeAlertButton;
      }
    | {
        positive: NativeAlertButton;
        negative: NativeAlertButton;
      }
    | {
        positive: NativeAlertButton;
        negative: NativeAlertButton;
        neutral: NativeAlertButton;
      };
};

export class NativeAlert {
  static #formatButtonAsPerNativeAlert = (button: NativeAlertButton) => {
    const {iosOnly, ...rest} = button;

    Object.assign(rest, iosOnly);
    return rest;
  };
  static show = (options: NativeAlertOptions) => {
    const {title, desc, alertOptions, button} = options;
    const nativeAlertOptions = {
      ...alertOptions?.androidOnly,
      ...alertOptions?.iosOnly,
    };
    const buttons = [];
    const buttonAny = button as
      | {
          positive?: NativeAlertButton;
          negative?: NativeAlertButton;
          neutral?: NativeAlertButton;
        }
      | undefined;
    if (buttonAny?.neutral) {
      buttons.push(
        NativeAlert.#formatButtonAsPerNativeAlert(buttonAny.neutral),
      );
    }
    if (buttonAny?.negative) {
      buttons.push(
        NativeAlert.#formatButtonAsPerNativeAlert(buttonAny.negative),
      );
    }
    if (buttonAny?.positive) {
      buttons.push(
        NativeAlert.#formatButtonAsPerNativeAlert(buttonAny.positive),
      );
    }
    Alert.alert(title, desc, buttons, nativeAlertOptions);
  };
}
