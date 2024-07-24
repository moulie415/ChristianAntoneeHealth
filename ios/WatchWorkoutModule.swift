import ObjectiveC
import Foundation
import HealthKit

@available(iOS 17.0, *)
@objc(WatchWorkoutModule)
class WatchWorkoutModule: NSObject, HKWorkoutSessionDelegate {
  private var store: HKHealthStore?
  private var session: HKWorkoutSession?

  override init() {
    super.init()
    self.store = HKHealthStore()
    self.store?.workoutSessionMirroringStartHandler = { [weak self] mirroredSession in
      guard let self = self else { return }
      self.session = mirroredSession
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
      reject("SESSION_ERROR", "No active workout session found", nil)
      return
    }

    Task {
      do {
        session.end()
        let workoutData = try await fetchWorkoutData(from: session)
        resolve(workoutData)
      } catch {
        reject("END_WORKOUT_ERROR", "An error occurred while ending the workout session: \(error.localizedDescription)", error)
      }
    }
  }

  private func fetchWorkoutData(from session: HKWorkoutSession) async throws -> [String: Any] {
    var workoutData = [String: Any]()

    let predicate = HKQuery.predicateForSamples(withStart: session.startDate, end: session.endDate, options: .strictStartDate)

    if let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
      let energySamples = try await fetchSamples(for: energyType, predicate: predicate)
      workoutData["energySamples"] = energySamples.map { sample in
        return [
          "value": sample.quantity.doubleValue(for: .kilocalorie()),
          "startDate": sample.startDate.ISO8601Format(),
          "endDate": sample.endDate.ISO8601Format()
          
        ]
      }
    }

    if let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) {
      let heartRateSamples = try await fetchSamples(for: heartRateType, predicate: predicate)
      workoutData["heartRateSamples"] = heartRateSamples.map { sample in
        return [
          "value": sample.quantity.doubleValue(for: HKUnit(from: "count/min")),
          "startDate": sample.startDate.ISO8601Format(),
          "endDate": sample.endDate.ISO8601Format()
        ]
      }
    }

    return workoutData
  }

  private func fetchSamples(for type: HKQuantityType, predicate: NSPredicate) async throws -> [HKQuantitySample] {
    return try await withCheckedThrowingContinuation { continuation in
      let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, results, error in
        if let error = error {
          continuation.resume(throwing: error)
        } else {
          continuation.resume(returning: results as? [HKQuantitySample] ?? [])
        }
      }
      store?.execute(query)
    }
  }

  func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
    // Handle state change if needed
  }

  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
    // Handle error if needed
  }
}
