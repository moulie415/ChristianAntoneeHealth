//
//  ContentView.swift
//  CA Health WatchKit Extension
//
//  Created by Henry Moule on 30/05/2022.
//

import SwiftUI

struct ContentView: View {
    var body: some View {

      VStack {
        Image("logo")
          .resizable()
          .scaledToFit()

        Text("Functionality coming soon")
          .padding(.vertical)
//        NavigationLink(destination: EquipmentView()) {
//          Text("Start Workout")
//
//        }
//        .background(
//            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
//        )
//        .padding(.vertical)
        
      }

    }
}

struct EquipmentView: View {
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

struct RoutinesView: View {
  
  var body: some View {

    List(Singleton.instance.routines) { routine in
      NavigationLink(destination: WorkoutView()) {
        VStack(alignment: .leading) {
          Spacer()
          Text(routine.name)
          Text(routine.level).foregroundColor(Color("appBlue"))
          Spacer()
        }
      }

    }
  }
}

struct WorkoutView: View {
  
  var body: some View {
    TabView {
      Text("Page One")
      Text("Page Two")
      Text("Page Three")
    }
    .tabViewStyle(PageTabViewStyle())
  }
}




struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
//        EquipmentView()
//        AreaView()
    }
}
