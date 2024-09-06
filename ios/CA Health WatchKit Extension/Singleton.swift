import Foundation

struct Routine : Identifiable {
  let id: String
  let name: String
  let level: String
}

struct GoalData: Codable {
  let workoutLevelTitleString: String;
  let minsGoal: Int;
  let caloriesGoal: Int;
  let calories: Int;
  let workoutLevel: String;
  let workoutGoal: Int;
  let completed: Bool;
  let mins: Int;
  let workoutLevelScore: Int;
}

class Singleton: ObservableObject {
    static let instance = Singleton()
    
    var loggedIn: Bool = false
    
  @Published var goalData: GoalData = GoalData(workoutLevelTitleString: "", minsGoal: 150, caloriesGoal: 3500, calories: 0, workoutLevel: "", workoutGoal: 4, completed: false, mins: 0, workoutLevelScore: 0)
}
