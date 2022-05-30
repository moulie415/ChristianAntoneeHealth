//
//  Singleton.swift
//  WatchApp WatchKit Extension
//
//  Created by Henry Moule on 29/05/2022.
//

import Foundation

class Singleton {
  static let instance = Singleton()
  var loggedIn: Bool = false;
  var equipment: String?
  var area: String?
  var routines: NSDictionary?
}
