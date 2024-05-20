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
