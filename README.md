
# Getting Started
 To use this Pre saved code, please use the following steps:

 ## Step 1: 
 ```bash
  npx @react-native-community/cli@latest init ProjectName
 ```

## Step 2: 
 ```bash
  git pull https://github.com/kuljitsingh-crypto/react-native-template.git --allow-unrelated-histories
 ```
After that you will get merged conflict on `App.tsx`, `index.js`, `.eslintrc.js` and `Readme.md`. For `App.tsx` ,`index.js` and `.eslintrc.js` accept the incoming one (if it is new project,else make sure both changes should present) and for `readme` accept current one.

## Step 3:

### Step up For Ios:
After cloning the project you will see folder named `ios_vector_icon_fonts` move the `Fonts` from there to inside `ios/projectName` and delete  `ios_vector_icon_fonts` folder.

Now Copy following lines and add inside info.plist file

```bash
<key>Fonts provided by application</key>
<array>
	<string>AntDesign.ttf</string>
	<string>Entypo.ttf</string>
	<string>EvilIcons.ttf</string>
	<string>Feather.ttf</string>
	<string>FontAwesome.ttf</string>
	<string>FontAwesome5_Brands.ttf</string>
	<string>FontAwesome5_Regular.ttf</string>
	<string>FontAwesome5_Solid.ttf</string>
	<string>FontAwesome6_Brands.ttf</string>
	<string>FontAwesome6_Regular.ttf</string>
	<string>FontAwesome6_Solid.ttf</string>
	<string>Fontisto.ttf</string>
	<string>Foundation.ttf</string>
	<string>Ionicons.ttf</string>
	<string>MaterialCommunityIcons.ttf</string>
	<string>MaterialIcons.ttf</string>
	<string>Octicons.ttf</string>
	<string>SimpleLineIcons.ttf</string>
	<string>Zocial.ttf</string>
</array> 
```
Update your podFile with the

#### Replace this 
```bash
 # Resolve react_native_pods.rb with node to allow for hoisting
 require Pod::Executable.execute_command('node', ['-p',
   'require.resolve(
     "react-native/scripts/react_native_pods.rb",
     {paths: [process.argv[1]]},
   )', __dir__]).strip
```
#### With  this

``` bash
# Transform this into a `node_require` generic function:
 def node_require(script)
   # Resolve script with node to allow for hoisting
   require Pod::Executable.execute_command('node', ['-p',
     "require.resolve(
       '#{script}',
       {paths: [process.argv[1]]},
     )", __dir__]).strip
 end

# Use it to require both react-native's and this package's scripts:
 node_require('react-native/scripts/react_native_pods.rb')
 node_require('react-native-permissions/scripts/setup.rb')
```

In the same `Podfile`, call `setup_permissions` with the permissions you need. Only the permissions specified here will be added

```bash
# ⬇️ uncomment the permissions you need
setup_permissions([
  # 'AppTrackingTransparency',
  # 'Bluetooth',
  # 'Calendars',
  # 'CalendarsWriteOnly',
  # 'Camera',
  # 'Contacts',
  # 'FaceID',
  # 'LocationAccuracy',
  # 'LocationAlways',
  # 'LocationWhenInUse',
  # 'MediaLibrary',
  # 'Microphone',
  # 'Motion',
  # 'Notifications',
  # 'PhotoLibrary',
  # 'PhotoLibraryAddOnly',
  # 'Reminders',
  # 'Siri',
  # 'SpeechRecognition',
  # 'StoreKit',
]) 
``` 
#### Google Sign in

* Step 1:  update the info.plist
create a new CFBundleURLTypes and  CFBundleURLSchemes if not exist or add new string values IOS_REVERSED_CLIENT_ID ,if exists
```bash
  <key>CFBundleURLTypes</key>
    <array>
    <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>IOS_REVERSED_CLIENT_ID </string>
    </array>
    </dict>
  </array> 
```
* Step 2:
1. Open `AppDelegate.m`
2. Add an import: #import <GoogleSignIn/GoogleSignIn.h>
3. Add a method to respond to the URL scheme. This is just an example of a method that you can add at the bottom of your file if you're using both FBSDKApplicationDelegate and GIDSignIn :

``` bash
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
   if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  return NO;
}
```
For more information on `Google Login` visit https://react-native-google-signin.github.io/docs/install

#### Facebook Login

* Step 1: Update Info.plist
create a new CFBundleURLTypes and  CFBundleURLSchemes if not exist or add new string values fbAPP-ID ,if exists
```bash
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>fbAPP-ID</string>
    </array>
    </dict>
  </array>
  <key>FacebookAppID</key>
  <string>APP-ID</string>
  <key>FacebookClientToken</key>
  <string>CLIENT-TOKEN</string>
  <key>FacebookDisplayName</key>
  <string>APP-NAME</string> 
```

