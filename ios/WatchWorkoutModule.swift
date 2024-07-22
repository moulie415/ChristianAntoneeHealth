//
//  WatchWorkoutModule.swift
//  HealthAndMovement
//
//  Created by Henry Moule on 22/07/2024.
//

import ObjectiveC
import Foundation
import HealthKit


@objc(WatchWorkoutModule)
class WatchWorkoutModule : NSObject {
  @objc
  func startWatchApp(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let configuration = HKWorkoutConfiguration()
    configuration.activityType = .functionalStrengthTraining
    configuration.locationType = .unknown

    let store = HKHealthStore()
    
    Task {
      do {
        try await store.startWatchApp(toHandle: configuration)
        resolve("*** Workout Session Started ***")
      } catch {
        reject("START_WATCH_APP_ERROR", "An error occurred while starting a workout on Apple Watch: \(error.localizedDescription)", error)
      }
    }
  }
}
