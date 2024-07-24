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
  let workoutGoal: String;
  let completed: Bool;
  let mins: Int;
  let workoutLevelScore: Int;
}

class Singleton: ObservableObject {
    static let instance = Singleton()
    
    var loggedIn: Bool = false
    
    @Published var goalData: GoalData? 
}
