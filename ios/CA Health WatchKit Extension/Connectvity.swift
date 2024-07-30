import WatchKit
import Foundation
import WatchConnectivity
import HealthKit

struct CodableQuantitySample: Codable {
    let value: Double
    let startDate: String
    let endDate: String

    init(from sample: HKQuantitySample) {
        let formatter = ISO8601DateFormatter()
        self.startDate = formatter.string(from: sample.startDate)
        self.endDate = formatter.string(from: sample.endDate)

        switch sample.quantityType {
        case HKQuantityType.quantityType(forIdentifier: .heartRate):
            self.value = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
        case HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned):
            self.value = sample.quantity.doubleValue(for: .kilocalorie())
        default:
            self.value = sample.quantity.doubleValue(for: HKUnit.count())
        }
    }
}

struct WorkoutData: Codable {
    var heartRateSamples: [CodableQuantitySample]
    var energySamples: [CodableQuantitySample]
}


class Connectivity: NSObject, WCSessionDelegate, HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate, WKApplicationDelegate  {

  
    
    var session: WCSession?
    var builder: HKLiveWorkoutBuilder?
    var workoutSession: HKWorkoutSession?
    let healthStore = HKHealthStore()


    override init() {
        super.init()
        
        if WCSession.isSupported() {
            self.session = WCSession.default
            self.session?.delegate = self
            self.session?.activate()
            if let context = self.session?.applicationContext {
              getGoalDataFromContext(applicationContext: context)
            }
        }
      
        requestHealthKitAuthorization()
    }
  
  private func requestHealthKitAuthorization() {
          let typesToShare: Set = [
              HKObjectType.workoutType()
          ]
          let typesToRead: Set = [
            HKQuantityType(.heartRate),
            HKQuantityType(.activeEnergyBurned),
            HKQuantityType(.distanceWalkingRunning),
            HKQuantityType.workoutType(),
            HKObjectType.activitySummaryType()
          ]
          
          healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
              if !success {
                  print("*** HealthKit authorization failed: \(error?.localizedDescription ?? "No error information") ***")
              }
          }
      }

    // Handle the incoming workout configuration
    func handle(_ workoutConfiguration: HKWorkoutConfiguration) {
        Task {
            await startWorkout(with: workoutConfiguration)
        }
    }
    
    func startWorkout(with configuration: HKWorkoutConfiguration) async {
        let store = HKHealthStore()
        
        do {
            workoutSession = try HKWorkoutSession(healthStore: store, configuration: configuration)
            builder = workoutSession?.associatedWorkoutBuilder()
            builder?.dataSource = HKLiveWorkoutDataSource(healthStore: store, workoutConfiguration: configuration)
            
            workoutSession?.delegate = self
            builder?.delegate = self
            
            let start = Date()
            
            // Start the mirrored session on the companion iPhone.
            if #available(watchOS 10.0, *) {
                try await workoutSession?.startMirroringToCompanionDevice()
            }
            
            workoutSession?.startActivity(with: start)
            
            try await builder?.beginCollection(at: start)
            
          DispatchQueue.main.async {
           NotificationCenter.default.post(name: Notification.Name("WorkoutStarted"), object: nil)
            }
        } catch {
            print("*** An error occurred: \(error.localizedDescription) ***")
        }
    }
  
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            print("WCSession activation failed with error: \(error.localizedDescription)")
            return
        }
        print("WCSession activated with state: \(activationState.rawValue)")
    }

    func session(_ session: WCSession, didReceiveApplicationContext context: [String: Any]) {
      getGoalDataFromContext(applicationContext: context)
    }
  
  func getGoalDataFromContext(applicationContext: [String: Any]) {
    if let goalDataDict = applicationContext["goalData"] as? [String: Any] {
      do {
        let jsonData = try JSONSerialization.data(withJSONObject: goalDataDict, options: [])
        let goalData = try JSONDecoder().decode(GoalData.self, from: jsonData)
        
        DispatchQueue.main.async {
          Singleton.instance.goalData = goalData
        }
      } catch {
        print("Failed to decode GoalData: \(error)")
      }
    }
    
  }
  
  func sendCollectedData() {
       collectHeartRateSamples { heartRateSamples in
           self.collectEnergySamples { energySamples in
               let codableHeartRateSamples = heartRateSamples.map { CodableQuantitySample(from: $0) }
               let codableEnergySamples = energySamples.map { CodableQuantitySample(from: $0) }
               let workoutData = WorkoutData(heartRateSamples: codableHeartRateSamples, energySamples: codableEnergySamples)
               if #available(watchOSApplicationExtension 10.0, *) {
                   Task {
                       do {
                           let encoder = JSONEncoder()
                           let data = try encoder.encode(workoutData)
                           try await self.workoutSession?.sendToRemoteWorkoutSession(data: data)
                       } catch {
                           print("*** An error occurred while sending the health data to the companion iPhone: \(error.localizedDescription) ***")
                       }
                   }
               }
           }
       }
   }
   
   func collectHeartRateSamples(completion: @escaping ([HKQuantitySample]) -> Void) {
       let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
       let startDate = workoutSession?.startDate ?? Date()
       
       let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date())
       let query = HKSampleQuery(sampleType: heartRateType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
           guard let samples = samples as? [HKQuantitySample], error == nil else {
               print("Error collecting heart rate samples: \(String(describing: error))")
               completion([])
               return
           }
           completion(samples)
       }
       healthStore.execute(query)
   }
   
   func collectEnergySamples(completion: @escaping ([HKQuantitySample]) -> Void) {
       let activeEnergyType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!
       let startDate = workoutSession?.startDate ?? Date()
       
       let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date())
       let query = HKSampleQuery(sampleType: activeEnergyType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
           guard let samples = samples as? [HKQuantitySample], error == nil else {
               print("Error collecting energy samples: \(String(describing: error))")
               completion([])
               return
           }
           completion(samples)
       }
       healthStore.execute(query)
   }
  
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
      if toState == .ended {
          DispatchQueue.main.async {
              NotificationCenter.default.post(name: Notification.Name("WorkoutEnded"), object: nil)
          }
      }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        // Handle session failure.
    }
  
  
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        // Handle data collection.
      sendCollectedData()
      
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {
        // Handle events.
      
    }
  
}
  

