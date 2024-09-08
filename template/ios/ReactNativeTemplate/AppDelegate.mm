#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
// Uncomment the following line if you use remote push notiifcation using firebase and
// completed all the prerequisites for it.
// for more information see https://rnfirebase.io/
// #import <Firebase.h>

// Uncomment the below lines if you want to use Facebook Login
// import <AuthenticationServices/AuthenticationServices.h>
// import <SafariServices/SafariServices.h>
// import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>

// uncomment the below line when you're want to use Google Login
// #import <GoogleSignIn/GoogleSignIn.h>

// Uncomment the below line if you have custom deeplink urls
//#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ReactNativeTemplate";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

   // Uncomment the following line if you use remote push notiifcation using firebase and
  // completed all the prerequisites for it.
  // for more information see https://rnfirebase.io/
  // [FIRApp configure];

  //Uncomment the below line if you want to use Facebook Login
  // [[FBSDKApplicationDelegate sharedInstance] application:application
  //                      didFinishLaunchingWithOptions:launchOptions];


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{

  // Uncomment the below line if you want to use Facebook Login
  //  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
  //   return YES;
  // }

  // Uncomment the below line if you want to use Google Login
  // if ([GIDSignIn.sharedInstance handleURL:url]) {
  //   return YES;
  // }

  // Uncomment the below line if you have custom deeplink urls
  // if ([RCTLinkingManager application:app openURL:url options:options]) {
  //   return YES;
  // }

  return NO;
}

@end
