//
//  InterfaceController.swift
//  WatchApp WatchKit Extension
//
//  Created by Henry Moule on 26/05/2022.
//
import WatchKit
import Foundation
import WatchConnectivity
import HealthKit


class Connectivity: NSObject, WCSessionDelegate, HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate, WKApplicationDelegate {

  var session: WCSession?
  var builder: HKLiveWorkoutBuilder?
  var workoutSession: HKWorkoutSession?

  init(session: WCSession = .default) {
    super.init()
    if WCSession.isSupported() {
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
      if let context = self.session?.applicationContext {
        getGoalDataFromContext(applicationContext: context)
      }
    }
  }
  
  func handle(_ workoutConfiguration: HKWorkoutConfiguration) {
        Task {
            await startWorkout()
        }
    }

  
  
  // Called when the activation of a session finishes
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if let error = error {
          print("WCSession activation failed with error: \(error.localizedDescription)")
          return
      }
      print("WCSession activated with state: \(activationState.rawValue)")
  }

  // Called when an immediate message arrives
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    // if (message["startQuickRoutine"] != nil || message["startWorkout"] != nil) {
    //   startWorkout();
    // }

    // if (message["endQuickRoutine"] != nil || message["endWorkout"] != nil) {
    //   endWorkout();
    // }
    
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
  
  func startWorkout() async {
      let store = HKHealthStore()
      let configuration = HKWorkoutConfiguration()
      configuration.activityType = .functionalStrengthTraining
      configuration.locationType = .unknown


      let session: HKWorkoutSession
      do {
          session = try HKWorkoutSession(healthStore: store,
                                         configuration: configuration)
      } catch {
          // Handle failure here.
          fatalError("*** An error occurred: \(error.localizedDescription) ***")
      }


      let builder = session.associatedWorkoutBuilder()


      let source = HKLiveWorkoutDataSource(healthStore: store,
                                           workoutConfiguration: configuration)


      source.enableCollection(for: HKQuantityType(.stepCount), predicate: nil)
      builder.dataSource = source


      session.delegate = self
      builder.delegate = self


      self.workoutSession = session
      self.builder = builder


      let start = Date()


      // Start the mirrored session on the companion iPhone.
      do {
        if #available(watchOSApplicationExtension 10.0, *) {
          try await session.startMirroringToCompanionDevice()
        } else {
          // Fallback on earlier versions
        }
      }
      catch {
          fatalError("*** Unable to start the mirrored workout: \(error.localizedDescription) ***")
      }


      // Start the workout session.
      session.startActivity(with: start)


      do {
          try await builder.beginCollection(at: start)
      } catch {
          // Handle the error here.
          fatalError("*** An error occurred while starting the workout: \(error.localizedDescription) ***")
      }


    }
  
//  func startWorkout() {
//    if HKHealthStore.isHealthDataAvailable() {
//      let typesToShare: Set = [
//        HKQuantityType.workoutType()
//      ]
//      let typesToRead: Set = [
//        HKQuantityType.quantityType(forIdentifier: .heartRate)!,
//        HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)!,
//      ]
//      
//      let healthStore = HKHealthStore()
//      
//      healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { (success, error) in
//        if (success) {
//          
//          let configuration = HKWorkoutConfiguration()
//          configuration.activityType = .functionalStrengthTraining;
//          configuration.locationType = .unknown;
//          
//          do {
//            self.workoutSession = try HKWorkoutSession(healthStore: healthStore, configuration: configuration);
//            self.workoutSession?.delegate = self;
//            self.builder = self.workoutSession?.associatedWorkoutBuilder();
//            self.builder?.delegate = self;
//            self.builder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore,
//                                                         workoutConfiguration: configuration);
//            self.workoutSession?.startActivity(with: Date())
//            self.builder?.beginCollection(withStart: Date()) { (success, error) in
//              
//              guard success else {
//                return;
//              }
//                // Indicate that the session has started.
//              DispatchQueue.main.async() {
//                // Update the user interface.
//              }
//            }
//          } catch {
//              // Handle failure here.
//              return
//          }
//          
//        }
//      }
//    }
//
//  }
  
  func endWorkout() {
    self.workoutSession?.end();
    self.builder?.endCollection(withEnd: Date()) { (success, error) in
        
        guard success else {
          return;
        }
        
      self.builder?.finishWorkout { (workout, error) in
            
            guard workout != nil else {
              return;
            }
            
            DispatchQueue.main.async() {
                // Update the user interface.
            }
        }
    }
  }
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: any Error) {
  }
  
  func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
  }
  
  func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
      for type in collectedTypes {
          guard let quantityType = type as? HKQuantityType else {
              return // Nothing to do.
          }
          
          // Calculate statistics for the type.
          let statistics = workoutBuilder.statistics(for: quantityType)
          
          DispatchQueue.main.async() {
              // Update the user interface.
          }
      }
  }
  
  func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {
      
      let lastEvent = workoutBuilder.workoutEvents.last
      
      DispatchQueue.main.async() {
          // Update the user interface here.
      }
  }


}

