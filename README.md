
# Getting Started
 To use this template, please use the following steps:

 ## Step 1: 
 ```bash
  npx @react-native-community/cli init MyApp --template https://github.com/kuljitsingh-crypto/react-native-template
 ```

## Step 2: 
#### yarn

 ```bash
 yarn install
 ```

### npm 
 ```bash
 npm install
 ```

**Note:** For iOS using cocoapods, run:
```bash
 cd ios/ && pod install
```
then 
Run Following command in your terminal
```bash
yarn run android
```
or 

```bash
yarn run ios
```

# Permission

To request permission in your app there is some pre added `permissions`. This can be found in `src/hooks/permission`. To make this function work correctly, you need to add/uncomment corresponding permission in `AndroidManifest.Xml` (for `Android`) and `Info.plist` , `Podfile` (for `IOS`)

# Expo
This template support `Expo Packages`. To install  `Expo Package`, you have to follow expo's bare workflow.

Here is [Expo's github Link](https://github.com/expo/expo/tree/sdk-51/packages) to see installation instruction for `bare react-native follow`.


# Enviroment Variable

You can add your enviroment variable by creating .env file (if not exists) and add your name-value pair.
Access variable in your app, by `process.env.VAR_NAME`


# Deep Link
To handle the `deep link` in your app then you need to uncomment `deep link` part in `AndroidManifest.xml` file  for `Android` and `AppDelegate.mm` file for `IOS`. If your app targeting for `Universal Links` then for `IOS` you need to uncomment `Universal Links` part in `AppDelegate.mm` file.

Finally, you need to update `processDeepLinkByPathName` function of `deepLinkSlice.ts` as per your custom implementation for the deep link.


# Firebase

To use Firebase in your App, see the link  https://rnfirebase.io/


# Google Sign in

First install this package 
```bash
yarn add @react-native-google-signin/google-signin
```

or 

```bash
npm install @react-native-google-signin/google-signin
```

**Note:** For iOS using cocoapods, run:
```bash
 cd ios/ && pod install
```

Create `GOOGLE_APP_ID` in your `.env` file and add your google client id value, from Google Cloud Console, in it. You need to restart your server and rebuld your app after that.

**Note:** To use `Google Login` in your app, you have to create `OAUTH Token` for three devices `Android`, `IOS` and `Web`.
`Web` Client is used to login With Google, so during `Web OAUTH Token` creation do not provide any `redirect URI` and `Domain`, leave blank. 


### For IOS

* Step 1:  Open the `info.plist` , add string values  for `IOS_REVERSED_CLIENT_ID`. To obtain `IOS_REVERSED_CLIENT_ID`, go to the Google Cloud Console and copy the `"iOS URL scheme"` from your iOS client in the "OAuth 2.0 Client IDs" section or you can download the client id in  json and copy the `IOS_REVERSED_CLIENT_ID` from josn file


* Step 2:
1. Open `AppDelegate.m`
2. uncomment `#import <GoogleSignIn/GoogleSignIn.h>`
3. To  respond to the URL scheme, you need to uncomment part saying  about `Google Login`.


### For Android

**Note:** To Create a Google Token For `Android`, you have to provide `Sha1  certificate`. 
For `Development`:  you get this from 
```bash
cd android
./gradlew signingReport
```
Choose from `Task:app`

For `Production`: yor have to go to your `Play Store Console` to obtain the SHA-1 certificate fingerprint from `Release` > `Setup` > `App Integrity` > `App` signing key certificate


**Without Firebase** 
You don't need to do any more modifications.

**With Firebase**
visit https://react-native-google-signin.github.io/docs/setting-up/android

For more information on `Google Login` visit https://react-native-google-signin.github.io/docs/install



# Facebook Login

First install this package 
```bash
yarn add react-native-fbsdk-next
```

or 

```bash
npm install react-native-fbsdk-next
```

**Note:** For iOS using cocoapods, run:
```bash
 cd ios/ && pod install
```


Create `FACEBOOK_APP_ID` in your `.env` file and add your google client id value, from Meta developers, in it.You need to restart your server and rebuld your app after that. 

**Note:** Client Token value found under `Settings` > `Advanced` > `Client Token` in your App Dashboard. 


### For IOS

* Step 1: Open Info.plist, add string values  for `fbAPP-ID`. Also uncomment `FacebookAppID`,`FacebookClientToken`  and `FacebookDisplayName` and add appropriate string values. Here ,`fbApp-ID` is  `fbAPP-FacebookAppID`


* Step 2: 
1. Open `AppDelegate.m` and uncomment the section which tells you to uncomment for the `Facebook Login`.
2. After this step, if you run into this `build` issue: `Undefined symbols for architecture x86_64:`, then you need to create a new file `File.swift` on your project folder. After doing this, you will get a prompt from `Xcode` asking if you would like to create a `Bridging Header`. Click accept.



### For Android:

* Step 1: Uncomment the line with `FB_APP_ID` and `FB_CLIENT_TOKEN` in `app/res/values/strings.xml` and appropriate values there.

* Step 2: Uncomment meta data elements in  `/app/manifests/AndroidManifest.xml` saying about `Facebook Login`

* Step3: In addition, keep in mind that you have to point the Key Hash generation command at your app's `debug.keystore` file.  To add Key hash, 
For `development`: To get sha-1 
```bash
cd android/ && ./gradlew signingReport
```
Choose from `Task:app`

For `production`: To get sha-1 go to your `Play Store Console` to obtain the SHA-1 certificate fingerprint from `Release` > `Setup` > `App Integrity` > `App signing key certificate.`

 * Then, convert the value of the [Hex value of the certificate to Base64](https://base64.guru/converter/encode/hex) and add it under the `Android` > `Key hashes` in your Facebook project.


For more information on `Facebook Login` https://github.com/thebergamo/react-native-fbsdk-next


# Push Notification 

This module provides a comprehensive set of functions and utilities for handling push notifications in React Native applications. It supports both Android and iOS platforms and includes features for local notifications, remote notifications, and platform-specific customizations.

## Table of Contents

1. [Android-specific Functions](#android-specific-functions)
2. [iOS-specific Functions](#ios-specific-functions)
3. [Cross-platform Functions](#cross-platform-functions)
4. [Remote Notification Functions](#remote-notification-functions)
5. [Remote Notification Hooks](#remote-notification-hooks)
6. [NativePushNotification Class](#nativepushnotification-class)

## Android-specific Functions

### `androidPermissionStatus(settings: NotificationSettings)`
- Checks the authorization status for Android notifications.
- Returns an object with the permission status and Android-specific settings.

### `checkAndroidChannelPermission(channelId: string)`
- Checks the permission status of a specific Android notification channel.
- Returns the channel object if it exists, or null.

### `checkAndroidChannelGroupPermission()`
- Retrieves all Android notification channel groups.
- Returns an array of channel groups.

### `createAndroidNotificationChannel(channel: AndroidChannel)`
- Creates a new Android notification channel.
- Returns the channel ID.

### `createAndroidNotificationChannelGroup(channelGrp: AndroidChannelGroup)`
- Creates a new Android notification channel group.
- Returns the channel group ID.

### `deleteAndroidChannel(channelId: string)`
- Deletes an Android notification channel.

### `deleteAndroidChannelGroup(channelGrpId: string)`
- Deletes an Android notification channel group.

### `checkAndroidBackgroundRestriction(intl: IntlShape)`
- Checks for Android background restrictions and prompts the user to adjust settings if necessary.

## iOS-specific Functions

### `iosPermissionStatus(settings: NotificationSettings)`
- Checks the authorization status for iOS notifications.
- Returns an object with the permission status and iOS-specific settings.

### `updateIosNotificationBadgeCount(count: number)`
- Updates the iOS app badge count.
- Returns the new badge count.

### `getIosNotificationBadgeCount()`
- Retrieves the current iOS app badge count.

### `deleteIosNotificationBadgeCount()`
- Resets the iOS app badge count to zero.

### `setIosNotificationCategory(categoryOptions: IOSNotificationCategory[])`
- Sets iOS notification categories.

## Cross-platform Functions

### `checkPushNotificationPermission()`
- Checks the push notification permission status for both Android and iOS.
- Returns an object with the permission status and platform-specific settings.

### `requestPushNotificationPermission()`
- Requests push notification permissions for both Android and iOS.
- Returns an object with the updated permission status and platform-specific settings.

### `displayPushNotification(params: NotificationDisplayParams)`
- Displays a push notification on the device.
- Returns an object with the notification ID.

### `cancelPushNotification(notificationId: string)`
- Cancels a specific push notification.

### `createTriggerNotification(params: TriggerNotificationParams)`
- Creates a trigger notification that will be displayed at a specific time or interval.
- Returns an object with the notification ID.

### `getTriggerNotificationIds()`
- Retrieves the IDs of all scheduled trigger notifications.

### `createProgressIndicatorNotification(params: ProgressIndicatorNotificationParams)`
- Creates a notification with a progress indicator (Android-specific, but works as a normal notification on iOS).
- Returns functions to update and complete the progress.

### `createForegroundServiceNotification(params: ForegroundServiceNotificationParams)`
- Creates a foreground service notification (Android-specific, but works as a normal notification on iOS).
- Returns a function to complete the service.

## Remote Notification Functions

### `getDeviceFCMToken()`
- Retrieves the Firebase Cloud Messaging (FCM) token for the device.

### `remoteForegroundNotificationEventHandler(messageHandler: RemoteMessageHandler)`
- Handles foreground remote notifications.

### `remoteBackgroundNotificationEventHandler(messageHandler: RemoteMessageHandler)`
- Handles background remote notifications.

## Remote Notification Hooks

### `useCheckPushNotificationPermission()`
- React hook to check push notification permissions.
- Returns the current permission status.

### `useRequestPushNotificationPermission()`
- React hook to request push notification permissions.
- Returns the updated permission status.

## NativePushNotification Class

The `NativePushNotification` class provides a centralized interface for managing push notifications. It includes the following properties and methods:

### Constants
- `AndroidPushNotificationImportance`
- `AndroidPushNotificationBadgeIconType`
- `AndroidPushNotificationVisibility`
- `AndroidNotificationStyle`
- `IOSInterruptionLevel`
- `TimestampRepeatFrequency`

### Properties
- `badgeCount`: Methods for managing iOS badge counts
- `category`: Methods for managing iOS notification categories
- `channel`: Methods for managing Android notification channels
- `channelGroup`: Methods for managing Android notification channel groups
- `notification`: Methods for managing notifications (show, delete, trigger, etc.)
- `eventHandler`: Methods for handling notification events
- `backgroundRestriction`: Methods for checking Android background restrictions

### Hooks
- `useCheckPushNotificationPermission`
- `useRequestPushNotificationPermission`

This class provides a comprehensive set of tools for working with push notifications in React Native applications, supporting both Android and iOS platforms.

For More information see https://notifee.app/react-native/docs/installation and https://rnfirebase.io/

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
