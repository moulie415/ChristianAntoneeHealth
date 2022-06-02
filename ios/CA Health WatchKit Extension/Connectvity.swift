//
//  InterfaceController.swift
//  WatchApp WatchKit Extension
//
//  Created by Henry Moule on 26/05/2022.
//
import WatchKit
import Foundation
import WatchConnectivity


class Connectivity: NSObject, WCSessionDelegate {
  var session: WCSession?

  init(session: WCSession = .default){
    super.init()
    if WCSession.isSupported() {
        self.session = WCSession.default
        self.session?.delegate = self
        self.session?.activate()
      }
    }
  
  
  // Called when the activation of a session finishes
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    print("activated")
    self.session?.sendMessage(["isLoggedIn": true], replyHandler: { reply in
      if (reply["loggedIn"] != nil) {
        if (reply["loggedIn"] as! Int == 1) {
          let dict: Dictionary<String, Dictionary<String, Any>> = reply["routines"] as! Dictionary<String, Dictionary<String, Any>>
          self.convertQuickRoutines(dict: dict)
          Singleton.instance.loggedIn = true
          if (Singleton.instance.routines.isEmpty) {
            self.getQuickRoutines()
          }
        } else {
          Singleton.instance.loggedIn = false
        }
      }
    })
  }

  // Called when an immediate message arrives
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    print(message)
    if (message["loggedIn"] != nil) {
      if (message["loggedIn"] as! Int == 1) {
        let dict: Dictionary<String, Dictionary<String, Any>> = message["routines"] as! Dictionary<String, Dictionary<String, Any>>
        self.convertQuickRoutines(dict: dict)
        Singleton.instance.loggedIn = true
        if (Singleton.instance.routines.isEmpty) {
          self.getQuickRoutines()
        }
      } else {
        Singleton.instance.loggedIn = false
      }
    }
  }
  
  func convertQuickRoutines(dict: Dictionary<String, Dictionary<String, Any>>) {
    var arr = [Dictionary<String, Any>]()
    for (_, value) in dict{
      arr.append(value)
    }
    Singleton.instance.routines = arr.map { routine in
      return Routine(
        id: routine["id"] as! String,
        name: routine["name"] as! String,
        level: routine["level"] as! String
      )
    }
  }
  
  func getQuickRoutines() {
    self.session?.sendMessage(["getQuickRoutines" : true], replyHandler: { reply in
      let dict: Dictionary<String, Dictionary<String, Any>> = reply["routines"] as! Dictionary<String, Dictionary<String, Any>>
      self.convertQuickRoutines(dict: dict)
    })
  }

}
