
# Getting Started
 To use this template, please use the following steps:

 ## Step 1: 
 ```bash
  npx react-native init MyApp --template https://github.com/kuljitsingh-crypto/react-native-template
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


## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
