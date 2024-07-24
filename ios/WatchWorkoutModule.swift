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
      // Ensure self is not nil
      guard let self = self else { return }

      // Save a reference to the workout session
      self.session = mirroredSession
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
        resolve("*** Workout Session Started ***")
      } catch {
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
        // End the workout session on the watch
        session.end()

        // Fetch workout data
        let workoutData = try await fetchWorkoutData(from: session)
        
        // Resolve the workout data to React Native
        resolve(workoutData)
      } catch {
        reject("END_WORKOUT_ERROR", "An error occurred while ending the workout session: \(error.localizedDescription)", error)
      }
    }
  }

  private func fetchWorkoutData(from session: HKWorkoutSession) async throws -> [String: Any] {
    var workoutData = [String: Any]()

    // Define the predicates
    let predicate = HKQuery.predicateForSamples(withStart: session.startDate, end: session.endDate, options: .strictStartDate)

    // Fetch total energy burned
    if let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) {
      let energySum = try await fetchStatistics(for: energyType, predicate: predicate, options: .cumulativeSum)
      let energyBurned = energySum?.sumQuantity()?.doubleValue(for: .kilocalorie())
      workoutData["energyBurned"] = energyBurned ?? 0.0
    }

    // Fetch heart rate data
    if let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) {
      let heartRateData = try await fetchSamples(for: heartRateType, predicate: predicate)
      let heartRateValues = heartRateData.map { $0.quantity.doubleValue(for: HKUnit(from: "count/min")) }
      workoutData["heartRateData"] = heartRateValues
    }

    return workoutData
  }

  private func fetchStatistics(for type: HKQuantityType, predicate: NSPredicate, options: HKStatisticsOptions) async throws -> HKStatistics? {
    return try await withCheckedThrowingContinuation { continuation in
      let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: options) { _, result, error in
        if let error = error {
          continuation.resume(throwing: error)
        } else {
          continuation.resume(returning: result)
        }
      }
      store?.execute(query)
    }
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

  // Implement the required delegate methods
  func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
    // Handle session state changes
  }

  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
    // Handle session failure
  }
}

