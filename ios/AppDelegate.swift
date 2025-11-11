import UIKit
import Expo
import GoogleSignIn
import react_native_splash_screen
import AVFAudio
import RNFBAppCheck
import React
import ReactAppDependencyProvider
import TSBackgroundFetch
import FBSDKCoreKit

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    TSBackgroundFetch.sharedInstance().didFinishLaunching();
    
    RNFBAppCheckModule.sharedInstance();
    
    FirebaseApp.configure()
    
    try? AVAudioSession.sharedInstance().setCategory(.ambient)
    
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    
    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)
    
    window = UIWindow(frame: UIScreen.main.bounds)
    
    factory.startReactNative(
      withModuleName: "ChristianAntoneeHealth",
      in: window,
      launchOptions: launchOptions
    )
    
    RNSplashScreen.show()
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return ApplicationDelegate.shared.application(application, open: url, options: options) ||
    GIDSignIn.sharedInstance.handle(url) ||
    RCTLinkingManager.application(application, open: url, options: options)
  }
  
  
  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
}



class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  
}
