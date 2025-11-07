//
//  watchApp.swift
//  watch Watch App
//
//  Created by Henry Moule on 07/11/2025.
//

import SwiftUI

@main
struct watch_Watch_AppApp: App {
  @WKApplicationDelegateAdaptor var appDelegate: Connectivity

    @SceneBuilder var body: some Scene {
      var _ = Singleton.instance

        WindowGroup {
            NavigationView {
             HomeView()
            }
        }
    }
}
