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
    
    let connectivity = Connectivity()
    var loggedIn: Bool = false
    
    @Published var goalData: GoalData? {
        didSet {
            saveGoalData() // Save the goalData whenever it's updated
        }
    }
    
    private let goalDataKey = "GoalData"
    
    private init() {
        loadGoalData() // Load the goalData when the Singleton instance is created
    }
    
    private func saveGoalData() {
        guard let data = try? JSONEncoder().encode(goalData) else {
            return
        }
        UserDefaults.standard.set(data, forKey: goalDataKey)
    }
    
    private func loadGoalData() {
        guard let data = UserDefaults.standard.data(forKey: goalDataKey),
              let loadedGoalData = try? JSONDecoder().decode(GoalData.self, from: data) else {
            return
        }
        goalData = loadedGoalData
    }
}
