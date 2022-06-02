//
//  ContentView.swift
//  CA Health WatchKit Extension
//
//  Created by Henry Moule on 30/05/2022.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
//        Text("Hello, World!")
//            .padding()
//      List(1..<51) {
//          Text("\($0)")
//      }
//      .listStyle(.carousel)
      VStack {
        Image("logo")
          .resizable()
          .scaledToFit()
        NavigationLink(destination: EquipmentView()) {
          Text("Start Workout")
         
        }
        .background(
            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
        )
        .padding(.vertical)
        
//        Button(
//          action: {
//
//          },
//          label: {
//            Text("Start workout")
//          }
//        )
//        .background(
//            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
//        )
//        .padding(.vertical)
      }

    }
}

struct EquipmentView: View {
  init() {
    print(Singleton.instance.loggedIn)
  }
    var body: some View {
      VStack {
        Text("Equipment?")
        NavigationLink(destination: AreaView()) {
          Text("I've got a few bits")
        }
        .simultaneousGesture(TapGesture().onEnded{
          print("Hello world!")
        })
        .background(
            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
        )
        NavigationLink(destination: AreaView()) {
          Text("I've got access to a gym")
        }
        .simultaneousGesture(TapGesture().onEnded{
          print("Hello world!")
        })
        .background(
            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
        )
      }

    }
}

struct AreaView: View {
  init() {
    print(Singleton.instance.loggedIn)
  }
  var body: some View {
    VStack {
      Text("Area?")
      NavigationLink(destination: RoutinesView()) {
        Text("Upper body")
      }
      .simultaneousGesture(TapGesture().onEnded{
        print("Hello world!")
      })
      .background(
          RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
      )
      NavigationLink(destination: RoutinesView()) {
        Text("Lower body")
      }
      .simultaneousGesture(TapGesture().onEnded{
        print("Hello world!")
      })
      .background(
          RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
      )
      NavigationLink(destination: RoutinesView()) {
        Text("Full body")
      }
      .simultaneousGesture(TapGesture().onEnded{
        print("Hello world!")
      })
      .background(
          RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
      )
    }
  }
}

struct Routine : Identifiable {
  let id: String
  let name: String
}

struct RoutinesView: View {
  
  var body: some View {
    let routines: Array<Routine> = Singleton.instance.routines.map { routine in
      return Routine(id: routine["id"] as! String, name: routine["name"] as! String)
    }
    
    List(routines) { routine in
      Text(routine.name)
    }
  }
}



struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
//        EquipmentView()
//        AreaView()
    }
}
