import ObjectiveC
import Foundation
import HealthKit

struct CodableQuantitySample: Codable {
    let value: Double
    let startDate: String
    let endDate: String

  func toDictionary() -> [String: Any] {
          return [
              "value": self.value,
              "startDate": self.startDate,
              "endDate": self.endDate
          ]
      }
}

struct WorkoutData: Codable {
    var heartRateSamples: [CodableQuantitySample]
    var energySamples: [CodableQuantitySample]
  
  func toDictionary() -> [String: Any] {
          let heartRateDictionaries = heartRateSamples.map { $0.toDictionary() }
          let energyDictionaries = energySamples.map { $0.toDictionary() }
          
          return [
              "heartRateSamples": heartRateDictionaries,
              "energySamples": energyDictionaries
          ]
      }
}


@available(iOS 17.0, *)
@objc(WatchWorkoutModule)
class WatchWorkoutModule: NSObject, HKWorkoutSessionDelegate {
  private var store: HKHealthStore?
  private var session: HKWorkoutSession?
  private var workoutData = [String: Any]()
  
  override init() {
    super.init()
    self.store = HKHealthStore()
    self.store?.workoutSessionMirroringStartHandler = { [weak self] mirroredSession in
      guard let self = self else { return }
      self.session = mirroredSession
      
      self.session?.delegate = self
      
      print("Workout session mirroring started on iOS")
    }
  }
  
  @objc
  func startWatchWorkout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let configuration = HKWorkoutConfiguration()
    configuration.activityType = .functionalStrengthTraining
    configuration.locationType = .unknown
    
    guard let store = self.store else {
      reject("STORE_ERROR", "HealthStore is not initialized", nil)
      return
    }
    
    Task {
      do {
        try await store.startWatchApp(toHandle: configuration)
        print("Workout session started on the Watch")
        resolve("*** Workout Session Started ***")
      } catch {
        print("Failed to start workout session on the Watch: \(error.localizedDescription)")
        reject("START_WATCH_APP_ERROR", "An error occurred while starting a workout on Apple Watch: \(error.localizedDescription)", error)
      }
    }
  }
  
  @objc
  func endWatchWorkout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let session = self.session else {
      resolve(nil)
      return
    }
    resolve(self.workoutData)
    session.end()
    self.workoutData = [:]
  }
  

  
  func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
    print("workout session state change to: \(toState.rawValue)")
  }
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
    print("workout ssession failed with error: \(error.localizedDescription)")
  }
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didGenerate event: HKWorkoutEvent) {
    print("Workout session event generated: \(event.description)")
  }
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didDisconnectFromRemoteDeviceWithError error: (any Error)?) {
    print("Workout sesssion disconnected from remote device with error: \(error.debugDescription)")
  }
  
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didReceiveDataFromRemoteWorkoutSession data: [Data]) {
    for archivedData in data {
      do {
         let decoder = JSONDecoder()
         decoder.dateDecodingStrategy = .iso8601
         let workoutData = try decoder.decode(WorkoutData.self, from: archivedData)

         self.workoutData = workoutData.toDictionary()
       } catch {
           print("*** An error occurred while decoding the health data from the companion Watch: \(error.localizedDescription) ***")
       }
    }
  }
}
