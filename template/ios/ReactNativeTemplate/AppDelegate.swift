import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit

// Uncomment the below lines if you want to use Facebook Login
// import FacebookCore

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.moduleName = "ReactNativeTemplate"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  // ⬇️ Uncomment the following lines if you want to use Facebook Login,Google Login or custom Deep Link urls
  override func application(
    _ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {

    return
      // Uncomment for Facebook Login
      // ApplicationDelegate.shared.application(
      //   app,
      //   open: url,
      //   sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
      //   annotation: options[UIApplication.OpenURLOptionsKey.annotation]
      // ) ||

      // Uncomment for Google Login
      // GIDSignIn.sharedInstance.handle(url) ||

      // Uncomment for custom Deep Link urls
      // RCTLinkingManager.application(
      //   app,
      //   open: url,
      //   options: options
      // ) ||
      // iOS 8.x or older
      // RCTLinkingManager.application(
      //   app,
      //   open: url,
      //   sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
      //   annotation: options[UIApplication.OpenURLOptionsKey.annotation]
      // )||

      false

  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