* Step 2: 
1. Add following code in `ios/ProjectName/AppDelegate.m`
```bash
import <AuthenticationServices/AuthenticationServices.h>
import <SafariServices/SafariServices.h>
import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
```
2. Inside `didFinishLaunchingWithOptions` in `ios/ProjectName/AppDelegate.m`, add the following:
```bash
   [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];
```
3. After this step, if you run into this `build` issue: `Undefined symbols for architecture x86_64:`, then you need to create a new file `File.swift` on your project folder. After doing this, you will get a prompt from `Xcode` asking if you would like to create a `Bridging Header`. Click accept.

4. add code in `ios/ProjectName/AppDelegate.m`
```bash
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [[FBSDKApplicationDelegate sharedInstance]application:app
                                                      openURL:url
                                                      options:options];
}
```

**Note:** The `AppDelegate.m` file can only have one method for openUrl. If you're also using `RCTLinkingManager` to handle deep links, you should handle both results in your openUrl method.

``` bash
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
   if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}
```

For more information on `Facebook Login` https://github.com/thebergamo/react-native-fbsdk-next


### Step For Android:

Update your `android/app/build.gradle` `(NOT android/build.gradle)`

```bash
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle" 
```


Copy and paste permission your requrie in `AndroidManifest.xml`

```bash
     <!-- uncomment the permissions you need -->
    <!-- <uses-permission android:name="android.permission.ACCEPT_HANDOVER" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION" />
    <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
    <uses-permission android:name="com.android.voicemail.permission.ADD_VOICEMAIL" />
    <uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.BODY_SENSORS" />
    <uses-permission android:name="android.permission.BODY_SENSORS_BACKGROUND" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.GET_ACCOUNTS" />
    <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" />
    <uses-permission android:name="android.permission.READ_CALENDAR" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />
    <uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_SMS" />
    <uses-permission android:name="android.permission.RECEIVE_MMS" />
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <uses-permission android:name="android.permission.RECEIVE_WAP_PUSH" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.USE_SIP" />
    <uses-permission android:name="android.permission.UWB_RANGING" />
    <uses-permission android:name="android.permission.WRITE_CALENDAR" />
    <uses-permission android:name="android.permission.WRITE_CALL_LOG" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" /> -->
```

Edit  `MainActivity.kt` or `MainActivity.java` file which is located under `android/app/src/main/java/<your package name>/`.

#### Kotlin
```bash
class MainActivity: ReactActivity() {
  // ...
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
  // ...
}
```
#### Java
```bash
public class MainActivity extends ReactActivity {
  // ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // ...
}
```
and make sure to add the following import statement at the top of this file below your package statement:

```bash
import android.os.Bundle; 
```

#### Google Login

**Without Firebase** 
You don't need to do any more modifications.

**With Firebase**
visit https://react-native-google-signin.github.io/docs/setting-up/android

For more information on `Google Login` visit https://react-native-google-signin.github.io/docs/install


#### Facebook Login

* Step 1: Add following string values to ` /app/res/values/strings.xml`
```bash
<string name="facebook_app_id">APP-ID</string>
<string name="facebook_client_token">CLIENT-TOKEN</string>
```

* Step 2: Add following meta data elements to `/app/manifests/AndroidManifest.xml`

```bash
<application android:label="@string/app_name" ...>
    ...
    <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
    <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
    ...
</application>
```
* Step3: Add a `uses-permission` element to the `manifest` after the application element:

```bash
<uses-permission android:name="android.permission.INTERNET"/>
```

* Step4: In addition, keep in mind that you have to point the Key Hash generation command at your app's `debug.keystore` file.

TO generate your `Key Hash`

```bash
#On OS X, run:
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
#On Windows:
keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64
```
OR you can generate using 
```bash
$ cd android/ && ./gradlew signingReport
# Copy Sha1 Hex Code and convert it to base64 (using online tool,etc.,) and paste it into facebook
```

For more information on `Facebook Login` https://github.com/thebergamo/react-native-fbsdk-next


## Step 4
 Run Follwing from  terminal
 ```bash
 npx react-native-asset
 ```
 and 

#### npm
 ```bash
 npm i @react-native-cookies/cookies @react-navigation/native @react-navigation/native-stack @reduxjs/toolkit i18next native-form react-i18next react-native-config react-native-encrypted-storage react-native-permissions react-native-safe-area-context react-native-screens react-native-svg react-native-url-polyfill react-native-vector-icons react-redux @react-native-google-signin/google-signin  react-native-fbsdk-next
 ```
```bash
npm i @types/react-native-vector-icons @types/react-redux --save-dev
```
#### yarn
  ```bash
 yarn add @react-native-cookies/cookies @react-navigation/native @react-navigation/native-stack @reduxjs/toolkit i18next native-form react-i18next react-native-config react-native-encrypted-storage react-native-permissions react-native-safe-area-context react-native-screens react-native-svg react-native-url-polyfill react-native-vector-icons react-redux @react-native-google-signin/google-signin  react-native-fbsdk-next
 ```
 ```bash
 yarn add -D @types/react-native-vector-icons @types/react-redux 
 ```
**Note:** For iOS using cocoapods, run:
```bash
 cd ios/ && pod install
```

## Step 5
Run Following command in your terminal
```bash
npx react-native start
```
and 
```bash
yarn run android
```
or 

```bash
yarn run ios
```

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
