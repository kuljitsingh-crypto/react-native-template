
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

# Storage

There is two type of storage available in this template. 

## Local Storage

This Api provides a secure and convenient wrapper around `react-native-encrypted-storage` for storing and retrieving data. It supports serialization and deserialization of complex data types like `Date` objects, ensuring proper handling during storage and retrieval.



### Features

1. **Secure Data Storage**: Utilizes `react-native-encrypted-storage` for secure storage of sensitive data.
2. **Custom Serialization**: Handles `Date` objects during serialization to ensure data integrity.
3. **Type Safety**: Provides type definitions for common data types, making it easier to work with stored data.
4. **Error Handling**: Gracefully handles errors during storage and retrieval operations.


### API Reference

#### 1. `setItem`

Saves a key-value pair to the encrypted storage.

**Syntax**:  
```typescript
static async setItem<V extends ObjectType | unknown = ObjectType>(
  keyName: string,
  value: V
): Promise<boolean>;
```

- **`keyName`**: A string representing the key.
- **`value`**: The value to store (can be an object, array, string, number, boolean, `Date`, etc.).
- **Returns**: `true` if storage is successful, `false` otherwise.

---

#### 2. `getItem`

Retrieves the value associated with a key from the encrypted storage.

**Syntax**:  
```typescript
static async getItem<
  R extends LocalStorageReturnKeys | unknown = LocalStorageReturnKeys,
>(
  keyName: string
): Promise<R extends LocalStorageReturnKeys ? LocalStorageReturn[R] : R | null>;
```

- **`keyName`**: A string representing the key.
- **Returns**: The retrieved value (if found) or `null`.

---

#### 3. `removeItem`

Removes a key-value pair from the encrypted storage.

**Syntax**:  
```typescript
static async removeItem(keyName: string): Promise<boolean>;
```

- **`keyName`**: A string representing the key.
- **Returns**: `true` if removal is successful, `false` otherwise.

---

### Example Usage

```typescript
import { LocalStorage } from './LocalStorage';

// Save an item
await LocalStorage.setItem('user', {
  name: 'John Doe',
  age: 30,
  joinedAt: new Date(),
});

// Retrieve an item
const user = await LocalStorage.getItem('user');
console.log(user); // Output: { name: 'John Doe', age: 30, joinedAt: DateObject }

// Remove an item
const isRemoved = await LocalStorage.removeItem('user');
console.log(isRemoved); // Output: true
```

## Cloud Storage
It implements a **database abstraction layer** for cloud storage, designed for flexibility and scalability. It supports CRUD operations, transactions, querying, and relational data handling through an interface (`IDatabase`) and adapters like `FirebaseDatabase`. Here's a concise breakdown:


### **Key Components**
1. **`IDatabase` Interface:**
   - Defines standard methods like `create`, `find`, `update`, `delete`, and transaction support.

2. **`FirebaseDatabase` Implementation:**
   - Handles Firestore-specific logic while adhering to the `IDatabase` interface.

3. **`DatabaseAdapter` Class:**
   - Acts as a unified interface for interacting with the database, enabling easy swaps between database systems.

4. **Example Integration (`Paypal`):**
   - Demonstrates use cases like storing PayPal order details with the abstraction.


### **Features**
- **CRUD Operations:** Standard data management.
- **Query Support:** Complex filtering with operators like `==` and `array-contains`.
- **Transaction Handling:** Ensures atomic updates.
- **Database-Agnostic Design:** Easily switch between database implementations.



### **Benefits**
- **Scalable:** Supports adding new databases.
- **Reusable:** Encapsulated, maintainable logic.
- **Consistent:** Uniform interaction pattern for data operations.

This setup simplifies database management, starting with Firebase and extensible to other systems.


# Firebase

To use Firebase in your App, see the link  https://rnfirebase.io/

Here's a explanation of the methods and their functionality in the provided Firebase Class in the template:

### Cloud Messaging Methods:
1. **`registerDeviceForRemoteMessages`**:
   Ensures the device is registered for receiving remote push notifications, if enabled in the configuration.

2. **`getFCMToken`**:
   Retrieves the Firebase Cloud Messaging (FCM) token for the device, enabling it to receive push notifications.

3. **`onForegroundMessageReceived`**:
   Sets a handler to process notifications received while the app is in the foreground.

4. **`onBackgroundMessageReceived`**:
   Sets a handler to process notifications received while the app is in the background.

---

### Cloud Database Methods:
#### Data Retrieval
5. **`findByFieldPath`**:
   Fetches a single document by its Firestore path.

6. **`getRelatedFieldData`**:
   Retrieves a related document by its field path, if the field is a reference.

7. **`getRelatedFieldsData`**:
   Fetches and replaces related fields in a document with their respective data.

8. **`findById`**:
   Fetches a document by its collection name and ID. Supports populating related fields.

9. **`findOne`**:
   Finds a single document matching the specified query conditions.

10. **`find`**:
    Retrieves multiple documents matching the query. Supports pagination and metadata.

#### Data Manipulation
11. **`create`**:
    Adds a new document to a collection, with an optional ID.

12. **`findByIdAndUpdate`**:
    Updates a document by its ID.

13. **`findOneAndUpdate`**:
    Updates the first document that matches the query.

14. **`findByIdAndDelete`**:
    Deletes a document by its ID.

15. **`findOneAndDelete`**:
    Deletes the first document that matches the query.

16. **`countDocuments`**:
    Counts the number of documents matching a query.

17. **`updateMany`**:
    Updates all documents matching a query using a batch operation.

18. **`deleteMany`**:
    Deletes all documents matching a query using a batch operation.

19. **`insertMany`**:
    Adds multiple documents to a collection using a batch operation.

#### Transactions
20. **`updateTransaction`**:
    Executes an atomic update on a document within a transaction.

21. **`setTransaction`**:
    Replaces or creates a document atomically within a transaction.

22. **`deleteTransaction`**:
    Atomically deletes a document within a transaction based on a condition.

#### Field Utilities
23. **`FirestoreFieldActions`**:
    Provides utility actions like setting server time, incrementing values, or modifying arrays in a document.

24. **`FirestoreFieldTypes`**:
    Exposes Firestore-specific types such as `GeoPoint`,`Blob`, `Timestamp`, and `DocumentReference`.


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


