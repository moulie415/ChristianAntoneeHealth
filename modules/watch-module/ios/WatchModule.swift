import ExpoModulesCore

@available(iOS 17.0, *)
public class WatchModule: Module {
  let workoutModule = WatchWorkout()
  public func definition() -> ModuleDefinition {

    Name("WatchModule")
    
    Function("startWatchWorkout") {
      workoutModule.startWatchWorkout()
    }

    Function("endWatchWorkout") {
      return workoutModule.endWatchWorkout()
    }
  }
}
