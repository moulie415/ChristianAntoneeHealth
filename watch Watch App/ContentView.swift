//
//  ContentView.swift
//  watch Watch App
//
//  Created by Henry Moule on 06/11/2025.
//
import SwiftUI


struct WorkoutStartedView: View {
    var body: some View {
        VStack {
            Text("Workout Started")
            .font(.caption)
            .padding(.bottom)

            Image("dumbbell")
                .resizable()
                .scaledToFit()
                .frame(width: 50, height: 50)
        }
    }
}

struct LogoView: View {
    var body: some View {

      VStack {
        Image("logo")
          .resizable()
          .scaledToFit()
          .padding(20)
        
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
          CircularProgressView(
            value: Double(instance.goalData.calories),
            goal: Double(instance.goalData.caloriesGoal),
              label: "Calories burned"
          )
    }
}

struct MinutesView: View {
    @ObservedObject var instance = Singleton.instance
    
    var body: some View {
          CircularProgressView(
            value: Double(instance.goalData.mins),
            goal: Double(instance.goalData.minsGoal),
            label: "Active minutes"
          )
    }
}

struct WorkoutLevelScoreView: View {
    @ObservedObject var instance = Singleton.instance
    
    var body: some View {
          CircularProgressView(
            value: Double(instance.goalData.workoutLevelScore),
            goal: Double(instance.goalData.workoutGoal),
            label: "\(instance.goalData.workoutLevelTitleString) Workouts"
          )
    }
}


struct HomeView: View {
  
  @State private var isWorkoutStarted = false
  
  var body: some View {
    TabView {
      LogoView()
      WorkoutLevelScoreView()
      CaloriesView()
      MinutesView()
    }
    .tabViewStyle(PageTabViewStyle())
    .fullScreenCover(isPresented: $isWorkoutStarted) {
             WorkoutStartedView()
         }
         .onReceive(NotificationCenter.default.publisher(for: Notification.Name("WorkoutStarted")), perform: { _ in
             isWorkoutStarted = true
         })
         .onReceive(NotificationCenter.default.publisher(for: Notification.Name("WorkoutEnded")), perform: { _ in
             isWorkoutStarted = false
         })
  }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
      HomeView()
    }
}
