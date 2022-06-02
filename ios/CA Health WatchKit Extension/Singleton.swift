import Foundation

class Singleton {
  static let instance = Singleton()
  let connectivity = Connectivity()
  var loggedIn: Bool = false;
  var equipment: String?
  var area: String?
  var routines: Array<Dictionary<String, Any>> = []
}
