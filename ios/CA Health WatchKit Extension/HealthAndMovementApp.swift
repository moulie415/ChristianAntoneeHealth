//
//  HealthAndMovementApp.swift
//  CA Health WatchKit Extension
//
//  Created by Henry Moule on 30/05/2022.
//

import SwiftUI

@main
struct HealthAndMovementApp: App {

    @SceneBuilder var body: some Scene {
      var _ = Singleton.instance

        WindowGroup {
            NavigationView {
             HomeView()
            }
        }

        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
