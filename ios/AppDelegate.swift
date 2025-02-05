import UIKit
import RNCPushNotificationIOS
import GoogleSignIn
import react_native_splash_screen
import AVFAudio
import RNFBAppCheck
import React
import ReactAppDependencyProvider
import TSBackgroundFetch
import FBSDKCoreKit

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    
    TSBackgroundFetch.sharedInstance().didFinishLaunching();
    
    RNFBAppCheckModule.sharedInstance();
    
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
    
    let center = UNUserNotificationCenter.current()
    center.delegate = self
    
    ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    try? AVAudioSession.sharedInstance().setCategory(.ambient)
    
    self.moduleName = "ChristianAntoneeHealth"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    let didFinish = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    RNSplashScreen.show()

    return didFinish
  }
  
  
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegate.shared.application(application, open: url, options: options) ||
               GIDSignIn.sharedInstance.handle(url) ||
               RCTLinkingManager.application(application, open: url, options: options)
    }
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  
  func userNotificationCenter(
          _ center: UNUserNotificationCenter,
          willPresent notification: UNNotification,
          withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
      ) {
          completionHandler([.alert, .badge, .sound])
      }
      
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
          RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
      }
      
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
          RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(error)
      }
      
  override func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
          RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
      }
      
  override func application(_ application: UIApplication, didReceive notification: UILocalNotification) {
          RNCPushNotificationIOS.didReceive(notification)
      }
  
  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
      return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }


}
