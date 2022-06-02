import Foundation

struct Routine : Identifiable {
  let id: String
  let name: String
  let level: String
}

class Singleton {
  static let instance = Singleton()
  let connectivity = Connectivity()
  var loggedIn: Bool = false;
  var equipment: String?
  var area: String?
  var routines: Array<Routine> = []
}
