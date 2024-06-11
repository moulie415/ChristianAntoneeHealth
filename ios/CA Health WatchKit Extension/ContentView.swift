//
//  ContentView.swift
//  CA Health WatchKit Extension
//
//  Created by Henry Moule on 30/05/2022.
//

import SwiftUI

struct LogoView: View {
    var body: some View {

      VStack {
        Image("logo")
          .resizable()
          .scaledToFit()
          .padding(.all)

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

struct CaloriesView: View {
  @ObservedObject var instance = Singleton.instance;
    var body: some View {
      if let goalData = instance.goalData {
        Text("\(goalData.calories )/\(goalData.caloriesGoal) Calories burned")
        } else {
            ProgressView()
        }
    }
}

struct MinutesView: View {
  @ObservedObject var instance = Singleton.instance;
    var body: some View {
      if let goalData = instance.goalData {
            Text("\(goalData.mins)/\(goalData.minsGoal) Active minutes")
        } else {
            ProgressView()
        }
    }
}

struct WorkoutLevelScoreView: View {
  @ObservedObject var instance = Singleton.instance;
    var body: some View {
      if let goalData = instance.goalData, let workoutGoalInt = Int(goalData.workoutGoal) {
            Text("\(goalData.workoutLevelScore)/\(workoutGoalInt) \(goalData.workoutLevelTitleString) workout")
        } else {
            ProgressView()
        }
    }
}




struct HomeView: View {
  
  var body: some View {
    TabView {
      LogoView()
      WorkoutLevelScoreView()
      CaloriesView()
      MinutesView()
    }
    .tabViewStyle(PageTabViewStyle())
  }
}




struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
      HomeView()
    }
}
