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
          .padding(20)

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

struct CircularProgressView: View {
    let value: Double
    let goal: Double
    let label: String
    
    var body: some View {
        VStack {
            ZStack {
                ProgressView(value: value, total: goal)
                .tint(Color.blue)
                .scaleEffect(1.8)
                    .progressViewStyle(CircularProgressViewStyle())
                    .frame(width: 100, height: 100) // Adjust the size as needed

                Text("\(Int(value))/\(Int(goal))")
                    .font(.caption)
                    .foregroundColor(.primary)
            }

            Text(label)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

struct CaloriesView: View {
    @ObservedObject var instance = Singleton.instance
    
    var body: some View {
        if let goalData = instance.goalData {
            CircularProgressView(
                value: Double(goalData.calories),
                goal: Double(goalData.caloriesGoal),
                label: "Calories burned"
            )
        } else {
            ProgressView()
        }
    }
}

struct MinutesView: View {
    @ObservedObject var instance = Singleton.instance
    
    var body: some View {
        if let goalData = instance.goalData {
            CircularProgressView(
                value: Double(goalData.mins),
                goal: Double(goalData.minsGoal),
                label: "Active minutes"
            )
        } else {
            ProgressView()
        }
    }
}

struct WorkoutLevelScoreView: View {
    @ObservedObject var instance = Singleton.instance
    
    var body: some View {
        if let goalData = instance.goalData, let workoutGoalInt = Int(goalData.workoutGoal) {
            CircularProgressView(
                value: Double(goalData.workoutLevelScore),
                goal: Double(workoutGoalInt),
                label: "\(goalData.workoutLevelTitleString) workouts"
            )
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
